import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import "../styles/superDeal.css";
import { getProductsByPromotion } from "../../../services/productService";

const groupProducts = (products, chunkSize) => {
  const groups = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    groups.push(products.slice(i, i + chunkSize));
  }
  return groups;
};

const INITIAL_GROUP_COUNT = 1;

export default function SuperDeal({ selectedCurrency, conversionRate }) {
  const [products, setProducts] = useState([]);
  const [displayedGroups, setDisplayedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getProductsByPromotion("SuperDeal");
        // setProducts(data);

        const mergedProducts = [...data];
        const groupedProducts = groupProducts(mergedProducts, 3);

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
    <section className="superDeal">
      <h1 className="superDeal__offer-title">
        Super<span className="superDeal__deal">Deal</span>
      </h1>
      <article className="superDeal__label">
        <button className="superDeal__offer-label">Limited</button>
        <span className="superDeal__offer-subtitle">Limited Time Offers</span>
      </article>
      {displayedGroups.map((group, index) => (
        <ProductList
          products={group}
          key={index}
          conversionRate={conversionRate}
          selectedCurrency={selectedCurrency}
          containerClassName="superDeal__products"
          productClassName="superDeal__product"
          imageClassName="superDeal__productImage"
          priceClassName="superDeal__productPrice"
          oldPriceClassName="superDeal__oldPrice"
        />
      ))}
    </section>
  );
}
