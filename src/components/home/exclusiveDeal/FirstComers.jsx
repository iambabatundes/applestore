import React, { useState, useEffect } from "react";
import "../styles/exclusiveDeal.css";
import { Link } from "react-router-dom";
import ProductList from "./ProductList";
import { getProductsByPromotion } from "../../../services/productService";
const groupProducts = (products, chunkSize) => {
  const groups = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    groups.push(products.slice(i, i + chunkSize));
  }
  return groups;
};

const INITIAL_GROUP_COUNT = 3;

export default function FirstComers({
  user,
  selectedCurrency,
  conversionRate,
}) {
  const [products, setProducts] = useState([]);
  const [displayedGroups, setDisplayedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getProductsByPromotion("Sale");
        // setProducts(data);

        const mergedProducts = [...data];
        const groupedProducts = groupProducts(mergedProducts, 2);

        setProducts(groupedProducts);
        setDisplayedGroups(groupedProducts.slice(0, INITIAL_GROUP_COUNT));
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="firstComers">
      {!user && (
        <section className="firstComers__action">
          <button className="firstComers__btn firstComers__register">
            <Link to="/register">Register</Link>
          </button>

          <button className="firstComers__btn firstComers__signIn">
            <Link to="/login">Sign in</Link>
          </button>
        </section>
      )}

      <section className="firstComers__offer">
        <h1 className="firstComers__offer-title">
          First<span className="firstComers__come">Come, </span>
          <span className="firstComers__50off">50% off</span>
        </h1>
        <button className="firstComers__offer-label">Shipping</button>
        <span className="firstComers__offer-subtitle">Free Shipping</span>

        {displayedGroups.map((group, index) => (
          <ProductList
            key={index}
            products={group}
            conversionRate={conversionRate}
            selectedCurrency={selectedCurrency}
            containerClassName="firstComers__products"
            productClassName="firstComers__product"
            imageClassName="firstComers__productImage"
            priceClassName="firstComers__productPrice"
            priceContainer="firstComers__priceContainer"
            discountClassName="firstComers__discount"
          />
        ))}

        {/* {displayedGroups.length < allProductGroups.length && (
          <button className="firstComers__loadMore" onClick={handleLoadMore}>
            Load More
          </button>
        )} */}
      </section>
    </div>
  );
}
