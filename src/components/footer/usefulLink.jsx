import React from "react";
import { Link } from "react-router-dom";

export default function UsefulLink() {
  return (
    <section>
      <article className="footer__useful-link">
        <h1>Useful Links</h1>
        <ul>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/brand">
            <li>Brand</li>
          </Link>
          <Link to="/product">
            <li>Product</li>
          </Link>
          <Link to="/blog">
            <li>Blog</li>
          </Link>
          <Link to="/contact">
            <li>Contact</li>
          </Link>
          <Link to="/about">
            <li>ABout</li>
          </Link>
        </ul>
      </article>
    </section>
  );
}
