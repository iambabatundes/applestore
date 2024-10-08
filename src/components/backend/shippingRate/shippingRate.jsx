import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ShippingRateForm from "./shippingRateForm";
import ShippingRateList from "./shippingRateList";
import { deleteShippingRate } from "../../../services/shippingService";
import { useShippingRates } from "./hooks/useShippingRates";

import "./styles/shippingRate.css";

export default function ShippingRate() {
  const [selectedRate, setSelectedRate] = useState(null);

  const {
    shippingRates,
    loading,
    error,
    setShippingRates,
    fetchShippingRates,
  } = useShippingRates();

  useEffect(() => {
    fetchShippingRates();
  }, []);

  const handleDelete = async (rateId) => {
    if (!window.confirm("Are you sure you want to delete this rate?")) return;

    const originalRates = [...shippingRates];
    setShippingRates(shippingRates.filter((rate) => rate._id !== rateId));

    try {
      await deleteShippingRate(rateId);
      //   setShippingRates(shippingRates.filter((rate) => rate._id !== rateId));
      toast.success("Shipping rate deleted successfully");
    } catch (error) {
      setShippingRates(originalRates);
      toast.error("Failed to delete shipping rate");
    }
  };

  const handleEdit = (rate) => {
    setSelectedRate(rate);
  };

  const handleFormSubmit = (updatedRate) => {
    if (updatedRate._id) {
      // Optimistically update the rate in the UI before server confirmation
      setShippingRates((prevRates) =>
        prevRates.map((rate) =>
          rate._id === updatedRate._id ? { ...rate, ...updatedRate } : rate
        )
      );
    } else {
      // Add new rate optimistically
      setShippingRates((prevRates) => [...prevRates, updatedRate]);
    }
    fetchShippingRates();
    setSelectedRate(null);
  };

  return (
    <section>
      <h2 className="shippingRate__heading">Manage Shipping Rate</h2>
      <div className="shippingRate">
        <ShippingRateForm
          rateToEdit={selectedRate}
          onFormSubmit={handleFormSubmit}
        />
        <ShippingRateList
          onEdit={handleEdit}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          shippingRates={shippingRates}
        />
      </div>
    </section>
  );
}
