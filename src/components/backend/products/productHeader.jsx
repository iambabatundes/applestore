import React from "react";
import { Link } from "react-router-dom";
import config from "../../../config.json";
import { uploadExcelFile } from "../../../services/uploadExcelService";

export default function ProductHeader() {
  function handleExport() {
    fetch(config.apiUrl + "/exports", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "products.xlsx"; // Specify the file name
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error exporting products:", error);
        alert("Error exporting products. Please try again.");
      });
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx"; // Limit to Excel files
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("excelFile", file);
        await uploadExcelFile(formData);
        alert("Products imported successfully!");
      } catch (error) {
        console.error("Error importing products:", error);
        alert("Error importing products. Please try again.");
      }
    };
    input.click();
  }

  function handleDownload() {
    fetch(config.apiUrl + "/upload-multiple", { method: "GET" })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(new Blob([blob]));
        // Create an anchor element with the download URL
        const a = document.createElement("a");
        a.href = url;
        a.download = "sample-products.xlsx"; // Specify the file name
        // Simulate a click to trigger the download
        a.click();
        // Release the object URL
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading sample file:", error);
      });
  }

  return (
    <header className="product__header">
      <h1 className="headerData-title">Products</h1>
      <Link to="/admin/add-product">
        <button className="headerData-btn">Add New</button>
      </Link>

      <span onClick={handleImport}>
        <button className="headerData-btn">Import</button>
      </span>

      <span onClick={handleExport}>
        <button className="headerData-btn">Export</button>
      </span>

      <span onClick={handleDownload}>
        <button className="headerData-btn">Download Sample</button>
      </span>
    </header>
  );
}
