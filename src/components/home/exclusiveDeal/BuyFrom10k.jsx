import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import { getProductsByPromotion } from "../../../services/productService";
import SuperDeal from "./superDeal";

const INITIAL_GROUP_COUNT = 1;

export default function BuyFrom10k({ conversionRate, selectedCurrency }) {
  const [products, setProducts] = useState([]);
  const [displayedGroups, setDisplayedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const groupProducts = (products, chunkSize) => {
    const groups = [];
    for (let i = 0; i < products.length; i += chunkSize) {
      groups.push(products.slice(i, i + chunkSize));
    }
    return groups;
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getProductsByPromotion("Shipping");
        console.log("Shipping products response:", response);

        const productsArray =
          response.data || response.products || response || [];

        // Ensure it's an array
        if (!Array.isArray(productsArray)) {
          console.error("Products is not an array:", productsArray);
          setProducts([]);
          setDisplayedGroups([]);
          setError("Invalid data format");
          return;
        }

        // Check if products exist
        if (productsArray.length === 0) {
          setProducts([]);
          setDisplayedGroups([]);
          return;
        }

        const groupedProducts = groupProducts(productsArray, 3);
        setProducts(groupedProducts);
        setDisplayedGroups(groupedProducts.slice(0, INITIAL_GROUP_COUNT));
        setError(null);
      } catch (err) {
        console.error("Error fetching shipping products:", err);
        setError("Failed to load products");
        setProducts([]);
        setDisplayedGroups([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
  if (displayedGroups.length === 0) {
    return <p>No products available for this promotion.</p>;
  }

  return (
    <div className="buyFrom10k">
      <section className="buyFrom10k__offer">
        <h1 className="buyFrom10k__offer-title">
          Free <span className="buyFrom10k__shipping">Shipping</span>, 50% off
        </h1>
        <div className="shipping__flex">
          <button className="buyFrom10k__offer-label">Shipping</button>
          <span className="buyFrom10k__offer-subtitle">Free Shipping</span>
        </div>
        {displayedGroups.map((group, index) => (
          <ProductList
            products={group}
            key={index}
            conversionRate={conversionRate}
            selectedCurrency={selectedCurrency}
            containerClassName="buyFrom10k__products"
            productClassName="buyFrom10k__product"
            imageClassName="buyFrom10k__productImage"
            priceClassName="buyFrom10k__productPrice"
            discountClassName="buyFrom10k__discount"
            priceContainer="buyFrom10k__priceContainer"
          />
        ))}
      </section>

      {/* Super Deal Section */}
      <SuperDeal
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
    </div>
  );
}
