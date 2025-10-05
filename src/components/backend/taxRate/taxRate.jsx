import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getTaxRates, deleteTaxRate } from "../../../services/taxRateService";
import TaxForm from "./taxForm";
import TaxList from "./taxList";
import "./styles/taxRate.css";

export default function TaxRate() {
  const [taxRates, setTaxRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTax, setCurrentTax] = useState(null);

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const fetchTaxRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const taxRates = await getTaxRates();
      setTaxRates(taxRates || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        setError(error);
        console.error("Error fetching tax rates:", error);
      } else {
        setTaxRates([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taxId) => {
    if (!window.confirm("Are you sure you want to delete this tax rate?"))
      return;

    const originalRates = [...taxRates];
    setTaxRates(taxRates.filter((rate) => rate._id !== taxId));

    try {
      await deleteTaxRate(taxId);

      toast.success("VAT tax rate deleted successfully");
    } catch (error) {
      setTaxRates(originalRates);
      toast.error("Failed to delete VAT rate");
    }
  };

  const handleEdit = (tax) => {
    setCurrentTax(tax);
    window.scrollTo(0, 0);
  };

  const handleSaveComplete = () => {
    fetchTaxRates();
    setCurrentTax(null);
  };

  return (
    <section className="taxRate">
      <h2 className="taxRate__heading">Manage Tax Rate</h2>
      <div className="taxRate__main">
        <div className="taxRate__taxForm">
          <TaxForm
            currentTax={currentTax}
            onSaveComplete={handleSaveComplete}
          />
        </div>

        <div className="taxRate__taxList">
          <TaxList
            onDelete={handleDelete}
            taxRates={taxRates}
            loading={loading}
            error={error}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </section>
  );
}
