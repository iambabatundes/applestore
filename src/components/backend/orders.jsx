import React, { useState, useEffect } from "react";
import _ from "lodash";

import { paginate } from "../utils/paginate";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import OrderTable from "./orders/orderTable";
import OrderDetails from "./orderDetails";
import { getOrderDatas } from "./orderData";
import OrderHeader from "./orders/orderHeader";

export default function Orders() {
  const [orderData, setOrderData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [sortColumn, setSortColumn] = useState({
    path: "orderNumber",
    order: "asc",
  });
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order number
  const [isModalOpen, setIsModalOpen] = useState(null); // Track selected order number

  useEffect(() => {
    const fetchData = async () => {
      const data = getOrderDatas();
      setOrderData(data);
    };

    fetchData();
  }, []);

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleDelete() {}

  function handlePreview(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  function handleEdit() {}

  let filtered = orderData;
  if (searchQuery)
    filtered = orderData.filter((p) =>
      p.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1; // Enable pagination if more than one item

  const allOrderData = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <section>
      <OrderHeader />

      <section className="padding" style={{ marginTop: 80 }}>
        <span>
          <SearchBox onChange={handleSearch} value={searchQuery} />
          Showing {totalItems} Order{totalItems !== 1 ? "s" : ""}{" "}
        </span>

        <OrderTable
          data={allOrderData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onSort={handleSort}
          sortColumn={sortColumn}
        />

        <Pagination
          itemsCount={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        {isModalOpen && selectedOrder && (
          <OrderDetails onClose={closeModal} getOrderData={selectedOrder} />
        )}
      </section>
    </section>
  );
}
