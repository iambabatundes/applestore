// components/admin/tax/common/RecentActivity.jsx
import React from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaDownload,
  FaUpload,
  FaSync,
  FaExclamationTriangle,
} from "react-icons/fa";
import { formatDistanceToNow, parseISO } from "date-fns";
import "../styles/recentActivity.css";

export function RecentActivity({
  activities = [],
  maxItems = 10,
  onItemClick,
}) {
  // Safe activities array
  const safeActivities = activities || [];

  const getActivityIcon = (action) => {
    switch (action) {
      case "TAX_RATE_CREATED":
        return (
          <FaPlus className="recentActivity__icon recentActivity__icon--create" />
        );
      case "TAX_RATE_UPDATED":
        return (
          <FaEdit className="recentActivity__icon recentActivity__icon--update" />
        );
      case "TAX_RATE_DELETED":
        return (
          <FaTrash className="recentActivity__icon recentActivity__icon--delete" />
        );
      case "TAX_RATE_DEACTIVATED":
        return (
          <FaEyeSlash className="recentActivity__icon recentActivity__icon--deactivate" />
        );
      case "TAX_RATE_ACTIVATED":
        return (
          <FaEye className="recentActivity__icon recentActivity__icon--activate" />
        );
      case "TAX_RATE_EXPORTED":
        return (
          <FaDownload className="recentActivity__icon recentActivity__icon--export" />
        );
      case "TAX_RATE_IMPORTED":
        return (
          <FaUpload className="recentActivity__icon recentActivity__icon--import" />
        );
      case "TAX_RATE_SYNCED":
        return (
          <FaSync className="recentActivity__icon recentActivity__icon--sync" />
        );
      case "TAX_RATE_EXPIRING":
        return (
          <FaExclamationTriangle className="recentActivity__icon recentActivity__icon--warning" />
        );
      default:
        return (
          <FaEdit className="recentActivity__icon recentActivity__icon--default" />
        );
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case "TAX_RATE_CREATED":
        return "var(--color-success)";
      case "TAX_RATE_UPDATED":
        return "var(--color-info)";
      case "TAX_RATE_DELETED":
        return "var(--color-danger)";
      case "TAX_RATE_DEACTIVATED":
        return "var(--color-warning)";
      case "TAX_RATE_ACTIVATED":
        return "var(--color-success)";
      case "TAX_RATE_EXPIRING":
        return "var(--color-warning)";
      default:
        return "var(--color-gray)";
    }
  };

  const getActionText = (action) => {
    const actionMap = {
      TAX_RATE_CREATED: "created",
      TAX_RATE_UPDATED: "updated",
      TAX_RATE_DELETED: "deleted",
      TAX_RATE_DEACTIVATED: "deactivated",
      TAX_RATE_ACTIVATED: "activated",
      TAX_RATE_EXPORTED: "exported",
      TAX_RATE_IMPORTED: "imported",
      TAX_RATE_SYNCED: "synced",
      TAX_RATE_EXPIRING: "expiring soon",
    };
    return actionMap[action] || action.toLowerCase();
  };

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handleActivityClick = (activity) => {
    if (onItemClick) {
      onItemClick(activity);
    }
  };

  if (safeActivities.length === 0) {
    return (
      <div className="recentActivity__empty">
        <div className="recentActivity__empty-icon">📊</div>
        <p className="recentActivity__empty-title">No recent activity</p>
        <p className="recentActivity__empty-subtitle">
          Activity will appear here as changes are made to tax rates
        </p>
      </div>
    );
  }

  const displayedActivities = safeActivities.slice(0, maxItems);

  return (
    <div className="recentActivity">
      <div className="recentActivity__list">
        {displayedActivities.map((activity, index) => (
          <div
            key={activity.id || index}
            className={`recentActivity__item ${
              onItemClick ? "recentActivity__item--clickable" : ""
            }`}
            onClick={() => handleActivityClick(activity)}
          >
            <div className="recentActivity__item-main">
              <div className="recentActivity__icon-container">
                {getActivityIcon(activity.action)}
              </div>

              <div className="recentActivity__content">
                <div className="recentActivity__description">
                  {activity.description ||
                    `Tax rate ${getActionText(activity.action)}`}
                </div>

                <div className="recentActivity__meta">
                  <span className="recentActivity__user">
                    by {activity.user || "System"}
                  </span>

                  {activity.taxCode && (
                    <span className="recentActivity__tax-code">
                      • {activity.taxCode}
                    </span>
                  )}

                  {activity.country && (
                    <span className="recentActivity__country">
                      • {activity.country}
                    </span>
                  )}
                </div>

                {activity.details && (
                  <div className="recentActivity__details">
                    {truncateText(activity.details)}
                  </div>
                )}
              </div>
            </div>

            <div className="recentActivity__timestamp">
              {formatTimestamp(activity.timestamp)}
            </div>

            {activity.priority === "high" && (
              <div
                className="recentActivity__priority-indicator"
                style={{ backgroundColor: getActivityColor(activity.action) }}
              />
            )}
          </div>
        ))}
      </div>

      {safeActivities.length > maxItems && (
        <div className="recentActivity__footer">
          <span className="recentActivity__more-count">
            +{safeActivities.length - maxItems} more activities
          </span>
        </div>
      )}
    </div>
  );
}

// Additional component for activity feed with real-time updates
export function ActivityFeed({
  activities,
  autoRefresh = true,
  refreshInterval = 30000,
}) {
  const [localActivities, setLocalActivities] = React.useState(
    activities || []
  );
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    setLocalActivities(activities || []);
  }, [activities]);

  // Simulate real-time updates (replace with actual WebSocket/SSE implementation)
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // In a real implementation, this would fetch new activities from the server
      // or receive them via WebSocket
      console.log("Checking for new activities...");
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = () => {
    // Manual refresh implementation
    console.log("Manual refresh triggered");
  };

  return (
    <div className="activityFeed">
      <div className="activityFeed__header">
        <h4 className="activityFeed__title">Live Activity Feed</h4>
        <div className="activityFeed__controls">
          <div
            className={`activityFeed__status ${
              isConnected
                ? "activityFeed__status--connected"
                : "activityFeed__status--disconnected"
            }`}
          >
            <div className="activityFeed__status-dot"></div>
            {isConnected ? "Live" : "Disconnected"}
          </div>
          <button
            className="activityFeed__refresh-btn"
            onClick={handleRefresh}
            title="Refresh activities"
          >
            <FaSync />
          </button>
        </div>
      </div>

      <RecentActivity activities={localActivities} />
    </div>
  );
}
