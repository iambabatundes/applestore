import React, { useState } from "react";
import "./styles/singleProduct.css";
import ShippingDetails from "./common/shippingDetails";

export default function SingleProduct() {
  const [selectedColor, setSelectedColor] = useState("Grey");
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  return (
    <section className="singleProduct-container">
      <div className="singleProduct__left">
        <section>Home</section>
        <section></section>
      </div>
      <div className="singleProduct__shippingDetail">
        <ShippingDetails />
      </div>
    </section>
  );
}
