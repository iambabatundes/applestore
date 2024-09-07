import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";
import UserSection from "./UserSection";
import CategoriesSection from "./categoriesSection";
import Logo from "./common/logo";
import { useCategories } from "./hooks/useCategories";
import { useGeoLocation } from "./hooks/useGeoLocation";
import SearchBar from "./common/searchBar";
import Cart from "./common/cart";
import Currency from "./common/currency";

export default function Navbar({ user, cartItemCount = 0, onCurrencyChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currencyRates, setCurrencyRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("₦");
  const [conversionRate, setConversionRate] = useState(1);

  const categories = useCategories();
  const geoLocation = useGeoLocation(user);

  // Fetch the conversion rates on mount
  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/6991faf3937f8f0023aff58c/latest/NGN"
        );
        const data = await response.json();
        setCurrencyRates(data.conversion_rates);
      } catch (error) {
        console.error("Error fetching currency data:", error);
      }
    };

    fetchCurrencyRates();
  }, []);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    const rate = currencyRates[currency] || 1;
    setConversionRate(rate);
    onCurrencyChange(currency, rate);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="navbar">
      <Logo />
      <CategoriesSection categories={categories} />
      <SearchBar />

      <Currency
        currencies={currencyRates}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
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
