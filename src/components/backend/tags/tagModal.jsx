import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getProductsByTag } from "../../../services/productService";
import "./styles/tagModal.css";

export default function TagModal({ tag, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data: fetchedProducts } = await getProductsByTag(tag._id);
        setProducts(fetchedProducts || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (tag) fetchProducts();
  }, [tag]);

  return (
    <Modal
      isOpen={!!tag}
      onRequestClose={onClose}
      className="tagModal__content"
      overlayClassName="tagModal__overlay"
      closeTimeoutMS={300}
      ariaHideApp={false}
    >
      <section className="tagModal">
        <button className="tagModal__close" onClick={onClose}>
          &times;
        </button>

        <h2 className="tagModal__title">{tag.name} Details</h2>
        <p className="tagModal__id">Tag ID: {tag._id}</p>

        <h3 className="tagModal__subtitle">Associated Products</h3>

        {loading ? (
          <p className="tagModal__loading">Loading products...</p>
        ) : products.length > 0 ? (
          <ul className="tagModal__list">
            {products.map((product) => (
              <li key={product._id} className="tagModal__list-item">
                {product.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="tagModal__empty">
            🌱 No associated products yet — add one to bring this tag to life!
          </p>
        )}

        <div className="tagModal__footer">
          <button onClick={onClose} className="tagModal__button">
            Close
          </button>
        </div>
      </section>
    </Modal>
  );
}
