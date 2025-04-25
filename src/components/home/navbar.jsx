import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";
import UserSection from "./UserSection";
import CategoriesSection from "./categoriesSection";
import Logo from "./common/logo";
import { useCategories } from "./hooks/useCategories";
import SearchBar from "./common/searchBar";
import Cart from "./common/cart";
import Currency from "./common/currency";

export default function Navbar({
  user,
  cartItemCount = 0,
  onCurrencyChange,
  logoImage,
  selectedCurrency,
  currencyRates,
  loading: currencyLoading,
  error: currencyError,
  geoLocation,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = useCategories();

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-header-main">
          <button className="navbar-burger" onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Logo
            logoImage={logoImage}
            brandLogo="brand-logo"
            navbarBrand="navbar-brand"
          />
        </div>
        <div className="navbar-header-actions">
          <section className="navbar-actions">
            <UserSection
              user={user}
              geoLocation={geoLocation.country}
              isDropdownOpen={isDropdownOpen}
              toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          </section>
          <Cart cartItemCount={cartItemCount} />
        </div>
      </div>

      <div className="nameSearch">
        <SearchBar />
      </div>

      <div className={`navbar-menu ${isOpen ? "is-active" : ""}`}>
        <CategoriesSection categories={categories} />
        <Currency
          currencies={currencyRates}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={onCurrencyChange}
          loading={currencyLoading}
          error={currencyError}
        />
        <Link to="#orders">Returns & Orders</Link>
      </div>
    </header>
  );
}
