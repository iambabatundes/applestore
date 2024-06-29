import React, { useState, useEffect } from "react";
import "./styles/userProfile.css";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaStar,
  FaHome,
  FaBox,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCog,
  FaTimes,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import image from "./images/bac1.jpg";
import defaultImage from "./images/user.png";

export default function UserProfile({ user }) {
  const [greeting, setGreeting] = useState("Good day");
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  return (
    <section className="userProfile">
      <div
        className={`user-profile ${
          isLeftSidebarOpen ? "left-sidebar-open" : ""
        }`}
      >
        {isLeftSidebarOpen ? (
          <aside className="sidebar-left open">
            <div className="sidebar-toggle-left" onClick={toggleLeftSidebar}>
              <FaTimes className="icon" />
            </div>
            <div className="profile-section">
              <img
                src={user.profileImage || defaultImage}
                alt=""
                className="profile-pic"
              />
              <h2>{user.firstName}</h2>
              <p>{user.email}</p>
            </div>
            <nav className="menu">
              <Link to="/userDashboard">
                <FaHome className="menu-icon" /> Dashboard
              </Link>
              <Link to="/userDashboard">
                <FaUser className="menu-icon" /> Account
              </Link>
              <Link to="/userOrder">
                <FaBox className="menu-icon" /> Order
              </Link>
              <Link to="/userMessages">
                <FaEnvelope className="menu-icon" /> Messages
              </Link>
              <Link to="/userAddress">
                <FaMapMarkerAlt className="menu-icon" /> Address
              </Link>
              <Link to="/userSettings">
                <FaCog className="menu-icon" /> Settings
              </Link>
            </nav>
            <div className="userUpgrade">
              <h1>
                <FaStar className="menu-icon" /> Upgrade to Premium
              </h1>
              <button className="upgrade__btn">Get Started</button>
            </div>
          </aside>
        ) : (
          <div
            className="sidebar-toggle-left closed"
            onClick={toggleLeftSidebar}
          >
            <FaArrowRight className="icon" />
            <span className="content-open">Open</span>
          </div>
        )}

        <main className="main-content">
          <nav className="top-navbar">
            <div className="navbar-left">
              <h1>
                {greeting}, {user.username}!
              </h1>
              <FaBell className="icon" />
              <button className="new-course-btn">Order New Product</button>
            </div>
            <div className="navbar-right">
              <FaSearch className="icon" />

              <FaBars className="icon" />
            </div>
          </nav>

          <div className="stats">
            <div className="stat stat-background">
              <h2>$ 500</h2>
              <p>spent</p>
            </div>
            <div className="stat stat-background1">
              <h2>21</h2>
              <p>Order Completed</p>
            </div>
            <div className="stat stat-background2">
              <h2>43</h2>
              <p>Total Order</p>
            </div>
          </div>

          <div className="yourOrders">
            <div>
              <h2>My Orders</h2>
            </div>
            <div className="yourOrder">
              <p>Colour theory</p>
              <span className="grade">80/100</span>
              <span className="status completed">Completed</span>
            </div>
            <div className="yourOrder">
              <p>Composition</p>
              <span className="grade">95/100</span>
              <span className="status completed">Completed</span>
            </div>
            <div className="yourOrder">
              <p>UX writing</p>
              <span className="grade">In Progress</span>
              <span className="status in-progress">In Progress</span>
            </div>
          </div>

          <section className="userProduct-pick">
            <h2>Top Product for you</h2>
            <div className="top-productMain">
              <div className="top-product">
                <img
                  className="top-product__image"
                  src={image}
                  alt=""
                  srcset=""
                />

                <h1 className="product-title">Apple 2354 for sell</h1>
                <div className="Userprice__section">
                  <span>
                    <h2 className="price">$3,000</h2>
                    <h2 className="discount__price">$2,800</h2>
                  </span>

                  <span>Add to cart</span>
                </div>
              </div>
              <div className="top-product">
                <img
                  className="top-product__image"
                  src={image}
                  alt=""
                  srcset=""
                />
                <h1 className="product-title">Mongo 2354 for sell</h1>
                <div className="Userprice__section">
                  <span>
                    <h2 className="price">$3,000</h2>
                    <h2 className="discount__price">$2,800</h2>
                  </span>

                  <span>Add to cart</span>
                </div>
              </div>
              <div className="top-product">
                <img
                  className="top-product__image"
                  src={image}
                  alt=""
                  srcset=""
                />
                <h1 className="product-title">Orange 2354 for sell</h1>
                <div className="Userprice__section">
                  <span>
                    <h2 className="price">$3,000</h2>
                    <h2 className="discount__price">$2,800</h2>
                  </span>

                  <span>Add to cart</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="sidebar-right">
          <div className="calendar">
            <h2>August 2023</h2>
            <div className="calendar-grid">{/* Calendar grid */}</div>
          </div>
          <div className="schedule">
            <h2>Schedule</h2>
            <div className="event">
              <p>Learn user flow</p>
              <span className="time">09:00 AM - 10:00 AM</span>
            </div>
            <div className="event">
              <p>Identify user pains</p>
              <span className="time">12:00 PM - 01:00 PM</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
