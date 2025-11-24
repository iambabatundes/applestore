// components/admin/tax/common/TaxCalculationPreview.jsx
import React, { useState } from "react";

export function TaxCalculationPreview({
  calculationPreview,
  onTestCalculation,
  taxRate,
}) {
  const [testAmount, setTestAmount] = useState(100);

  if (!calculationPreview) return null;

  return (
    <div className="taxCalculation__preview">
      <h4 className="taxCalculation__title">Calculation Preview</h4>
      <div className="taxCalculation__test">
        <input
          type="number"
          value={testAmount}
          onChange={(e) => setTestAmount(Number(e.target.value))}
          placeholder="Test amount"
          className="taxCalculation__input"
        />
        <button
          onClick={() => onTestCalculation(testAmount)}
          className="taxCalculation__btn"
        >
          Test Calculation
        </button>
      </div>

      {calculationPreview.totalTax > 0 && (
        <div className="taxCalculation__result">
          <div className="taxCalculation__amount">
            <strong>Tax Amount:</strong> $
            {calculationPreview.totalTax.toFixed(2)}
          </div>
          <div className="taxCalculation__rate">
            <strong>Effective Rate:</strong>{" "}
            {((calculationPreview.totalTax / testAmount) * 100).toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}
