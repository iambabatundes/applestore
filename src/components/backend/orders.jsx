import React, { useState, useEffect } from "react";
import _ from "lodash";

import OrderTable from "./orderTable";
import Header from "./common/header";
import { paginate } from "../utils/paginate";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import OrderDetails from "./orderDetails";
import { getOrderDatas, getOrderData } from "./orderData";

export default function Orders() {
  const [orderData, setOrderData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [sortColumn, setSortColumn] = useState({
    path: "orderNumber",
    order: "asc",
  });
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(null); // Track selected order number

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
  // function handlePreview() {}
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

  const getOrderDataById = async (orderNumber) => {
    try {
      // Fetch order details based on the orderNumber
      const orderDetails = getOrderData(orderNumber);

      // Return the order details
      return orderDetails;
    } catch (error) {
      // Handle any errors that occur during the fetch request
      console.error("Error fetching order details:", error);
      return null; // Return null if an error occurs
    }
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrderNumber(null);
  };

  return (
    <section className="padding">
      <Header headerTitle="Order" />

      <span>
        <SearchBox onChange={handleSearch} value={searchQuery} />
        Showing {totalItems} Order{totalItems !== 1 ? "s" : ""}{" "}
      </span>

      {selectedOrderNumber && (
        <OrderDetails
          orderNumber={selectedOrderNumber}
          onClose={handleCloseOrderDetails}
          getOrderData={getOrderDataById}
        />
      )}

      <OrderTable
        data={allOrderData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={(orderNumber) => setSelectedOrderNumber(orderNumber)}
        onSort={handleSort}
        sortColumn={sortColumn}
      />

      <Pagination
        itemsCount={filtered.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
