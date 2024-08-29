import React from "react";
import "./MoreToLove.css"; // Assuming you'll create a CSS file for styling

const products = [
  {
    id: 1,
    title: "XIAOMI Air Pro 6 TWS Wireless Earbuds",
    price: "₦6,542.57",
    originalPrice: "₦6,542.57",
    discount: "",
    shipping: "Free shipping over NGN15,798.41",
    image: "image-url-1", // replace with actual image URLs
    sold: "2,000+ sold",
  },
  // Add more product objects here
];

export default function MoreToLove() {
  return (
    <div className="more-to-love">
      <h2>More to love</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p className="price">{product.price}</p>
            {product.originalPrice && (
              <p className="original-price">{product.originalPrice}</p>
            )}
            {product.discount && <p className="discount">{product.discount}</p>}
            <p className="shipping">{product.shipping}</p>
            <p className="sold">{product.sold}</p>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
