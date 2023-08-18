import React from "react";

export default function AutoFillForm({ handleAutofill, autofillError }) {
  //   const handleAutofill = async (setFieldValue) => {
  //     if ("geolocation" in navigator) {
  //       try {
  //         const position = await new Promise((resolve, reject) => {
  //           navigator.geolocation.getCurrentPosition(resolve, reject);
  //         });

  //         const { latitude, longitude } = position.coords;

  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  //         );
  //         const data = await response.json();

  //         const address = data.display_name;
  //         const country = data.address.country;
  //         const state = data.address.state;
  //         const city = data.address.city;
  //         const zipCode = data.address.postcode;

  //         setFieldValue("country", country);
  //         setFieldValue("state", state);
  //         setFieldValue("city", city);
  //         setFieldValue("address", address);
  //         setFieldValue("zipCode", zipCode);

  //         setAutofillError(null);
  //       } catch (error) {
  //         console.log("Error fetching or processing location data:", error);
  //         setAutofillError("Error fetching or processing location data.");
  //       }
  //     } else {
  //       setAutofillError(
  //         "Geolocation is not supported by your browser. Please fill in the fields manually."
  //       );
  //     }
  //   };

  return (
    <section>
      <div className="address-form">
        <span className="address-save">
          Save time. Autofill your current location.
          <button type="button" onClick={handleAutofill}>
            Autofill
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
