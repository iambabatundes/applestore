// import React, { useState, useEffect } from "react";
// import _ from "lodash";
// import { paginate } from "../utils/paginate";
// import SearchBox from "./common/searchBox";
// import Pagination from "./common/pagination";
// import OrderTable from "./orders/orderTable";
// import OrderDetails from "./orderDetails";
// import OrderHeader from "./orders/orderHeader";
// import "../backend/orders/styles/order.css";
// import { getOrders } from "../../services/orderService";
// import LoadingOrders from "./common/loadingOrder";
// import EmptyOrders from "./common/emptyOrders";

// export default function Orders() {
//   const [orderData, setOrderData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(4);
//   const [sortColumn, setSortColumn] = useState({
//     path: "orderNumber",
//     order: "asc",
//   });
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function getOrder() {
//       try {
//         setLoading(true);
//         const orderData = await getOrders();
//         setOrderData(orderData || []);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setOrderData([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     getOrder();
//   }, []);

//   function handleSort(sortColumns) {
//     setSortColumn(sortColumns);
//   }

//   function handleSearch(query) {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   }

//   function handleDelete() {
//     // Delete logic here
//   }

//   function handlePreview(order) {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   }

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedOrder(null);
//   };

//   function handleEdit() {
//     // Edit logic here
//   }

//   function handleStatusChange(order, status) {
//     const updatedOrderData = orderData.map((o) =>
//       o.orderNumber === order.orderNumber ? { ...o, status } : o
//     );
//     setOrderData(updatedOrderData);
//   }

//   let filtered = orderData;
//   if (searchQuery)
//     filtered = orderData.filter((p) =>
//       p.title.toLowerCase().startsWith(searchQuery.toLowerCase())
//     );

//   const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

//   const totalItems = filtered.length;
//   const paginationEnabled = totalItems > 1;

//   const allOrderData = paginationEnabled
//     ? paginate(sorted, currentPage, pageSize)
//     : sorted;

//   // Show loading state
//   if (loading) {
//     return (
//       <section>
//         <OrderHeader />
//         <section className="padding" style={{ marginTop: 80 }}>
//           <LoadingOrders />
//         </section>
//       </section>
//     );
//   }

//   if (orderData.length === 0) {
//     return (
//       <section>
//         <OrderHeader />
//         <section className="padding" style={{ marginTop: 80 }}>
//           <EmptyOrders />
//         </section>
//       </section>
//     );
//   }

//   if (filtered.length === 0 && orderData.length > 0) {
//     return (
//       <section>
//         <OrderHeader />
//         <section className="padding" style={{ marginTop: 80 }}>
//           <SearchBox onChange={handleSearch} value={searchQuery} />
//           <EmptyOrders
//             hasSearchQuery={true}
//             onCreateOrder={handleCreateOrder}
//           />
//         </section>
//       </section>
//     );
//   }

//   return (
//     <section>
//       <OrderHeader />

//       <section className="padding" style={{ marginTop: 80 }}>
//         <span>
//           <SearchBox onChange={handleSearch} value={searchQuery} />
//           Showing {totalItems} Order{totalItems !== 1 ? "s" : ""}{" "}
//         </span>

//         <OrderTable
//           data={allOrderData}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onPreview={handlePreview}
//           onSort={handleSort}
//           sortColumn={sortColumn}
//           onStatusChange={handleStatusChange}
//         />

//         <Pagination
//           itemsCount={filtered.length}
//           pageSize={pageSize}
//           currentPage={currentPage}
//           onPageChange={setCurrentPage}
//         />

//         {isModalOpen && selectedOrder && (
//           <OrderDetails onClose={closeModal} getOrderData={selectedOrder} />
//         )}
//       </section>
//     </section>
//   );
// }

import React, { useState, useEffect, useRef, useCallback } from "react";
import _ from "lodash";
import SearchBox from "./common/searchBox";
import OrderTable from "./orders/orderTable";
import OrderDetails from "./orderDetails";
import OrderHeader from "./orders/orderHeader";
import "../backend/orders/styles/order.css";
import { getOrders } from "../../services/orderService";
import LoadingOrders from "./common/loadingOrder";
import EmptyOrders from "./common/emptyOrders";

export default function Orders() {
  const [orderData, setOrderData] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState({
    path: "orderNumber",
    order: "asc",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerTarget = useRef(null);
  const loadingTimeoutRef = useRef(null);

  useEffect(() => {
    async function getOrder() {
      try {
        setLoading(true);
        const orderData = await getOrders();
        setOrderData(orderData || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrderData([]);
      } finally {
        setLoading(false);
      }
    }

    getOrder();
  }, []);

  // Filter and sort orders
  const getFilteredAndSortedOrders = useCallback(() => {
    let filtered = orderData;
    if (searchQuery) {
      filtered = orderData.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
  }, [orderData, searchQuery, sortColumn]);

  // Load initial data and reset when filters change
  useEffect(() => {
    const sorted = getFilteredAndSortedOrders();
    const initial = sorted.slice(0, pageSize);
    setDisplayedOrders(initial);
    setCurrentPage(1);
    setHasMore(sorted.length > pageSize);
  }, [
    orderData,
    searchQuery,
    sortColumn,
    pageSize,
    getFilteredAndSortedOrders,
  ]);

  // Load more orders
  const loadMoreOrders = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Simulate network delay for smooth UX
    loadingTimeoutRef.current = setTimeout(() => {
      const sorted = getFilteredAndSortedOrders();
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * pageSize;
      const newOrders = sorted.slice(startIndex, endIndex);

      setDisplayedOrders(newOrders);
      setCurrentPage(nextPage);
      setHasMore(endIndex < sorted.length);
      setIsLoadingMore(false);
    }, 300);
  }, [
    currentPage,
    pageSize,
    hasMore,
    isLoadingMore,
    getFilteredAndSortedOrders,
  ]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreOrders();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreOrders]);

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
  }

  function handleDelete(order) {
    // Delete logic here
    const updatedOrders = orderData.filter(
      (o) => o.orderNumber !== order.orderNumber
    );
    setOrderData(updatedOrders);
  }

  function handlePreview(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  function handleEdit(order) {
    // Edit logic here
    console.log("Edit order:", order);
  }

  function handleStatusChange(order, status) {
    const updatedOrderData = orderData.map((o) =>
      o.orderNumber === order.orderNumber ? { ...o, status } : o
    );
    setOrderData(updatedOrderData);
  }

  const totalItems = getFilteredAndSortedOrders().length;
  const displayedCount = displayedOrders.length;

  // Show loading state
  if (loading) {
    return (
      <section>
        {/* <OrderHeader /> */}
        <section
          className="padding"
          // style={{ marginTop: 80 }}
        >
          <LoadingOrders />
        </section>
      </section>
    );
  }

  // Show empty state
  if (orderData.length === 0) {
    return (
      <section>
        {/* <OrderHeader /> */}
        <section
          className="padding"
          // style={{ marginTop: 80 }}
        >
          <EmptyOrders />
        </section>
      </section>
    );
  }

  // Show no results state
  if (displayedOrders.length === 0 && orderData.length > 0) {
    return (
      <section>
        <OrderHeader />
        <section className="padding" style={{ marginTop: 80 }}>
          <SearchBox onChange={handleSearch} value={searchQuery} />
          <EmptyOrders hasSearchQuery={true} />
        </section>
      </section>
    );
  }

  return (
    <section>
      <OrderHeader />

      <section className="padding" style={{ marginTop: 80 }}>
        <div className="order-controls">
          <SearchBox onChange={handleSearch} value={searchQuery} />
          <div className="order-count-container">
            <span className="order-count">
              Showing {displayedCount} of {totalItems} Order
              {totalItems !== 1 ? "s" : ""}
            </span>
            {isLoadingMore && (
              <span className="loading-more-text">Loading more...</span>
            )}
          </div>
        </div>

        <OrderTable
          data={displayedOrders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onSort={handleSort}
          sortColumn={sortColumn}
          onStatusChange={handleStatusChange}
        />

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="infinite-scroll-trigger">
          {isLoadingMore && (
            <div className="infinite-scroll-loading">
              <div className="spinner"></div>
            </div>
          )}
          {!hasMore && displayedOrders.length > 0 && (
            <div className="infinite-scroll-end">No more orders to load</div>
          )}
        </div>

        {isModalOpen && selectedOrder && (
          <OrderDetails onClose={closeModal} getOrderData={selectedOrder} />
        )}
      </section>
    </section>
  );
}
