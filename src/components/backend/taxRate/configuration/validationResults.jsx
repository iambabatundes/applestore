// components/admin/tax/configuration/ValidationResults.jsx
import React from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "../styles/validationResults.css";

export function ValidationResults({ results, onDismiss }) {
  const [expanded, setExpanded] = React.useState(true);
  const [expandedErrors, setExpandedErrors] = React.useState(new Set());

  if (!results) return null;

  const toggleErrorExpansion = (errorId) => {
    const newExpanded = new Set(expandedErrors);
    if (newExpanded.has(errorId)) {
      newExpanded.delete(errorId);
    } else {
      newExpanded.add(errorId);
    }
    setExpandedErrors(newExpanded);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "error":
        return (
          <FaTimesCircle className="validationResults__icon validationResults__icon--error" />
        );
      case "warning":
        return (
          <FaExclamationTriangle className="validationResults__icon validationResults__icon--warning" />
        );
      case "info":
        return (
          <FaInfoCircle className="validationResults__icon validationResults__icon--info" />
        );
      default:
        return (
          <FaInfoCircle className="validationResults__icon validationResults__icon--info" />
        );
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "error":
        return "var(--color-danger)";
      case "warning":
        return "var(--color-warning)";
      case "info":
        return "var(--color-info)";
      default:
        return "var(--color-info)";
    }
  };

  const getSeverityLabel = (severity) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <div className="validationResults">
      <div className="validationResults__header">
        <div className="validationResults__title-section">
          <h3 className="validationResults__title">
            Configuration Validation Results
          </h3>
          <div className="validationResults__summary">
            <span
              className={`validationResults__status ${
                results.isValid
                  ? "validationResults__status--valid"
                  : "validationResults__status--invalid"
              }`}
            >
              {results.isValid ? (
                <>
                  <FaCheckCircle /> Validation Passed
                </>
              ) : (
                <>
                  <FaTimesCircle /> Validation Failed
                </>
              )}
            </span>
            <span className="validationResults__count">
              {results.errors?.length || 0} errors,{" "}
              {results.warnings?.length || 0} warnings,{" "}
              {results.info?.length || 0} info
            </span>
          </div>
        </div>

        <div className="validationResults__actions">
          <button
            className="validationResults__expand-btn"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button
            className="validationResults__dismiss-btn"
            onClick={onDismiss}
          >
            Dismiss
          </button>
        </div>
      </div>

      {expanded && (
        <div className="validationResults__content">
          {/* Errors */}
          {results.errors && results.errors.length > 0 && (
            <div className="validationResults__section">
              <h4 className="validationResults__section-title validationResults__section-title--error">
                <FaTimesCircle />
                Errors ({results.errors.length})
              </h4>
              <div className="validationResults__list">
                {results.errors.map((error, index) => (
                  <ValidationErrorItem
                    key={error.id || index}
                    error={error}
                    severity="error"
                    isExpanded={expandedErrors.has(error.id || index)}
                    onToggle={() => toggleErrorExpansion(error.id || index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {results.warnings && results.warnings.length > 0 && (
            <div className="validationResults__section">
              <h4 className="validationResults__section-title validationResults__section-title--warning">
                <FaExclamationTriangle />
                Warnings ({results.warnings.length})
              </h4>
              <div className="validationResults__list">
                {results.warnings.map((warning, index) => (
                  <ValidationErrorItem
                    key={warning.id || index}
                    error={warning}
                    severity="warning"
                    isExpanded={expandedErrors.has(warning.id || index)}
                    onToggle={() => toggleErrorExpansion(warning.id || index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          {results.info && results.info.length > 0 && (
            <div className="validationResults__section">
              <h4 className="validationResults__section-title validationResults__section-title--info">
                <FaInfoCircle />
                Information ({results.info.length})
              </h4>
              <div className="validationResults__list">
                {results.info.map((info, index) => (
                  <ValidationErrorItem
                    key={info.id || index}
                    error={info}
                    severity="info"
                    isExpanded={expandedErrors.has(info.id || index)}
                    onToggle={() => toggleErrorExpansion(info.id || index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Success State */}
          {results.isValid &&
            (!results.errors || results.errors.length === 0) && (
              <div className="validationResults__success">
                <FaCheckCircle className="validationResults__success-icon" />
                <div className="validationResults__success-content">
                  <h4 className="validationResults__success-title">
                    Configuration is Valid
                  </h4>
                  <p className="validationResults__success-message">
                    All configuration settings have been validated and are ready
                    for use.
                  </p>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

function ValidationErrorItem({ error, severity, isExpanded, onToggle }) {
  const hasDetails = error.details || error.suggestions || error.field;

  return (
    <div
      className={`validationResults__item validationResults__item--${severity}`}
    >
      <div
        className="validationResults__item-header"
        onClick={hasDetails ? onToggle : undefined}
        style={{ cursor: hasDetails ? "pointer" : "default" }}
      >
        <div className="validationResults__item-main">
          <div className="validationResults__item-icon">
            {severity === "error" && <FaTimesCircle />}
            {severity === "warning" && <FaExclamationTriangle />}
            {severity === "info" && <FaInfoCircle />}
          </div>
          <div className="validationResults__item-content">
            <div className="validationResults__item-message">
              {error.message}
            </div>
            {error.field && (
              <div className="validationResults__item-field">
                Field: <code>{error.field}</code>
              </div>
            )}
          </div>
        </div>

        {hasDetails && (
          <div className="validationResults__item-expand">
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        )}
      </div>

      {isExpanded && hasDetails && (
        <div className="validationResults__item-details">
          {error.details && (
            <div className="validationResults__detail-section">
              <strong>Details:</strong> {error.details}
            </div>
          )}

          {error.suggestions && error.suggestions.length > 0 && (
            <div className="validationResults__detail-section">
              <strong>Suggestions:</strong>
              <ul className="validationResults__suggestions">
                {error.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {error.code && (
            <div className="validationResults__detail-section">
              <strong>Error Code:</strong> <code>{error.code}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
