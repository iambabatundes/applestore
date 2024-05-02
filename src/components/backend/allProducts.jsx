import React from "react";
import "./styles/posts.css";
import Header from "./common/header";
import TableData from "./common/tableData";

export default function AllProduct() {
  return (
    <section className="padding">
      <Header headerTitle="Products" />

      <section>{/* <TableData /> */}</section>
      <h1>This is the all product page</h1>
    </section>
  );
}
