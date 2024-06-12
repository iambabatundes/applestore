import React, { useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";

import "./styles/adminNotification.css";

const AdminNotification = ({ notifications = [] }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  return (
    <div className="notifications">
      <div className="notifications__icon" onClick={toggleModal}>
        <FaBell />
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </div>
      {modalOpen && (
        <div className="notifications__modal">
          <div className="notifications__modal-content">
            <button className="notifications__close" onClick={toggleModal}>
              <FaTimes />
            </button>
            <div className="notifications__list">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.message}
                </div>
              ))}
            </div>
            {selectedNotification && (
              <div className="notification-details">
                <h2>Details</h2>
                <p>{selectedNotification.details}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotification;
