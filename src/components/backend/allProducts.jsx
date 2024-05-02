import React, { useState, useEffect } from "react";
import _ from "lodash";

// import "./styles/posts.css";
import Header from "./common/header";
import { getProducts } from "../productData";
import ProductTable from "../products/productTable";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";

export default function AllProduct() {
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });

  useEffect(() => {
    setProductData(getProducts);
  }, [productData]);

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleDelete() {}
  function handlePreview() {}
  function handleEdit() {}

  let filtered = productData;
  if (searchQuery)
    filtered = productData.filter((p) =>
      p.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1; // Enable pagination if more than one item

  const allProductData = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <section className="padding">
      <Header
        headerTitle="Products"
        buttonTitle="Add New"
        to="/admin/add-product"
      />

      <section>
        <span>
          <SearchBox onChange={handleSearch} value={searchQuery} />
          Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
        </span>

        <ProductTable
          currentPosts={allProductData}
          onSort={handleSort}
          sortColumn={sortColumn}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onPreview={handlePreview}
        />

        <Pagination
          itemsCount={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </section>
    </section>
  );
}
