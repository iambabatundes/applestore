import React from "react";
import { Link } from "react-router-dom";
import "../styles/userAddress.css";

export default function UserAddress({ user, geoLocation }) {
  return (
    <>
      {!user ? (
        <div className="navbar-user-address">
          <Link to="/address" className="navbar-user__main">
            <i className="fa fa-map-marker map-marker"></i>
            <div className="navbar-signin-main">
              <h1 className="navbar-user-deliver">Deliver to!</h1>
              <span>{geoLocation || "Loading..."}</span>
            </div>
          </Link>
        </div>
      ) : (
        <div className="navbar-user-address">
          <Link to="/address" className="navbar-address__main">
            <i className="fa fa-map-marker map-marker"></i>
            <div className="navbar-address__container">
              <h1 className="navbar-user-deliver">Deliver to!</h1>
              <span>{user.address?.country || geoLocation}</span>
            </div>
          </Link>
        </div>
      )}
    </>
  );
}
