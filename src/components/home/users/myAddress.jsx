import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddNewAddress from "./address/AddNewAddress";
import AddressCard from "./address/AddressCard";
import {
  deleteAddress,
  getUserAddress,
} from "../../../services/addressService";

export default function MyAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addresses = await getUserAddress();
        console.log("Fetched addresses: ", addresses);
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
  };

  const handleUpdateAddress = (updatedAddress) => {
    setAddresses(
      addresses.map((address) =>
        address._id === updatedAddress._id ? updatedAddress : address
      )
    );
  };

  async function handleDeleteAddress(address) {
    const originalAddresses = [...addresses];
    const updatedAddresses = originalAddresses.filter(
      (a) => a._id !== address._id
    );
    setAddresses(updatedAddresses);

    try {
      await deleteAddress(address._id);
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address: ", error);
      if (error.response && error.response.status === 404)
        toast.error("This address has already been deleted");
      setAddresses(originalAddresses);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="my-address">
      <div className="myAddress__header">
        <article>
          <h1>My Address</h1>
          <span>({addresses.length})</span>
        </article>

        <AddNewAddress onAddAddress={handleAddAddress} />
      </div>
      <div className="address-list">
        {Array.isArray(addresses) &&
          addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onUpdate={handleUpdateAddress}
              onDelete={handleDeleteAddress}
            />
          ))}
      </div>
    </section>
  );
}
