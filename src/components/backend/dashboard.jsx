import React from "react";
import "./styles/dashboard.css";
import { Link } from "react-router-dom";
import Icon from "../icon";

export default function Dashboard() {
  return (
    <section className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <section className="dashboard-content">
        <div className="dashboard-content__main">
          <h1 className="dashboard-content__title">Welcome to Appstore</h1>
          <Link to="learn-more-version">
            Learn more about the latest version
          </Link>
        </div>

        <section className="dashboard-panel-container">
          <div className="dashboard-panel-column">
            <Icon pen />
            <article className="dashboard-panel-content">
              <h4>Author rich content with blocks and patterns</h4>
              <p>
                Block patterns are pre-configured block layouts. Use them to get
                inspired or create new pages in a flash.
              </p>
              <Link to="/admin/add-product">Add a new product</Link>
            </article>
          </div>
          <div className="dashboard-panel-column">
            <Icon customizing />
            <article className="dashboard-panel-content">
              <h4>Start Customizing</h4>
              <p>
                Configure your site's logo, header, menus, and more in the
                Customizer.
              </p>

              <Link to="/admin/settings">Open the settings</Link>
            </article>
          </div>
          <div className="dashboard-panel-column">
            <Icon build />
            <article className="dashboard-panel-content">
              <h4>Discover a new way to build your site.</h4>
              <p>
                There is a new kind of WordPress theme, called a block theme,
                that lets you build the site you've always wanted — with blocks
                and styles.
              </p>
              <Link>Learn more about editing themes</Link>
            </article>
          </div>
        </section>
      </section>
    </section>
  );
}
