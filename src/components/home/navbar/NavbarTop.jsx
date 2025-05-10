import React from "react";
import Logo from "../common/logo";
import UserSection from "../UserSection";
import Cart from "../common/cart";

export default function NavbarTop({
  isOpen,
  toggleMenu,
  logoImage,
  user,
  cartItemCount,
  toggleDropdown,
  isDropdownOpen,
}) {
  return (
    <div className="navbar__top">
      <button
        className={`navbar-burger ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <Logo
        logoImage={logoImage}
        brandLogo="brand-logo"
        navbarBrand="navbar-brand"
      />

      <section className="navbar__mobile_right">
        <UserSection
          user={user}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          className="navbar-user-mobile"
        />
        <Cart cartItemCount={cartItemCount} className="navbar-cart-mobile" />
      </section>
    </div>
  );
}
