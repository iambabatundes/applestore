// components/admin/payments/ExportButton.jsx
import React, { useState } from "react";
import {
  exportTransactionsCSV,
  exportTransactionsExcel,
} from "../../../../services/paymentService";
import "../styles/exportButton.css";

const ExportButton = ({ filters }) => {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");

  const handleExport = async () => {
    try {
      setExporting(true);

      let data;
      if (exportFormat === "csv") {
        data = await exportTransactionsCSV(filters);
      } else {
        data = await exportTransactionsExcel(filters);
      }

      // Create download link
      const blob = new Blob([data], {
        type:
          exportFormat === "csv"
            ? "text/csv"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payments-export-${
        new Date().toISOString().split("T")[0]
      }.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-button">
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value)}
        disabled={exporting}
        className="export-format"
      >
        <option value="csv">CSV</option>
        <option value="excel">Excel</option>
      </select>
      <button
        onClick={handleExport}
        disabled={exporting}
        className="export-btn"
      >
        {exporting ? "Exporting..." : "Export"}
      </button>
    </div>
  );
};

export default ExportButton;
