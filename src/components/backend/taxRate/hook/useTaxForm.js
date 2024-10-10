import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  saveTaxRate,
  updateTaxRate,
} from "../../../../services/taxRateService";
import { validateTaxRate, validateProperty } from "../validation";

export function useTaxForm(currentTax, onSaveComplete) {
  const [formData, setFormData] = useState({
    country: "",
    region: "",
    city: "",
    taxRate: "",
    taxCode: "",
    isGlobal: false,
    isActive: true,
    effectiveDate: "",
    expirationDate: "",
    tieredRates: [],
  });
  const [tier, setTier] = useState({ minAmount: "", maxAmount: "", rate: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentTax) {
      setFormData({
        country: currentTax.country || "",
        region: currentTax.region || "",
        city: currentTax.city || "",
        taxRate: currentTax.taxRate || "",
        taxCode: currentTax.taxCode || "",
        isGlobal: currentTax.isGlobal || false,
        isActive: currentTax.isActive || true,
        effectiveDate: currentTax.effectiveDate?.substring(0, 10) || "",
        expirationDate: currentTax.expirationDate?.substring(0, 10) || "",
        tieredRates: currentTax.tieredRates || [],
      });
    }
  }, [currentTax]);

  const validate = () => {
    const { error } = validateTaxRate(formData);
    if (!error) return null;

    const validationErrors = {};
    for (let item of error.details)
      validationErrors[item.path[0]] = item.message;
    return validationErrors;
  };

  const handleChange = ({ target: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) newErrors[input.name] = errorMessage;
    else delete newErrors[input.name];

    setFormData((prev) => ({
      ...prev,
      [input.name]: input.type === "checkbox" ? input.checked : input.value,
    }));

    setErrors(newErrors);
  };

  const handleTierChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
  };

  const addTieredRate = () => {
    if (tier.minAmount && tier.maxAmount && tier.rate) {
      setFormData((prev) => ({
        ...prev,
        tieredRates: [...prev.tieredRates, { ...tier }],
      }));
      setTier({ minAmount: "", maxAmount: "", rate: "" });
    } else {
      toast.error("Please fill in all tiered rate fields.");
    }
  };

  const removeTieredRate = (index) => {
    setFormData((prev) => ({
      ...prev,
      tieredRates: prev.tieredRates.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (currentTax) {
        await updateTaxRate(currentTax._id, formData);
        toast.success("Tax rate updated successfully");
      } else {
        await saveTaxRate(formData);
        toast.success("New tax rate created successfully");
      }

      onSaveComplete();
    } catch (error) {
      console.error("Error saving tax rate:", error);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    tier,
    handleTierChange,
    addTieredRate,
    removeTieredRate,
  };
}
