import React, { useState } from "react";
import EditAddressForm from "./EditAddressForm";
import "../../styles/myAddress.css";

export default function AddressCard({ address, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = (updatedAddress) => {
    onUpdate(updatedAddress);
    setIsEditing(false);
  };

  return (
    <div className="address-card">
      {isEditing ? (
        <EditAddressForm
          addressId={address._id}
          onUpdateAddress={handleUpdate}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          <h3>
            {address.firstName} {address.lastName}
          </h3>
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
          <p>{address.phoneNumber}</p>
          {address.isDefault && <p className="default">Default Address</p>}
          <div className="address-card-actions">
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={() => onDelete(address._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
