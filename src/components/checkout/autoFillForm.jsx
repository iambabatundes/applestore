import React from "react";

export default function AutoFillForm({
  handleAutofill,
  autofillError,
  loading,
}) {
  return (
    <section>
      <div className="address-form">
        <span className="address-save">
          Save time. Autofill your current location.
          <button type="button" onClick={handleAutofill} disabled={loading}>
            {loading ? "Autofilling..." : "Autofill"}
          </button>
        </span>
        {autofillError && (
          <div className="error-message">
            <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
            {autofillError}
          </div>
        )}
      </div>
    </section>
  );
}
