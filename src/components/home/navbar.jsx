import React, { useState, useEffect, useRef } from "react";
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
import UserAddress from "./common/userAddress";
import NavbarTop from "./navbar/NavbarTop";
import NavbarMenu from "./navbar/NavbarMenu";

export default function Navbar({
  user,
  cartItemCount = 0,
  onCurrencyChange,
  logoImage,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  // const dropdownRef = useRef(null);

  const categories = useCategories();
  const {
    geoLocation,
    loading: locationLoading,
    error: locationError,
  } = useGeoLocation();
  const {
    selectedCurrency,
    currencyRates,
    handleCurrencyChange,
    loading: currencyLoading,
    error: currencyError,
  } = useCurrency(onCurrencyChange);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <section className="navbar__main">
      <header className="navbar">
        <NavbarTop
          isOpen={isOpen}
          toggleMenu={() => setIsOpen(!isOpen)}
          logoImage={logoImage}
          user={user}
          cartItemCount={cartItemCount}
          toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
          isDropdownOpen={isDropdownOpen}
        />

        <CategoriesSection categories={categories} />
        <SearchBar />

        <UserAddress geoLocation={geoLocation.country_name} user={user} />

        <Currency
          currencies={currencyRates}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={(value) => {
            handleCurrencyChange(value);
            setIsOpen(false); // Close on currency change
          }}
          loading={currencyLoading}
          error={currencyError}
        />

        <section className="navbar-actions">
          <UserSection
            user={user}
            geoLocation={geoLocation.country}
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </section>

        <Cart cartItemCount={cartItemCount} />

        {isOpen && (
          <div className="navbar-backdrop" onClick={() => setIsOpen(false)} />
        )}

        <NavbarMenu
          isOpen={isOpen}
          categories={categories}
          currencyRates={currencyRates}
          selectedCurrency={selectedCurrency}
          handleCurrencyChange={handleCurrencyChange}
          currencyLoading={currencyLoading}
          currencyError={currencyError}
          setIsOpen={setIsOpen}
          menuRef={menuRef}
        />
      </header>
    </section>
  );
}
