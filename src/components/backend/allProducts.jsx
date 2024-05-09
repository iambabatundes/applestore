import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

// import "./styles/posts.css";
import "../backend/products/styles/product.css";
import ProductTable from "./products/productTable";
import { getProducts } from "../../services/productService";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";

export default function AllProduct() {
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });

  useEffect(() => {
    async function getProduct() {
      const { data: productData } = await getProducts();
      setProductData(productData);
    }

    getProduct();
  }, []);

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
    <>
      <section>
        <header className="product__header">
          <h1 className="headerData-title">Products</h1>
          <Link to="/admin/add-product">
            <button className="headerData-btn">Add New</button>
          </Link>

          <Link to="/admin/add-product">
            <button className="headerData-btn">Import</button>
          </Link>

          <Link to="/admin/add-product">
            <button className="headerData-btn">Export</button>
          </Link>

          <span>
            <button className="headerData-btn">Download Sample</button>
          </span>
        </header>

        <section className="padding" style={{ marginTop: 80 }}>
          <span>
            <SearchBox onChange={handleSearch} value={searchQuery} />
            Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
          </span>

          <ProductTable
            productData={allProductData}
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
    </>
  );
}
