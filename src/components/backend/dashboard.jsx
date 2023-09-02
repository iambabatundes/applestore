import React from "react";
import "./styles/dashboard.css";
import { Link } from "react-router-dom";
import Icon from "../icon";

export default function Dashboard() {
  return (
    <section className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <section className="dasboard-content">
        <div className="dashboard-content__main">
          <h1 className="dashboard-content__title">Welcome to Appstore</h1>
          <Link to="learn-more-version">
            Learn more about the latest version
          </Link>
        </div>

        <section className="dashboard-section">
          <div className="dashboard-author">
            <Icon pen />
            <article>
              <h1>Author rich content with blocks and patterns</h1>
              <p>
                Block patterns are pre-configured block layouts. Use them to get
                inspired or create new pages in a flash.
              </p>
              <Link to="/admin/add-product">Add a new product</Link>
            </article>
          </div>
          <div>
            <Icon customizing />
            <article>
              <h1>Start Customizing</h1>
              <p>
                Configure your site’s logo, header, menus, and more in the
                Customizer.
              </p>

              <Link to="/admin/settings">Open the settings</Link>
            </article>
          </div>
          <div>
            <Icon build />
            <article>
              <h1>Discover a new way to build your site.</h1>
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
