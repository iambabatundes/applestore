import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./icon";
import "./styles/checkoutNavbar.css";
import Logo from "./home/common/logo";

export default function CheckoutNavbar({ cartItemCount, logoImage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //   const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    // setIsModalOpen(true);
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const handleReturnToCart = () => {
    setIsModalOpen(false);
    navigate("/cart");
  };

  const handleStayInCheckout = () => {
    setIsModalOpen(false);
  };

  return (
    <section>
      <div className="checkout-navbar">
        <Logo
          logoImage={logoImage}
          navbarBrand="checkout__main"
          brandLogo="checkout__logo"
        />

        <h1>
          Checkout (
          <span className="checkout-link" onClick={handleClick}>
            {cartItemCount}
            {cartItemCount === 0 || cartItemCount === 1 ? " item" : " items"}
          </span>
          )
        </h1>
        <Icon securedLock />
      </div>
      {isModalOpen && (
        <>
          <div className={`custom-modal ${isModalOpen ? "open" : ""}`}>
            <p>Are you sure you want to return to your shopping cart?</p>
            <span className="custom-modal__btn">
              <button className="return-button" onClick={handleReturnToCart}>
                Return to Cart
              </button>
              <button className="stay-button" onClick={handleStayInCheckout}>
                Stay in Checkout
              </button>
            </span>
          </div>
          <div className={`modal-arrow ${isModalOpen ? "open" : ""}`}></div>
        </>
      )}
    </section>
  );
}
