// ReportsGeneration.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  generateReport,
  getReport,
  getPaymentStats,
  getRevenueAnalytics,
  exportTransactionsCSV,
  exportSubscriptionsCSV,
  downloadFile,
  formatCurrency,
} from "../../../services/paymentService";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import "./styles/reportsGeneration.css";

const REPORT_TYPES = [
  {
    id: "revenue",
    name: "Revenue Report",
    description:
      "Detailed revenue breakdown by time period, provider, and currency",
    icon: "💰",
    fields: ["dateFrom", "dateTo", "provider", "currency", "groupBy"],
  },
  {
    id: "transactions",
    name: "Transaction Report",
    description: "Complete transaction history with filters",
    icon: "📋",
    fields: [
      "dateFrom",
      "dateTo",
      "status",
      "provider",
      "minAmount",
      "maxAmount",
    ],
  },
  {
    id: "subscriptions",
    name: "Subscription Report",
    description: "Active, canceled, and churned subscriptions analysis",
    icon: "🔄",
    fields: ["dateFrom", "dateTo", "status", "planId"],
  },
  {
    id: "fraud",
    name: "Fraud Analysis Report",
    description: "Flagged transactions and fraud detection metrics",
    icon: "🛡️",
    fields: ["dateFrom", "dateTo", "minFraudScore"],
  },
  {
    id: "reconciliation",
    name: "Reconciliation Report",
    description: "Payment gateway reconciliation data",
    icon: "⚖️",
    fields: ["dateFrom", "dateTo", "provider"],
  },
];

const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF Document", icon: "📄" },
  { value: "csv", label: "CSV Spreadsheet", icon: "📊" },
  { value: "xlsx", label: "Excel Workbook", icon: "📈" },
  { value: "json", label: "JSON Data", icon: "{ }" },
];

// Report Type Card
const ReportTypeCard = ({ report, selected, onSelect }) => (
  <div
    className={`report-type-card ${
      selected ? "report-type-card--selected" : ""
    }`}
    onClick={() => onSelect(report)}
  >
    <span className="report-type-card__icon">{report.icon}</span>
    <div className="report-type-card__content">
      <h3 className="report-type-card__name">{report.name}</h3>
      <p className="report-type-card__description">{report.description}</p>
    </div>
    {selected && <span className="report-type-card__check">✓</span>}
  </div>
);

