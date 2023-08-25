import React from "react";
import logo from "../../logo.svg";
import Icon from "../icon";
import AdminNavbar from "./adminNavbar";
import AdminSidebar from "./adminSidebar";

export default function Admin({ companyName, count }) {
  return (
    <section>
      <AdminNavbar companyName={companyName} count={count} />

      <section>
        <AdminSidebar />
      </section>
    </section>
  );
}
