import React, { useState } from "react";
import checkoutService from "../../../services/checkoutService";
import AddressForm from "./forms/addressForm";
import Modal from "./utility/checkoutProgress";

export default function AddressStep({
  addresses,
  selectedAddress,
  onAddressSelect,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddAddress = async (addressData) => {
    setLoading(true);
    setError("");

    try {
      const result = await checkoutService.createAddress(addressData);

      if (result.success) {
        onAddAddress(result.data);
        setShowAddModal(false);
      } else {
        setError(result.message || "Failed to add address");
      }
    } catch (err) {
      setError(err.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (addressData) => {
    setLoading(true);
    setError("");

    try {
      const result = await checkoutService.updateAddress(
        editingAddress._id,
        addressData
      );

      if (result.success) {
        onUpdateAddress(result.data);
        setShowEditModal(false);
        setEditingAddress(null);
      } else {
        setError(result.message || "Failed to update address");
      }
    } catch (err) {
      setError(err.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await checkoutService.deleteAddress(addressId);

      if (result.success) {
        onDeleteAddress(addressId);
      } else {
        setError(result.message || "Failed to delete address");
      }
    } catch (err) {
      setError(err.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    setLoading(true);
    setError("");

    try {
      const result = await checkoutService.setDefaultAddress(addressId);

      if (result.success) {
        // Reload addresses to get updated default status
        const addressesResult = await checkoutService.getAddresses();
        if (addressesResult.success) {
          // Update all addresses with new default status
          addressesResult.data.forEach((addr) => {
            if (addresses.find((a) => a._id === addr._id)) {
              onUpdateAddress(addr);
            }
          });
        }
      }
    } catch (err) {
      setError(err.message || "Failed to set default address");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setShowEditModal(true);
  };

  return (
    <div className="address-step">
      <div className="step-header">
        <h2 className="step-title">
          <span className="step-number">1</span>
          Shipping Address
        </h2>
        <p className="step-description">
          Choose where you'd like your order delivered
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fa fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="empty-state">
            <i className="fa fa-map-marker-alt"></i>
            <p>No saved addresses yet</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fa fa-plus"></i> Add New Address
            </button>
          </div>
        ) : (
          <>
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`address-card ${
                  selectedAddress?._id === address._id ? "selected" : ""
                }`}
                onClick={() => onAddressSelect(address)}
              >
                <div className="address-card-header">
                  <label className="address-radio">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === address._id}
                      onChange={() => onAddressSelect(address)}
                    />
                    <span className="radio-checkmark"></span>
                  </label>

                  {address.isDefault && (
                    <span className="badge badge-primary">Default</span>
                  )}
                </div>

                <div className="address-content">
                  <h3 className="address-name">{address.fullName}</h3>
                  <p className="address-details">
                    {address.address}
                    {address.address2 && `, ${address.address2}`}
                  </p>
                  <p className="address-details">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="address-details">{address.country}</p>
                  {address.phoneNumber && (
                    <p className="address-phone">
                      <i className="fa fa-phone"></i> {address.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="address-actions">
                  <button
                    className="btn-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(address);
                    }}
                  >
                    <i className="fa fa-edit"></i> Edit
                  </button>

                  {!address.isDefault && (
                    <button
                      className="btn-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address._id);
                      }}
                    >
                      <i className="fa fa-star"></i> Set as Default
                    </button>
                  )}

                  <button
                    className="btn-link text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address._id);
                    }}
                  >
                    <i className="fa fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}

            <button
              className="btn btn-outline add-address-btn"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fa fa-plus"></i> Add New Address
            </button>
          </>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Address"
      >
        <AddressForm
          onSubmit={handleAddAddress}
          onCancel={() => setShowAddModal(false)}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAddress(null);
        }}
        title="Edit Address"
      >
        <AddressForm
          initialData={editingAddress}
          onSubmit={handleUpdateAddress}
          onCancel={() => {
            setShowEditModal(false);
            setEditingAddress(null);
          }}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
