import React, { useState, useEffect } from "react";
import Joi from "joi";
import {
  saveShippingRate,
  updateShippingRate,
} from "../../../services/shippingService";
import { toast } from "react-toastify";
import axios from "axios";
import "./styles/shippingRate.css";

import { InputField } from "./common/inputField";
import { getAddressFromCoordinates, getCoordinates } from "./utils/geoUtils";

export default function ShippingRateForm({ rateToEdit, onFormSubmit }) {
  const [ratePerMile, setRatePerMile] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeLocation, setStoreLocation] = useState({ lat: "", lon: "" });
  const [isGlobal, setIsGlobal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Populate form if editing
  useEffect(() => {
    if (rateToEdit) {
      setRatePerMile(rateToEdit.ratePerMile);
      setBaseRate(rateToEdit.baseRate);
      if (rateToEdit.storeName) {
        setStoreName(rateToEdit.storeName); // Use the storeName if available
      } else if (rateToEdit.storeLocation) {
        // Fallback to reverse geocoding coordinates if storeName is not present
        const fetchStoreName = async () => {
          const address = await getAddressFromCoordinates(
            rateToEdit.storeLocation.lat,
            rateToEdit.storeLocation.lon
          );
          setStoreName(address); // Set the reverse-geocoded address as storeName
        };
        fetchStoreName();
      }
      setStoreLocation(rateToEdit.storeLocation || { lat: "", lon: "" });
      setIsGlobal(rateToEdit.isGlobal);
    } else {
      resetForm();
    }
  }, [rateToEdit]);

  const resetForm = () => {
    setRatePerMile("");
    setBaseRate("");
    setStoreName("");
    setStoreLocation({ lat: "", lon: "" });
    setIsGlobal(true);
    setErrors({});
  };

  const schema = Joi.object({
    ratePerMile: Joi.number().min(1).required().label("Rate Per Mile"),
    baseRate: Joi.number().min(0).label("Base Rate"),
    storeName: Joi.string().required().label("Store Location"),
    isGlobal: Joi.boolean(),
  });

  const validate = () => {
    const { error } = schema.validate(
      { ratePerMile, baseRate, storeName, isGlobal },
      { abortEarly: false }
    );
    if (!error) return null;

    const errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    return errors;
  };

  const handleBlur = (fieldName) => {
    const validationErrors = validate();
    if (validationErrors) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: validationErrors[fieldName],
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: null }));
    }
  };

  const fetchLocationSuggestions = async (query) => {
    try {
      const apiKey = "e62227997ef1470d95fa3a67338d71f0";
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          query
        )}&key=${apiKey}`
      );

      if (response.data && response.data.results.length > 0) {
        setLocationSuggestions(
          response.data.results.map((result) => result.formatted)
        );
      }
    } catch (error) {
      console.error("Failed to fetch location suggestions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const coordinates = await getCoordinates(storeName);

      const payload = {
        ratePerMile,
        baseRate,
        storeLocation: coordinates || storeLocation,
        isGlobal,
      };

      if (rateToEdit) {
        onFormSubmit({ ...rateToEdit, ...payload });
        await updateShippingRate(rateToEdit._id, payload);
        toast.success("Shipping rate updated successfully");
      } else {
        const newRate = await saveShippingRate(payload);
        onFormSubmit(newRate);
        toast.success("Shipping rate added successfully");
      }

      //   if (onFormSubmit) {
      //     onFormSubmit(); // Triggers a refresh of the list
      //   }

      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to update shipping rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shippingRate-form">
      <h2 className="shippingForm__heading">
        {rateToEdit ? "Update Shipping Rate" : "Add Shipping Rate"}
      </h2>
      <form onSubmit={handleSubmit}>
        <InputField
          autoFocus
          type="number"
          value={ratePerMile}
          onChange={(e) => setRatePerMile(e.target.value)}
          onBlur={() => handleBlur("ratePerMile")}
          inputFieldContainer="shippingRate__container"
          inputFieldInput="shippingRate__input"
          inputFieldLabel="shippingRate__label"
          inputFieldError="shippingRate__error"
          placeholder="Rate Per Mile"
          error={errors.ratePerMile}
          //   label="Rate Per Mile"
        />

        <InputField
          type="number"
          value={baseRate}
          onChange={(e) => setBaseRate(e.target.value)}
          onBlur={() => handleBlur("baseRate")}
          inputFieldContainer="shippingRate__container"
          inputFieldInput="shippingRate__input"
          inputFieldLabel="shippingRate__label"
          inputFieldError="shippingRate__error"
          placeholder="Base Shipping Rate"
          error={errors.baseRate}
          //   label="Base Shipping Rate"
        />

        <InputField
          type="text"
          value={storeName}
          onChange={(e) => {
            setStoreName(e.target.value);
            fetchLocationSuggestions(e.target.value);
          }}
          onBlur={() => handleBlur("storeName")}
          inputFieldContainer="shippingRate__container"
          inputFieldInput="shippingRate__input"
          inputFieldLabel="shippingRate__label"
          inputFieldError="shippingRate__error"
          placeholder="Enter store location"
          error={errors.storeName}
          label="Store Location (State/Country Name)"
        />

        {locationSuggestions.length > 0 && (
          <ul className="location-suggestions">
            {locationSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => setStoreName(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        <InputField
          type="checkbox"
          checked={isGlobal}
          onChange={() => setIsGlobal(!isGlobal)}
          label="Is Global"
          className="shippingRate__input"
          inputFieldLabel="shippingRate__checkout-label"
          inputFieldInput="shippingRate__checkout"
        />

        <button
          type="submit"
          className="shippingRate__submit-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : rateToEdit ? "Update Rate" : "Add Rate"}
        </button>
      </form>
    </div>
  );
}