// Generated Report Card
const GeneratedReportCard = ({ report, onDownload, onView, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    switch (report.status) {
      case "completed":
        return (
          <span className="status-badge status-badge--success">✓ Ready</span>
        );
      case "processing":
        return (
          <span className="status-badge status-badge--info">⟳ Processing</span>
        );
      case "failed":
        return (
          <span className="status-badge status-badge--danger">✕ Failed</span>
        );
      default:
        return (
          <span className="status-badge status-badge--muted">
            {report.status}
          </span>
        );
    }
  };

  return (
    <div className="generated-report-card">
      <div className="generated-report-card__header">
        <div className="generated-report-card__info">
          <span className="generated-report-card__icon">
            {REPORT_TYPES.find((r) => r.id === report.type)?.icon || "📄"}
          </span>
          <div className="generated-report-card__details">
            <h4 className="generated-report-card__name">
              {REPORT_TYPES.find((r) => r.id === report.type)?.name ||
                report.type}
            </h4>
            <span className="generated-report-card__date">
              Generated: {formatDate(report.createdAt)}
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {report.metadata && (
        <div className="generated-report-card__metadata">
          {report.metadata.recordCount && (
            <span className="metadata-item">
              📊 {report.metadata.recordCount.toLocaleString()} records
            </span>
          )}
          {report.metadata.dateRange && (
            <span className="metadata-item">
              📅 {report.metadata.dateRange}
            </span>
          )}
          {report.metadata.fileSize && (
            <span className="metadata-item">
              💾 {(report.metadata.fileSize / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
      )}

      {report.status === "completed" && (
        <div className="generated-report-card__actions">
          <button
            className="btn btn--secondary btn--sm"
            onClick={() => onView(report)}
          >
            👁 View
          </button>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => onDownload(report)}
          >
            ⬇ Download
          </button>
          <button
            className="btn btn--danger btn--sm"
            onClick={() => onDelete(report)}
          >
            🗑
          </button>
        </div>
      )}

      {report.status === "failed" && report.error && (
        <div className="generated-report-card__error">
          <span className="error-label">Error:</span>
          <span className="error-message">{report.error}</span>
        </div>
      )}
    </div>
  );
};

// Main Component
const ReportsGeneration = () => {
  // State
  const [selectedType, setSelectedType] = useState(null);
  const [reportConfig, setReportConfig] = useState({
    dateFrom: "",
    dateTo: "",
    provider: "",
    status: "",
    currency: "",
    groupBy: "day",
    format: "pdf",
  });
  const [generatedReports, setGeneratedReports] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("generate");

  // Set default date range (last 30 days)
  useEffect(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    setReportConfig((prev) => ({
      ...prev,
      dateFrom: thirtyDaysAgo.toISOString().split("T")[0],
      dateTo: new Date().toISOString().split("T")[0],
    }));
  }, []);

  // Load generated reports
  const loadGeneratedReports = useCallback(async () => {
    try {
      setLoading(true);
      // This would be an API call to get all reports
      // For now, we'll use mock data
      const mockReports = JSON.parse(
        localStorage.getItem("generatedReports") || "[]"
      );
      setGeneratedReports(mockReports);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "history") {
      loadGeneratedReports();
    }
  }, [activeTab, loadGeneratedReports]);

  // Handle generate report
  const handleGenerateReport = async () => {
    if (!selectedType) {
      setError("Please select a report type");
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const reportData = {
        type: selectedType.id,
        format: reportConfig.format,
        filters: {
          dateFrom: reportConfig.dateFrom,
          dateTo: reportConfig.dateTo,
          ...(reportConfig.provider && { provider: reportConfig.provider }),
          ...(reportConfig.status && { status: reportConfig.status }),
          ...(reportConfig.currency && { currency: reportConfig.currency }),
          ...(reportConfig.groupBy && { groupBy: reportConfig.groupBy }),
        },
      };

      const response = await generateReport(reportData);
      const report = response.data || response;

      // Save to localStorage for history
      const reports = JSON.parse(
        localStorage.getItem("generatedReports") || "[]"
      );
      reports.unshift({
        ...report,
        type: selectedType.id,
        createdAt: new Date().toISOString(),
        status: "completed",
        metadata: {
          dateRange: `${reportConfig.dateFrom} to ${reportConfig.dateTo}`,
          format: reportConfig.format,
        },
      });
      localStorage.setItem(
        "generatedReports",
        JSON.stringify(reports.slice(0, 20))
      );

      setSuccess("Report generated successfully");
      setActiveTab("history");
      loadGeneratedReports();
    } catch (err) {
      setError(`Failed to generate report: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // Handle quick export
  const handleQuickExport = async (type) => {
    try {
      setGenerating(true);
      setError(null);

      let blob;
      if (type === "transactions") {
        blob = await exportTransactionsCSV(reportConfig);
      } else if (type === "subscriptions") {
        blob = await exportSubscriptionsCSV(reportConfig);
      }

      if (blob) {
        downloadFile(blob, `${type}_export_${Date.now()}.csv`);
        setSuccess(`${type} exported successfully`);
      }
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // Handle download report
  const handleDownloadReport = (report) => {
    // In a real implementation, this would download from the API
    setSuccess("Downloading report...");
    console.log("Download report:", report);
  };

  // Handle view report
  const handleViewReport = (report) => {
    // Open report in new tab or modal
    console.log("View report:", report);
  };

  // Handle delete report
  const handleDeleteReport = (report) => {
    const reports = JSON.parse(
      localStorage.getItem("generatedReports") || "[]"
    );
    const filtered = reports.filter((r) => r.reportId !== report.reportId);
    localStorage.setItem("generatedReports", JSON.stringify(filtered));
    loadGeneratedReports();
    setSuccess("Report deleted");
  };

  return (
    <div className="reports-gen">
      {/* Header */}
      <header className="reports-gen__header">
        <div className="reports-gen__title-section">
          <h1 className="reports-gen__title">📊 Reports & Analytics</h1>
          <p className="reports-gen__subtitle">
            Generate comprehensive reports and export data
          </p>
        </div>
        <div className="reports-gen__actions">
          <button
            className="btn btn--secondary"
            onClick={() => handleQuickExport("transactions")}
            disabled={generating}
          >
            📥 Quick Export (CSV)
          </button>
        </div>
      </header>

      {/* Notifications */}
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}
      {success && (
        <div className="success-banner">
          ✓ {success}
          <button onClick={() => setSuccess(null)} className="banner__close">
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="reports-gen__tabs">
        <button
          className={`tab-btn ${
            activeTab === "generate" ? "tab-btn--active" : ""
          }`}
          onClick={() => setActiveTab("generate")}
        >
          Generate Report
        </button>
        <button
          className={`tab-btn ${
            activeTab === "history" ? "tab-btn--active" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          Report History ({generatedReports.length})
        </button>
      </div>

      {/* Generate Tab */}
      {activeTab === "generate" && (
        <div className="reports-gen__content">
          {/* Step 1: Select Report Type */}
          <section className="report-section">
            <h2 className="report-section__title">1. Select Report Type</h2>
            <div className="report-types-grid">
              {REPORT_TYPES.map((report) => (
                <ReportTypeCard
                  key={report.id}
                  report={report}
                  selected={selectedType?.id === report.id}
                  onSelect={setSelectedType}
                />
              ))}
            </div>
          </section>

          {/* Step 2: Configure Report */}
          {selectedType && (
            <section className="report-section">
              <h2 className="report-section__title">2. Configure Report</h2>
              <div className="report-config">
                <div className="report-config__grid">
                  {/* Date Range */}
                  <div className="config-group">
                    <label>Date From</label>
                    <input
                      type="date"
                      value={reportConfig.dateFrom}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          dateFrom: e.target.value,
                        }))
                      }
                      className="config-input"
                    />
                  </div>
                  <div className="config-group">
                    <label>Date To</label>
                    <input
                      type="date"
                      value={reportConfig.dateTo}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          dateTo: e.target.value,
                        }))
                      }
                      className="config-input"
                    />
                  </div>

                  {/* Conditional Fields */}
                  {selectedType.fields.includes("provider") && (
                    <div className="config-group">
                      <label>Provider</label>
                      <select
                        value={reportConfig.provider}
                        onChange={(e) =>
                          setReportConfig((prev) => ({
                            ...prev,
                            provider: e.target.value,
                          }))
                        }
                        className="config-select"
                      >
                        <option value="">All Providers</option>
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="paystack">Paystack</option>
                      </select>
                    </div>
                  )}

                  {selectedType.fields.includes("status") && (
                    <div className="config-group">
                      <label>Status</label>
                      <select
                        value={reportConfig.status}
                        onChange={(e) =>
                          setReportConfig((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="config-select"
                      >
                        <option value="">All Statuses</option>
                        <option value="succeeded">Succeeded</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  )}

                  {selectedType.fields.includes("groupBy") && (
                    <div className="config-group">
                      <label>Group By</label>
                      <select
                        value={reportConfig.groupBy}
                        onChange={(e) =>
                          setReportConfig((prev) => ({
                            ...prev,
                            groupBy: e.target.value,
                          }))
                        }
                        className="config-select"
                      >
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Step 3: Select Format */}
          {selectedType && (
            <section className="report-section">
              <h2 className="report-section__title">3. Select Export Format</h2>
              <div className="export-formats">
                {EXPORT_FORMATS.map((format) => (
                  <label
                    key={format.value}
                    className={`format-option ${
                      reportConfig.format === format.value
                        ? "format-option--selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={reportConfig.format === format.value}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          format: e.target.value,
                        }))
                      }
                    />
                    <span className="format-icon">{format.icon}</span>
                    <span className="format-label">{format.label}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Generate Button */}
          {selectedType && (
            <div className="report-generate-section">
              <button
                className="btn btn--primary btn--lg"
                onClick={handleGenerateReport}
                disabled={generating}
              >
                {generating ? "Generating Report..." : "🚀 Generate Report"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="reports-gen__content">
          {loading ? (
            <LoadingSpinner message="Loading report history..." />
          ) : generatedReports.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon">📭</span>
              <h3>No reports generated yet</h3>
              <p>Generate your first report to see it here</p>
              <button
                className="btn btn--primary"
                onClick={() => setActiveTab("generate")}
              >
                Generate Report
              </button>
            </div>
          ) : (
            <div className="generated-reports-grid">
              {generatedReports.map((report, idx) => (
                <GeneratedReportCard
                  key={report.reportId || idx}
                  report={report}
                  onDownload={handleDownloadReport}
                  onView={handleViewReport}
                  onDelete={handleDeleteReport}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsGeneration;
