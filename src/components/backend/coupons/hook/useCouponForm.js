import { useState, useEffect } from "react";
import Joi from "joi";
import { saveCoupon, updateCoupon } from "../../../../services/couponService";

export function useCouponForm(selectedCoupon, onSaveComplete) {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountPercentage: 1,
    discountValue: 1,
    expirationDate: "",
    minimumOrderAmount: 0,
    usageLimit: 1,
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedCoupon) {
      const formattedCoupon = {
        ...selectedCoupon,
        expirationDate: selectedCoupon.expirationDate
          ? new Date(selectedCoupon.expirationDate).toISOString().split("T")[0]
          : "",
      };
      setFormData(formattedCoupon);
    }
  }, [selectedCoupon]);

  const schema = Joi.object({
    code: Joi.string().required().label("Coupon Code"),
    discountType: Joi.string().valid("percentage", "fixed").required(),
    discountPercentage: Joi.number()
      .min(1)
      .max(100)
      .when("discountType", {
        is: "percentage",
        then: Joi.required(),
      })
      .label("Discount Percentage"),
    discountValue: Joi.number()
      .min(1)
      .when("discountType", {
        is: "fixed",
        then: Joi.required(),
      })
      .label("Discount Value"),
    expirationDate: Joi.date().label("Expiration Date"),
    minimumOrderAmount: Joi.number().min(0).label("Minimum Order Amount"),
    usageLimit: Joi.number().min(1).label("Usage Limit"),
    isActive: Joi.boolean(),
  });

  const validate = () => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (!error) return null;

    const validationErrors = {};
    for (let item of error.details) {
      validationErrors[item.path[0]] = item.message;
    }
    return validationErrors;
  };

  const handleChange = ({ target: { name, value } }) => {
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const couponData = {
      code: formData.code,
      discountType: formData.discountType,
      expirationDate: formData.expirationDate,
      minimumOrderAmount: formData.minimumOrderAmount,
      usageLimit: formData.usageLimit,
      isActive: formData.isActive,
    };

    if (formData.discountType === "percentage") {
      couponData.discountPercentage = Number(formData.discountPercentage);
    } else if (formData.discountType === "fixed") {
      couponData.discountValue = Number(formData.discountValue);
    }

    const validationErrors = validate();
    if (validationErrors) {
      console.log(validationErrors);
      return;
    }

    try {
      if (selectedCoupon) {
        await updateCoupon(selectedCoupon._id, couponData);
      } else {
        await saveCoupon(couponData);
      }

      onSaveComplete();
      resetForm();
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountPercentage: 1,
      discountValue: 1,
      expirationDate: "",
      minimumOrderAmount: 0,
      usageLimit: 1,
      isActive: true,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
  };
}
