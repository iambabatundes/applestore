import React from "react";
import "./styles/dashboard.css";
import "../backend/common/styles/darkMode.css";
import { Link } from "react-router-dom";
import Icon from "../icon";

export default function Dashboard({ darkMode }) {
  return (
    <section className={`dashboard ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="dashboard-title">Dashboard</h1>
      <section className={`dashboard-content ${darkMode ? "dark-mode" : ""}`}>
        <div
          className={`dashboard-content__main ${darkMode ? "dark-mode" : ""}`}
        >
          <h1 className="dashboard-content__title">Welcome to Appstore</h1>
          <Link
            to="learn-more-version"
            className={`dashboard-link ${darkMode ? "dark-mode" : ""}`}
          >
            Learn more about the latest version
          </Link>
        </div>

        <section className="dashboard-panel-container">
          <div
            className={`dashboard-panel-column ${darkMode ? "dark-mode" : ""}`}
          >
            <Icon pen />
            <article className="dashboard-panel-content">
              <h4 className={darkMode ? "dark-mode" : ""}>
                Author rich content with blocks and patterns
              </h4>
              <p className={darkMode ? "dark-mode" : ""}>
                Block patterns are pre-configured block layouts. Use them to get
                inspired or create new pages in a flash.
              </p>
              <Link
                to="/admin/add-product"
                className={`dashboard-link ${darkMode ? "dark-mode" : ""}`}
              >
                Add a new product
              </Link>
            </article>
          </div>
          <div
            className={`dashboard-panel-column ${darkMode ? "dark-mode" : ""}`}
          >
            <Icon customizing />
            <article className="dashboard-panel-content">
              <h4 className={darkMode ? "dark-mode" : ""}>Start Customizing</h4>
              <p className={darkMode ? "dark-mode" : ""}>
                Configure your site's logo, header, menus, and more in the
                Customizer.
              </p>
              <Link
                to="/admin/settings"
                className={`dashboard-link ${darkMode ? "dark-mode" : ""}`}
              >
                Open the settings
              </Link>
            </article>
          </div>
          <div
            className={`dashboard-panel-column ${darkMode ? "dark-mode" : ""}`}
          >
            <Icon build />
            <article className="dashboard-panel-content">
              <h4 className={darkMode ? "dark-mode" : ""}>
                Discover a new way to build your site.
              </h4>
              <p className={darkMode ? "dark-mode" : ""}>
                There is a new kind of WordPress theme, called a block theme,
                that lets you build the site you've always wanted — with blocks
                and styles.
              </p>
              <Link className={`dashboard-link ${darkMode ? "dark-mode" : ""}`}>
                Learn more about editing themes
              </Link>
            </article>
          </div>
        </section>
      </section>
    </section>
  );
}
