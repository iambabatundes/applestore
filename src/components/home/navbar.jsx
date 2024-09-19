import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";
import UserSection from "./UserSection";
import CategoriesSection from "./categoriesSection";
import Logo from "./common/logo";
import { useCategories } from "./hooks/useCategories";
import { useGeoLocation } from "./hooks/useGeoLocation";
import { useCurrency } from "./hooks/useCurrency";
import SearchBar from "./common/searchBar";
import Cart from "./common/cart";
import Currency from "./common/currency";

export default function Navbar({
  user,
  cartItemCount = 0,
  onCurrencyChange,
  logoImage,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = useCategories();
  const geoLocation = useGeoLocation(user);
  const {
    selectedCurrency,
    // conversionRate,
    currencyRates,
    handleCurrencyChange,
    loading,
    error,
  } = useCurrency("NGN", onCurrencyChange, user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="navbar">
      <Logo
        logoImage={logoImage}
        brandLogo="brand-logo"
        navbarBrand="navbar-brand"
      />
      <CategoriesSection categories={categories} />
      <SearchBar />

      <Currency
        currencies={currencyRates}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
        loading={loading}
        error={error}
      />

      <section className="navbar-actions">
        <UserSection
          user={user}
          geoLocation={geoLocation}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />
      </section>

      <Cart cartItemCount={cartItemCount} />
      <div className={`navbar-menu ${isOpen ? "is-active" : ""}`}>
        <Link to="#orders">Returns & Orders</Link>
      </div>
      <button className="navbar-burger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
