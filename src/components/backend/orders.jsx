import React, { useState, useEffect, useRef, useCallback } from "react";
import _ from "lodash";
import SearchBox from "./common/searchBox";
import OrderTable from "./orders/orderTable";
import OrderDetails from "./orderDetails";
import OrderHeader from "./orders/orderHeader";
import "../backend/orders/styles/order.css";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../services/orderService";
import LoadingOrders from "./common/loadingOrder";
import EmptyOrders from "./common/emptyOrders";

export default function Orders() {
  // State management
  const [orderData, setOrderData] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortColumn, setSortColumn] = useState({
    path: "createdAt",
    order: "desc",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    startDate: "",
    endDate: "",
  });

  const observerTarget = useRef(null);
  const loadingTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    async function fetchOrders() {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const params = {
          page: 1,
          limit: 100,
          sortBy: sortColumn.path,
          sortOrder: sortColumn.order,
        };

        // Add filters
        if (filters.status) params.status = filters.status;
        if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (searchQuery) params.search = searchQuery;

        const response = await getOrders(params);

        // Backend returns { orders, pagination }
        const orders = response.orders || response || [];
        setOrderData(orders);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching orders:", err);
          setError(
            err.response?.data?.error ||
              "Failed to load orders. Please try again."
          );
          setOrderData([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, searchQuery, sortColumn]);

  const getFilteredAndSortedOrders = useCallback(() => {
    let filtered = orderData;

    // Additional client-side search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = orderData.filter((order) => {
        return (
          order.orderNumber?.toLowerCase().includes(query) ||
          order.user?.username?.toLowerCase().includes(query) ||
          order.user?.email?.toLowerCase().includes(query) ||
          order.shippingAddress?.firstName?.toLowerCase().includes(query) ||
          order.shippingAddress?.lastName?.toLowerCase().includes(query) ||
          order.trackingNumber?.toLowerCase().includes(query)
        );
      });
    }

    return _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
  }, [orderData, searchQuery, sortColumn]);

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

  const loadMoreOrders = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Simulate network delay for smooth UX
    loadingTimeoutRef.current = setTimeout(() => {
      const sorted = getFilteredAndSortedOrders();
      const nextPage = currentPage + 1;
      const endIndex = nextPage * pageSize;
      const newOrders = sorted.slice(0, endIndex);

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
    setCurrentPage(1);
  }

  async function handleDelete(order) {
    if (!order || !order._id) return;

    // Confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete order ${order.orderNumber}?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await deleteOrder(order._id);

      // Update local state
      const updatedOrders = orderData.filter((o) => o._id !== order._id);
      setOrderData(updatedOrders);

      // Show success message
      alert(`Order ${order.orderNumber} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting order:", err);
      alert(
        err.response?.data?.error || "Failed to delete order. Please try again."
      );
    }
  }

  function handlePreview(order) {
    if (!order) return;
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  function handleEdit(order) {
    // Implement edit functionality
    console.log("Edit order:", order);
    // Navigate to edit page or open edit modal
    // Example: history.push(`/orders/${order._id}/edit`);
  }

  async function handleStatusChange(order, newStatus) {
    if (!order || !order._id) return;

    // Validate status transition
    const currentStatus = order.orderStatus;
    const invalidTransitions = {
      cancelled: ["pending", "confirmed", "processing"],
      refunded: ["pending", "confirmed", "processing"],
      delivered: ["cancelled", "refunded"],
    };

    if (
      invalidTransitions[currentStatus] &&
      invalidTransitions[currentStatus].includes(newStatus)
    ) {
      alert(`Cannot change status from ${currentStatus} to ${newStatus}`);
      return;
    }

    try {
      // Update status via API
      const response = await updateOrderStatus(order._id, {
        orderStatus: newStatus,
        note: `Status changed to ${newStatus}`,
      });

      // Update local state
      const updatedOrderData = orderData.map((o) =>
        o._id === order._id ? { ...o, orderStatus: newStatus, ...response } : o
      );
      setOrderData(updatedOrderData);

      // Show success notification
      console.log(`Order ${order.orderNumber} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(
        err.response?.data?.error ||
          "Failed to update order status. Please try again."
      );
    }
  }

  function handleFilterChange(filterName, value) {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  }

  function handleClearFilters() {
    setFilters({
      status: "",
      paymentStatus: "",
      startDate: "",
      endDate: "",
    });
    setSearchQuery("");
  }

  const totalItems = getFilteredAndSortedOrders().length;
  const displayedCount = displayedOrders.length;
  const hasActiveFilters =
    searchQuery ||
    filters.status ||
    filters.paymentStatus ||
    filters.startDate ||
    filters.endDate;

  // Loading state
  if (loading) {
    return (
      <section>
        <section className="padding">
          <LoadingOrders />
        </section>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section>
        <section className="padding">
          <div className="error-container">
            <div className="error-icon">
              <i className="fa fa-exclamation-triangle"></i>
            </div>
            <h3>Failed to Load Orders</h3>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </section>
      </section>
    );
  }

  // if (orderData.length === 0 && !hasActiveFilters) {
  //   return (
  //     <section>
  //       <section className="padding">
  //         <EmptyOrders />
  //       </section>
  //     </section>
  //   );
  // }

  if (displayedOrders.length === 0 && hasActiveFilters) {
    return (
      <section>
        <OrderHeader />
        <section className="padding" style={{ marginTop: 80 }}>
          {/* Filters */}
          <div className="order-filters">
            <SearchBox onChange={handleSearch} value={searchQuery} />
            <div className="filter-controls">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={filters.paymentStatus}
                onChange={(e) =>
                  handleFilterChange("paymentStatus", e.target.value)
                }
                className="filter-select"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <button
                className="btn btn-secondary clear-filters-btn"
                onClick={handleClearFilters}
              >
                <i className="fa fa-times"></i> Clear Filters
              </button>
            </div>
          </div>

          <EmptyOrders
            hasSearchQuery={true}
            message="No orders match your search criteria"
          />
        </section>
      </section>
    );
  }

  return (
    <section>
      <OrderHeader />

      <section className="padding" style={{ marginTop: 30 }}>
        {/* Filters and Controls */}
        <div className="order-controls">
          <div className="search-and-filters">
            <SearchBox
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search by order number, customer, email, tracking..."
            />

            <div className="filter-controls">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="filter-select"
                aria-label="Filter by order status"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={filters.paymentStatus}
                onChange={(e) =>
                  handleFilterChange("paymentStatus", e.target.value)
                }
                className="filter-select"
                aria-label="Filter by payment status"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              {hasActiveFilters && (
                <button
                  className="btn btn-secondary clear-filters-btn"
                  onClick={handleClearFilters}
                  aria-label="Clear all filters"
                >
                  <i className="fa fa-times"></i> Clear
                </button>
              )}
            </div>
          </div>

          {/* Order Count */}
          <div className="order-count-container">
            <span className="order-count">
              Showing {displayedCount} of {totalItems} Order
              {totalItems !== 1 ? "s" : ""}
            </span>
            {isLoadingMore && (
              <span className="loading-more-text">
                <i className="fa fa-spinner fa-spin"></i> Loading more...
              </span>
            )}
          </div>
        </div>

        {/* Order Table */}
        <OrderTable
          data={displayedOrders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onSort={handleSort}
          sortColumn={sortColumn}
          onStatusChange={handleStatusChange}
        />

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="infinite-scroll-trigger">
          {isLoadingMore && (
            <div className="infinite-scroll-loading">
              <div className="spinner"></div>
              <span>Loading more orders...</span>
            </div>
          )}
          {!hasMore && displayedOrders.length > 0 && (
            <div className="infinite-scroll-end">
              <i className="fa fa-check-circle"></i> All orders loaded
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <OrderDetails onClose={closeModal} getOrderData={selectedOrder} />
        )}
      </section>
    </section>
  );
}
