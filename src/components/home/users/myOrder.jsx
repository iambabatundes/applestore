import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../../services/orderService";
import config from "../../../config.json";

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, searchQuery, dateFilter, orders]);

  const fetchOrders = async () => {
    try {
      const { data } = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const applyFilters = () => {
    let filtered = orders;

    if (statusFilter) {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.items.some((item) =>
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        return orderDate === dateFilter;
      });
    }

    setFilteredOrders(filtered);
  };

  return (
    <section>
      <h1>My Orders</h1>

      {orders.length > 0 ? (
        <>
          <div>
            <label>
              Status:
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Successful">Successful</option>
                <option value="Failed">Failed</option>
              </select>
            </label>

            <label>
              Search:
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name"
              />
            </label>

            <label>
              Date:
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </label>
          </div>

          <ul>
            {filteredOrders.map((order) => (
              <li key={order._id}>
                <p>Order Number: {order.orderNumber}</p>
                <p>Status: {order.orderStatus}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total: ${order.total.toFixed(2)}</p>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={`${config.mediaUrl}/uploads/${item.product.featureImage.filename}`}
                      alt={item.product.name}
                      style={{ width: "100px", height: "100px" }}
                    />
                    <p>Product: {item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Unit Price: ${item.unitPrice.toFixed(2)}</p>
                    <p>
                      Total Price: $
                      {(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No orders yet</p>
      )}
    </section>
  );
}
