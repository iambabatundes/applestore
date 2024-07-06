import React, { useState, useEffect } from "react";
import "../../styles/myAddress.css";
import { getAddress, updateAddress } from "../../../../services/addressService";

export default function EditAddressForm({
  addressId,
  onUpdateAddress,
  onClose,
}) {
  const [editAddress, setEditAddress] = useState({
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

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const { data: editAddress } = await getAddress(addressId);
        setEditAddress(editAddress);
        setError(null);
      } catch (err) {
        setError(err.editAddress);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [addressId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddress({
      ...editAddress,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateAddress(addressId, editAddress);
      onUpdateAddress(data);
      onClose();
    } catch (err) {
      setError(err.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="edit-address-form" onSubmit={handleSubmit}>
      <h2>Edit Address</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        name="firstName"
        value={editAddress.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />

      <input
        type="text"
        name="lastName"
        value={editAddress.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        type="text"
        name="addressLine1"
        value={editAddress.addressLine1}
        onChange={handleChange}
        placeholder="Address Line 1"
        required
      />
      <input
        type="text"
        name="addressLine2"
        value={editAddress.addressLine2}
        onChange={handleChange}
        placeholder="Address Line 2"
      />
      <input
        type="text"
        name="city"
        value={editAddress.city}
        onChange={handleChange}
        placeholder="City"
        required
      />
      <input
        type="text"
        name="state"
        value={editAddress.state}
        onChange={handleChange}
        placeholder="State"
        required
      />
      <input
        type="text"
        name="postalCode"
        value={editAddress.postalCode}
        onChange={handleChange}
        placeholder="Postal Code"
        required
      />
      <input
        type="text"
        name="country"
        value={editAddress.country}
        onChange={handleChange}
        placeholder="Country"
        required
      />
      <input
        type="text"
        name="phoneNumber"
        value={editAddress.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <label>
        <input
          type="checkbox"
          name="isDefault"
          checked={editAddress.isDefault}
          onChange={handleChange}
        />
        Set as default address
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Address"}
      </button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
}
