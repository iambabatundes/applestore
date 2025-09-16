import React from "react";
import "./styles/appSkeleton.css";

const AppSkeleton = () => {
  return (
    <div className="app-skeleton">
      {/* Navbar skeleton */}
      <nav className="navbar-skeleton">
        <div className="navbar-container">
          {/* Logo skeleton */}
          <div
            className="skeleton skeleton-logo"
            style={{
              width: "120px",
              height: "40px",
              borderRadius: "4px",
            }}
          ></div>

          {/* Navigation items skeleton */}
          <div
            className="nav-items-skeleton"
            style={{ display: "flex", gap: "24px" }}
          >
            <div
              className="skeleton skeleton-nav-item"
              style={{
                width: "80px",
                height: "20px",
                borderRadius: "4px",
              }}
            ></div>
            <div
              className="skeleton skeleton-nav-item"
              style={{
                width: "100px",
                height: "20px",
                borderRadius: "4px",
              }}
            ></div>
            <div
              className="skeleton skeleton-nav-item"
              style={{
                width: "70px",
                height: "20px",
                borderRadius: "4px",
              }}
            ></div>
          </div>

          {/* Right side - currency, cart, user */}
          <div
            className="nav-right-skeleton"
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
          >
            {/* Currency dropdown skeleton */}
            <div
              className="skeleton skeleton-currency"
              style={{
                width: "60px",
                height: "32px",
                borderRadius: "16px",
              }}
            ></div>

            {/* Cart icon skeleton */}
            <div
              className="skeleton skeleton-cart"
              style={{
                width: "40px",
                height: "32px",
                borderRadius: "4px",
              }}
            ></div>

            {/* User avatar/login skeleton */}
            <div
              className="skeleton skeleton-user"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
              }}
            ></div>
          </div>
        </div>
      </nav>

      {/* Main content area skeleton */}
      <main
        className="main-skeleton"
        style={{ padding: "20px", minHeight: "60vh" }}
      >
        {/* Hero section skeleton */}
        <div className="hero-skeleton" style={{ marginBottom: "40px" }}>
          <div
            className="skeleton skeleton-hero-title"
            style={{
              width: "60%",
              height: "48px",
              marginBottom: "16px",
              borderRadius: "4px",
            }}
          ></div>
          <div
            className="skeleton skeleton-hero-subtitle"
            style={{
              width: "40%",
              height: "24px",
              marginBottom: "32px",
              borderRadius: "4px",
            }}
          ></div>
          <div
            className="skeleton skeleton-hero-button"
            style={{
              width: "200px",
              height: "48px",
              borderRadius: "24px",
            }}
          ></div>
        </div>

        {/* Content grid skeleton */}
        <div
          className="content-grid-skeleton"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="content-card-skeleton"
              style={{ padding: "16px" }}
            >
              <div
                className="skeleton skeleton-card-image"
                style={{
                  width: "100%",
                  height: "200px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                }}
              ></div>
              <div
                className="skeleton skeleton-card-title"
                style={{
                  width: "80%",
                  height: "20px",
                  marginBottom: "8px",
                  borderRadius: "4px",
                }}
              ></div>
              <div
                className="skeleton skeleton-card-description"
                style={{
                  width: "100%",
                  height: "16px",
                  marginBottom: "4px",
                  borderRadius: "4px",
                }}
              ></div>
              <div
                className="skeleton skeleton-card-description"
                style={{
                  width: "70%",
                  height: "16px",
                  marginBottom: "12px",
                  borderRadius: "4px",
                }}
              ></div>
              <div
                className="skeleton skeleton-card-price"
                style={{
                  width: "50%",
                  height: "24px",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer skeleton */}
      <footer
        className="footer-skeleton"
        style={{
          padding: "40px 20px",
          borderTop: "1px solid #e0e0e0",
          marginTop: "auto",
        }}
      >
        <div
          className="footer-content-skeleton"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
          }}
        >
          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="footer-section-skeleton">
              <div
                className="skeleton skeleton-footer-title"
                style={{
                  width: "60%",
                  height: "20px",
                  marginBottom: "16px",
                  borderRadius: "4px",
                }}
              ></div>
              {[1, 2, 3].map((link) => (
                <div
                  key={link}
                  className="skeleton skeleton-footer-link"
                  style={{
                    width: `${60 + Math.random() * 30}%`,
                    height: "16px",
                    marginBottom: "8px",
                    borderRadius: "4px",
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default AppSkeleton;
