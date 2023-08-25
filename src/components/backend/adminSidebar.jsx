import React from "react";

export default function AdminSidebar() {
  return (
    <section>
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li>
              <Link to="/admin/post">Post</Link>
            </li>
            <li>
              <Link to="/admin/product">Product</Link>
            </li>
            <li>
              <Link to="/admin/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </section>
  );
}
