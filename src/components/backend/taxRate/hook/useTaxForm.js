// components/admin/tax/hook/useTaxForm.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  saveTaxRate,
  updateTaxRate,
  calculateTax,
} from "../../../../services/taxRateService";
import {
  validateTaxRate,
  validateProperty,
  formatValidationErrors,
} from "../validation";

export function useTaxForm(currentTax, onSaveComplete) {
  const [formData, setFormData] = useState({
    country: "",
    region: "",
    city: "",
    postalCode: "",
    taxRate: "",
    taxCode: "",
    taxName: "",
    taxType: "SALES",
    isGlobal: false,
    isActive: true,
    priority: 0,
    effectiveDate: "",
    expirationDate: "",
    tieredRates: [],
    productCategories: [],
    excludedCategories: [],
    isCompound: false,
    compoundOrder: 0,
    applyToShipping: true,
    description: "",
    jurisdictionLevel: "STATE",
    taxAuthority: "",
    lastModifiedReason: "",
  });

  const [tier, setTier] = useState({
    minAmount: "",
    maxAmount: "",
    rate: "",
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [excludedCategoryInput, setExcludedCategoryInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculationPreview, setCalculationPreview] = useState(null);

  const resetForm = () => {
    setFormData({
      country: "",
      region: "",
      city: "",
      postalCode: "",
      taxRate: "",
      taxCode: "",
      taxName: "",
      taxType: "SALES",
      isGlobal: false,
      isActive: true,
      priority: 0,
      effectiveDate: "",
      expirationDate: "",
      tieredRates: [],
      productCategories: [],
      excludedCategories: [],
      isCompound: false,
      compoundOrder: 0,
      applyToShipping: true,
      description: "",
      jurisdictionLevel: "STATE",
      taxAuthority: "",
      lastModifiedReason: "",
    });
    setTier({ minAmount: "", maxAmount: "", rate: "" });
    setCategoryInput("");
    setExcludedCategoryInput("");
    setErrors({});
  };

  useEffect(() => {
    if (currentTax) {
      setFormData({
        country: currentTax.country || "",
        region: currentTax.region || "",
        city: currentTax.city || "",
        postalCode: currentTax.postalCode || "",
        taxRate: currentTax.taxRate || "",
        taxCode: currentTax.taxCode || "",
        taxName: currentTax.taxName || "",
        taxType: currentTax.taxType || "SALES",
        isGlobal:
          currentTax.isGlobal !== undefined ? currentTax.isGlobal : false,
        isActive:
          currentTax.isActive !== undefined ? currentTax.isActive : true,
        priority: currentTax.priority || 0,
        effectiveDate: currentTax.effectiveDate
          ? currentTax.effectiveDate.substring(0, 10)
          : "",
        expirationDate: currentTax.expirationDate
          ? currentTax.expirationDate.substring(0, 10)
          : "",
        tieredRates: currentTax.tieredRates || [],
        productCategories: currentTax.productCategories || [],
        excludedCategories: currentTax.excludedCategories || [],
        isCompound: currentTax.isCompound || false,
        compoundOrder: currentTax.compoundOrder || 0,
        applyToShipping:
          currentTax.applyToShipping !== undefined
            ? currentTax.applyToShipping
            : true,
        description: currentTax.description || "",
        jurisdictionLevel: currentTax.jurisdictionLevel || "STATE",
        taxAuthority: currentTax.taxAuthority || "",
        lastModifiedReason: "",
      });
    } else {
      resetForm();
    }
  }, [currentTax]);

  const validate = () => {
    const { error } = validateTaxRate(formData, !!currentTax);
    if (!error) return null;
    return formatValidationErrors(error);
  };

  const handleChange = ({ target: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);

    if (errorMessage) {
      newErrors[input.name] = errorMessage;
    } else {
      delete newErrors[input.name];
    }

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
    if (!tier.minAmount || !tier.maxAmount || !tier.rate) {
      toast.error("Please fill in all tiered rate fields");
      return;
    }

    const minAmount = parseFloat(tier.minAmount);
    const maxAmount = parseFloat(tier.maxAmount);
    const rate = parseFloat(tier.rate);

    if (minAmount < 0 || maxAmount < 0 || rate < 0 || rate > 100) {
      toast.error("Invalid tiered rate values");
      return;
    }

    if (maxAmount <= minAmount) {
      toast.error("Maximum amount must be greater than minimum amount");
      return;
    }

    // Check for overlaps
    const hasOverlap = formData.tieredRates.some(
      (existingTier) =>
        (minAmount >= existingTier.minAmount &&
          minAmount < existingTier.maxAmount) ||
        (maxAmount > existingTier.minAmount &&
          maxAmount <= existingTier.maxAmount) ||
        (minAmount <= existingTier.minAmount &&
          maxAmount >= existingTier.maxAmount)
    );

    if (hasOverlap) {
      toast.error("Tiered rates cannot overlap");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tieredRates: [...prev.tieredRates, { minAmount, maxAmount, rate }],
    }));
    setTier({ minAmount: "", maxAmount: "", rate: "" });
    toast.success("Tiered rate added");
  };

  const removeTieredRate = (index) => {
    setFormData((prev) => ({
      ...prev,
      tieredRates: prev.tieredRates.filter((_, i) => i !== index),
    }));
    toast.info("Tiered rate removed");
  };

  const addProductCategory = () => {
    const trimmedCategory = categoryInput.trim();
    if (!trimmedCategory) {
      toast.error("Please enter a category name");
      return;
    }

    if (formData.productCategories.includes(trimmedCategory)) {
      toast.error("Category already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      productCategories: [...prev.productCategories, trimmedCategory],
    }));
    setCategoryInput("");
    toast.success("Category added");
  };

  const removeProductCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.filter((_, i) => i !== index),
    }));
  };

  const addExcludedCategory = () => {
    const trimmedCategory = excludedCategoryInput.trim();
    if (!trimmedCategory) {
      toast.error("Please enter a category name");
      return;
    }

    if (formData.excludedCategories.includes(trimmedCategory)) {
      toast.error("Category already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      excludedCategories: [...prev.excludedCategories, trimmedCategory],
    }));
    setExcludedCategoryInput("");
    toast.success("Excluded category added");
  };

  const removeExcludedCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      excludedCategories: prev.excludedCategories.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Please fix validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = { ...formData };

      // Clean up data
      if (!submitData.region) submitData.region = null;
      if (!submitData.city) submitData.city = null;
      if (!submitData.postalCode) submitData.postalCode = null;
      if (!submitData.expirationDate) submitData.expirationDate = null;
      if (!submitData.description) submitData.description = "";
      if (!submitData.taxAuthority) submitData.taxAuthority = "";

      // Remove empty arrays
      if (submitData.tieredRates.length === 0) delete submitData.tieredRates;
      if (submitData.productCategories.length === 0)
        delete submitData.productCategories;
      if (submitData.excludedCategories.length === 0)
        delete submitData.excludedCategories;

      if (currentTax) {
        await updateTaxRate(currentTax._id, submitData);
        toast.success("Tax rate updated successfully");
      } else {
        await saveTaxRate(submitData);
        toast.success("Tax rate created successfully");
      }

      onSaveComplete();
      resetForm();
    } catch (error) {
      console.error("Error saving tax rate:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.param || err.path] = err.msg || err.message;
        });
        setErrors(backendErrors);
        toast.error("Validation failed");
      } else {
        toast.error("Failed to save tax rate");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const testCalculation = useCallback(
    async (testAmount = 100) => {
      if (!formData.country || !formData.taxRate) {
        toast.error("Please provide country and tax rate for calculation test");
        return;
      }

      try {
        const testItems = [
          {
            productId: "test",
            productName: "Test Product",
            price: testAmount,
            quantity: 1,
            category: formData.productCategories[0] || "general",
          },
        ];

        const location = {
          country: formData.country,
          region: formData.region,
          city: formData.city,
        };

        const result = await calculateTax(testItems, location, 0);
        setCalculationPreview(result);
      } catch (error) {
        console.error("Calculation test failed:", error);
        toast.error("Failed to test calculation");
      }
    },
    [formData]
  );

  useEffect(() => {
    if (formData.country && formData.taxRate && !currentTax) {
      const timeoutId = setTimeout(() => {
        testCalculation(100);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    formData.country,
    formData.taxRate,
    formData.region,
    formData.city,
    testCalculation,
    currentTax,
  ]);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    tier,
    handleTierChange,
    addTieredRate,
    removeTieredRate,
    categoryInput,
    setCategoryInput,
    addProductCategory,
    removeProductCategory,
    excludedCategoryInput,
    setExcludedCategoryInput,
    addExcludedCategory,
    removeExcludedCategory,
    calculationPreview,
    testCalculation,
  };
}
