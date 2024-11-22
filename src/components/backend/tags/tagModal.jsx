import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getProductsByTag } from "../../../services/productService";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px", // corrected typo
    maxWidth: "80%",
    maxHeight: "80%",
    overflow: "auto",
  },
};

export default function TagModal({ tag, onClose }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: fetchedProducts } = await getProductsByTag(tag._id); // Fetch products using the tag ID
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    if (tag) {
      fetchProducts();
    }
  }, [tag]);

  return (
    <Modal
      isOpen={tag !== null}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <section>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{tag.name} Details</h2>
        {/* Display tag details */}
        <p>Tag ID: {tag._id}</p>
        {/* Display associated products */}
        <h3>Associated Products:</h3>

        <ul>
          {products.map((product) => (
            <li key={product._id}>{product.name}</li>
          ))}
        </ul>

        <button onClick={onClose}>Close</button>
      </section>
    </Modal>
  );
}
