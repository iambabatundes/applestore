import React, { useEffect, useState } from "react";
import { getTopProducts } from "../../services/topProductService";
import config from "../../config.json";
import "./styles/topProduct.css";

export default function TopProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: products } = await getTopProducts();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="userProduct-pick">
      <h2>Top Products for You</h2>

      <div className="top-productMain">
        {products.map((product) => (
          <div className="top-product" key={product._id}>
            <img
              className="top-product__image"
              src={`${config.mediaUrl}/uploads/${product.featureImage.filename}`}
              alt={product.name}
            />
            <h1 className="product-title">{product.name}</h1>
            <div className="Userprice__section">
              <span>
                <h2 className="price">${product.price}</h2>
                <h2 className="discount__price">${product.salePrice}</h2>
              </span>
              <button className="add-to-cart-button">Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
