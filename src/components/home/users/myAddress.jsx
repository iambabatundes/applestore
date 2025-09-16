import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddNewAddress from "./address/AddNewAddress";
import EditAddress from "./address/EditAddressForm";
import AddressCard from "./address/AddressCard";
import CustomModal from "./common/customModal";
import {
  deleteAddress,
  getUserAddresses,
} from "../../../services/addressService";

export default function MyAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addresses = await getUserAddresses();
        setAddresses(addresses);
        setError(null);
      } catch (err) {
        console.error("Error fetching addresses: ", err);
        setError(err.message || "An error occurred while fetching addresses.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
    setShowAddAddress(false);
  };

  const handleUpdateAddress = (updatedAddress) => {
    setAddresses(
      addresses.map((address) =>
        address._id === updatedAddress._id ? updatedAddress : address
      )
    );
    setEditingAddress(null);
  };

  async function handleDeleteAddress() {
    const originalAddresses = [...addresses];
    const updatedAddresses = originalAddresses.filter(
      (a) => a._id !== addressToDelete._id
    );
    setAddresses(updatedAddresses);
    setShowDeleteModal(false);

    try {
      await deleteAddress(addressToDelete._id);
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address: ", error);
      if (error.response && error.response.status === 404)
        toast.error("This address has already been deleted");
      setAddresses(originalAddresses);
    }
  }

  const openDeleteModal = (address) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAddressToDelete(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="my-address">
      <div className="myAddress__header">
        {showAddAddress ? (
          <article className="myAddress__heading">
            <button onClick={() => setShowAddAddress(false)}>← Back</button>
            <h1>Add New Address</h1>
          </article>
        ) : editingAddress ? (
          <article className="myAddress__heading">
            <button onClick={() => setEditingAddress(null)}>← Back</button>
            <h1>Edit Address</h1>
          </article>
        ) : (
          <article className="myAddress__heading">
            <h1>My Address</h1>
            <span>({addresses.length})</span>
            <button onClick={() => setShowAddAddress(true)}>
              Add New Address
            </button>
          </article>
        )}
      </div>
      {showAddAddress && <AddNewAddress onAddAddress={handleAddAddress} />}
      {editingAddress && (
        <EditAddress
          address={editingAddress}
          onUpdateAddress={handleUpdateAddress}
        />
      )}
      {!showAddAddress && !editingAddress && addresses.length === 0 && (
        <div className="no-addresses">
          <p>You don't have any addresses yet.</p>
          <button onClick={() => setShowAddAddress(true)}>
            Add New Address
          </button>
        </div>
      )}
      {!showAddAddress && !editingAddress && addresses.length > 0 && (
        <div className="address-list">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onUpdate={() => setEditingAddress(address)}
              onDelete={() => openDeleteModal(address)}
            />
          ))}
        </div>
      )}
      <CustomModal
        isOpen={showDeleteModal}
        onRequestClose={closeDeleteModal}
        onConfirm={handleDeleteAddress}
      />
    </section>
  );
}
