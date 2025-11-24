// components/admin/tax/configuration/ConfigHistory.jsx
import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaUser,
  FaCalendar,
  FaCodeBranch,
  FaUndo,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "react-toastify";
import {
  getConfigHistory,
  restoreConfigVersion,
} from "../../../../services/taxConfigService";
import "../styles/validationResults.css";

export function ConfigHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    user: "",
    action: "",
    dateRange: "30d",
  });
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [filters.dateRange]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyData = await getConfigHistory({
        timeframe: filters.dateRange,
      });
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load configuration history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (
      !window.confirm(
        "Are you sure you want to restore this configuration version? This will replace your current configuration."
      )
    ) {
      return;
    }

    try {
      setRestoring(versionId);
      await restoreConfigVersion(versionId);
      toast.success("Configuration restored successfully");
      loadHistory(); // Reload history to show the restore action
    } catch (error) {
      console.error("Failed to restore configuration:", error);
      toast.error("Failed to restore configuration");
    } finally {
      setRestoring(null);
    }
  };

  const handleViewDetails = (version) => {
    setSelectedVersion(version);
  };

  const handleCloseDetails = () => {
    setSelectedVersion(null);
  };

  const handleExportVersion = (version) => {
    // Implementation for exporting specific version
    const configStr = JSON.stringify(version.config, null, 2);
    const blob = new Blob([configStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tax-config-version-${version.version}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Configuration version exported");
  };

  const filteredHistory = history.filter((version) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        version.user?.toLowerCase().includes(searchLower) ||
        version.action?.toLowerCase().includes(searchLower) ||
        version.version?.toLowerCase().includes(searchLower) ||
        version.comments?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "var(--color-success)";
      case "UPDATE":
        return "var(--color-info)";
      case "RESTORE":
        return "var(--color-warning)";
      case "DELETE":
        return "var(--color-danger)";
      default:
        return "var(--color-gray)";
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "CREATE":
        return "🆕";
      case "UPDATE":
        return "📝";
      case "RESTORE":
        return "🔄";
      case "DELETE":
        return "🗑️";
      default:
        return "📋";
    }
  };

  if (loading) {
    return (
      <div className="configHistory__loading">
        <div className="configHistory__loading-spinner"></div>
        <span>Loading configuration history...</span>
      </div>
    );
  }

  return (
    <div className="configHistory">
      {/* Header */}
      <div className="configHistory__header">
        <div className="configHistory__title-section">
          <h3 className="configHistory__title">
            <FaHistory />
            Configuration Change History
          </h3>
          <p className="configHistory__subtitle">
            Audit trail of all configuration changes and version history
          </p>
        </div>

        <div className="configHistory__controls">
          <select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateRange: e.target.value }))
            }
            className="configHistory__filter-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>

          <div className="configHistory__search">
            <FaSearch className="configHistory__search-icon" />
            <input
              type="text"
              placeholder="Search history..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="configHistory__search-input"
            />
          </div>

          <button
            className="configHistory__refresh-btn"
            onClick={loadHistory}
            title="Refresh history"
          >
            <FaFilter />
            Refresh
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="configHistory__list">
        {filteredHistory.length === 0 ? (
          <div className="configHistory__empty">
            <div className="configHistory__empty-icon">📝</div>
            <h4 className="configHistory__empty-title">
              No configuration history found
            </h4>
            <p className="configHistory__empty-message">
              {filters.search
                ? "Try adjusting your search criteria"
                : "Configuration changes will appear here"}
            </p>
          </div>
        ) : (
          filteredHistory.map((version) => (
            <ConfigHistoryItem
              key={version.id}
              version={version}
              onRestore={handleRestore}
              onViewDetails={handleViewDetails}
              onExport={handleExportVersion}
              restoring={restoring === version.id}
              getActionColor={getActionColor}
              getActionIcon={getActionIcon}
            />
          ))
        )}
      </div>

      {/* Version Details Modal */}
      {selectedVersion && (
        <ConfigVersionModal
          version={selectedVersion}
          onClose={handleCloseDetails}
          onRestore={handleRestore}
          onExport={handleExportVersion}
        />
      )}
    </div>
  );
}

