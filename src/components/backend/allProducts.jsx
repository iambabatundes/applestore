import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";

import "../backend/products/styles/product.css";
import ProductTable from "./products/productTable";
import { deleteProduct, getProducts } from "../../services/productService";
import { paginate } from "../utils/paginate";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import ProductHeader from "./products/productHeader";

export default function AllProduct() {
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [sortColumn, setSortColumn] = useState({ path: "", order: "asc" });

  const navigate = useNavigate();

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

  async function handleDelete(product) {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const originalProducts = productData;
    const updatedProducts = originalProducts.filter(
      (p) => p._id !== product._id
    );
    setProductData(updatedProducts);

    try {
      await deleteProduct(product._id);
      toast.success("Post deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This product has already been deleted");
      setProductData(updatedProducts);
    }
  }
  function handlePreview() {}

  const handleEdit = (product) => {
    navigate(`/admin/add-product/${product._id}`);
  };

  let filtered = productData;
  if (searchQuery)
    filtered = productData.filter((p) =>
      p.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  let sorted = filtered;
  if (sortColumn.path) {
    sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
  } else {
    sorted = _.orderBy(filtered, ["createdAt", "updatedAt"], ["desc"]);
  }

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1;

  const allProductData = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <>
      <section className="fade-in-up">
        <ProductHeader />

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
