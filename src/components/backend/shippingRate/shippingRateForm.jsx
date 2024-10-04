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

  //   const getCoordinates = async (storeName) => {
  //     try {
  //       const apiKey = "d6b91191327c4224b64fed489e5a4207";
  //       const response = await axios.get(
  //         `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
  //           storeName
  //         )}&key=${apiKey}`
  //       );

  //       if (
  //         response.data &&
  //         response.data.results &&
  //         response.data.results.length > 0
  //       ) {
  //         const { lat, lng } = response.data.results[0].geometry;
  //         return { lat, lon: lng };
  //       } else {
  //         throw new Error("No coordinates found");
  //       }
  //     } catch (error) {
  //       console.error("Geocoding failed:", error);
  //       throw new Error("Geocoding failed");
  //     }
  //   };

  const fetchLocationSuggestions = async (query) => {
    try {
      const apiKey = "0636d54539ea4a298f36acf75edcf3c8";
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
      // Get coordinates if the storeName is valid
      const coordinates = await getCoordinates(storeName);

      const payload = {
        ratePerMile,
        baseRate,
        storeLocation: coordinates || storeLocation, // If new coordinates found, else use existing
        isGlobal,
      };

      if (rateToEdit) {
        await updateShippingRate(rateToEdit._id, payload);
        toast.success("Shipping rate updated successfully");
      } else {
        await saveShippingRate(payload);
        toast.success("Shipping rate added successfully");
      }

      // Ensure that onFormSubmit is called after a successful update or create
      if (onFormSubmit) {
        onFormSubmit(); // Triggers a refresh of the list
      }

      // Reset the form after a successful submission
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to update shipping rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shippingRate-form">
      <h2>{rateToEdit ? "Update Shipping Rate" : "Add Shipping Rate"}</h2>
      <form onSubmit={handleSubmit}>
        <InputField
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
          label="Rate Per Mile"
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
          label="Base Shipping Rate"
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
          // className="shippingRate__input"
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : rateToEdit ? "Update Rate" : "Add Rate"}
        </button>
      </form>
    </div>
  );
}