function ConfigHistoryItem({
  version,
  onRestore,
  onViewDetails,
  onExport,
  restoring,
  getActionColor,
  getActionIcon,
}) {
  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  const isCurrentVersion = version.isCurrent;

  return (
    <div
      className={`configHistory__item ${
        isCurrentVersion ? "configHistory__item--current" : ""
      }`}
    >
      <div className="configHistory__item-main">
        <div className="configHistory__item-icon">
          {getActionIcon(version.action)}
        </div>

        <div className="configHistory__item-content">
          <div className="configHistory__item-header">
            <h4 className="configHistory__item-title">
              Version {version.version}
              {isCurrentVersion && (
                <span className="configHistory__current-badge">Current</span>
              )}
            </h4>
            <span
              className="configHistory__item-action"
              style={{ color: getActionColor(version.action) }}
            >
              {version.action}
            </span>
          </div>

          <div className="configHistory__item-meta">
            <span className="configHistory__meta-item">
              <FaUser />
              {version.user || "System"}
            </span>
            <span className="configHistory__meta-item">
              <FaCalendar />
              {formatTimestamp(version.timestamp)}
            </span>
            {version.changes && (
              <span className="configHistory__meta-item">
                <FaCodeBranch />
                {version.changes} changes
              </span>
            )}
          </div>

          {version.comments && (
            <p className="configHistory__item-comments">{version.comments}</p>
          )}
        </div>
      </div>

      <div className="configHistory__item-actions">
        <button
          className="configHistory__action-btn configHistory__action-btn--view"
          onClick={() => onViewDetails(version)}
          title="View details"
        >
          <FaEye />
        </button>

        <button
          className="configHistory__action-btn configHistory__action-btn--export"
          onClick={() => onExport(version)}
          title="Export version"
        >
          <FaDownload />
        </button>

        {!isCurrentVersion && (
          <button
            className="configHistory__action-btn configHistory__action-btn--restore"
            onClick={() => onRestore(version.id)}
            disabled={restoring}
            title="Restore this version"
          >
            <FaUndo />
            {restoring ? "Restoring..." : "Restore"}
          </button>
        )}
      </div>
    </div>
  );
}

function ConfigVersionModal({ version, onClose, onRestore, onExport }) {
  const [viewMode, setViewMode] = useState("formatted"); // formatted, raw

  const formatConfig = (config) => {
    if (!config) return "No configuration data";

    if (viewMode === "raw") {
      return JSON.stringify(config, null, 2);
    }

    // Formatted view - group by sections
    const sections = [
      { title: "System Settings", data: config.system },
      { title: "Calculation Settings", data: config.calculation },
      { title: "Compliance Settings", data: config.compliance },
      { title: "API Settings", data: config.api },
      { title: "Default Rates", data: config.defaults },
    ];

    return sections
      .map((section) =>
        section.data && Object.keys(section.data).length > 0
          ? `
### ${section.title}
${Object.entries(section.data)
  .map(
    ([key, value]) =>
      `• ${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`
  )
  .join("\n")}
      `
          : ""
      )
      .join("\n");
  };

  return (
    <div className="configVersionModal">
      <div className="configVersionModal__overlay" onClick={onClose}></div>
      <div className="configVersionModal__content">
        <div className="configVersionModal__header">
          <h3 className="configVersionModal__title">
            Configuration Version {version.version}
          </h3>
          <button className="configVersionModal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="configVersionModal__body">
          <div className="configVersionModal__info">
            <div className="configVersionModal__info-item">
              <strong>Action:</strong> {version.action}
            </div>
            <div className="configVersionModal__info-item">
              <strong>User:</strong> {version.user || "System"}
            </div>
            <div className="configVersionModal__info-item">
              <strong>Timestamp:</strong>{" "}
              {new Date(version.timestamp).toLocaleString()}
            </div>
            {version.comments && (
              <div className="configVersionModal__info-item">
                <strong>Comments:</strong> {version.comments}
              </div>
            )}
          </div>

          <div className="configVersionModal__view-controls">
            <button
              className={`configVersionModal__view-btn ${
                viewMode === "formatted"
                  ? "configVersionModal__view-btn--active"
                  : ""
              }`}
              onClick={() => setViewMode("formatted")}
            >
              Formatted
            </button>
            <button
              className={`configVersionModal__view-btn ${
                viewMode === "raw" ? "configVersionModal__view-btn--active" : ""
              }`}
              onClick={() => setViewMode("raw")}
            >
              Raw JSON
            </button>
          </div>

          <div className="configVersionModal__config">
            <pre className="configVersionModal__config-content">
              {formatConfig(version.config)}
            </pre>
          </div>
        </div>

        <div className="configVersionModal__footer">
          <button
            className="configVersionModal__btn configVersionModal__btn--secondary"
            onClick={() => onExport(version)}
          >
            <FaDownload /> Export
          </button>
          {!version.isCurrent && (
            <button
              className="configVersionModal__btn configVersionModal__btn--primary"
              onClick={() => onRestore(version.id)}
            >
              <FaUndo /> Restore This Version
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
