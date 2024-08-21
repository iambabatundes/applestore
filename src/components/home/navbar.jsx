import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cart from "./images/cartItem.png";
import "./styles/navbar.css";
import UserSection from "./UserSection";
import { getCategories } from "../../services/categoryService";
import CategoriesSection from "./categoriesSection";

export default function Navbar({ user, cartItemCount = 0 }) {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [geoLocation, setGeoLocation] = useState("");

  useEffect(() => {
    if (!user) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.ipgeolocation.io/ipgeo?apiKey=74d7025b99284e5ab87ede8a6b623e9b&lat=${latitude}&long=${longitude}`
            );
            const data = await response.json();
            setGeoLocation(data.country_name);
          } catch (error) {
            console.error("Error fetching geolocation data: ", error);
          }
        },
        (error) => {
          console.error("Error getting user's location: ", error);
        }
      );
    }
  }, [user]);

  useEffect(() => {
    const fetchCategory = async () => {
      const { data: categories } = await getCategories();
      setCategories(categories);
    };

    fetchCategory();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img
            src="https://www.amazon.com/favicon.ico"
            alt="Brand Logo"
            className="brand-logo"
          />
        </Link>
      </div>

      <CategoriesSection categories={categories} />

      <form className="navbar-search">
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="search-button">
          <i className="fa fa-search"></i>
        </button>
      </form>

      <section className="navbar-actions">
        <UserSection
          user={user}
          geoLocation={geoLocation}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />
      </section>

      <div className="navbar-cart">
        <Link to="/cart" className="navbar-cart-link">
          <img src={cart} alt="Cart" className="navbar-cart-icon" />
          <h2 className="navbar-cart-text">Cart</h2>
          <div className="cart-item-count">{cartItemCount}</div>
        </Link>
      </div>

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
