import React, { useState } from "react";
import "../../styles/myAddress.css";
import { saveAddress } from "../../../../services/addressService";

export default function AddNewAddress({ onAddAddress }) {
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    isDefault: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress({
      ...address,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: addressData } = await saveAddress(address);
      onAddAddress(addressData);
      setAddress({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        isDefault: false,
      });
      setError(null);
    } catch (err) {
      setError(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-address-form" onSubmit={handleSubmit}>
      <h2>Add New Address</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        name="firstName"
        value={address.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="lastName"
        value={address.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        type="text"
        name="addressLine1"
        value={address.addressLine1}
        onChange={handleChange}
        placeholder="Address Line 1"
        required
      />
      <input
        type="text"
        name="addressLine2"
        value={address.addressLine2}
        onChange={handleChange}
        placeholder="Address Line 2"
      />
      <input
        type="text"
        name="city"
        value={address.city}
        onChange={handleChange}
        placeholder="City"
        required
      />
      <input
        type="text"
        name="state"
        value={address.state}
        onChange={handleChange}
        placeholder="State"
        required
      />
      <input
        type="text"
        name="postalCode"
        value={address.postalCode}
        onChange={handleChange}
        placeholder="Postal Code"
        required
      />
      <input
        type="text"
        name="country"
        value={address.country}
        onChange={handleChange}
        placeholder="Country"
        required
      />
      <input
        type="text"
        name="phoneNumber"
        value={address.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <label>
        <input
          type="checkbox"
          name="isDefault"
          checked={address.isDefault}
          onChange={handleChange}
        />
        Set as default address
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Address"}
      </button>
    </form>
  );
}
