// ThreeDSModal.js
import React, { useEffect, useRef } from "react";
import checkoutService from "../../../../services/checkoutService";

const ThreeDSModal = ({ isOpen, onSuccess, onCancel, threeDSData }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen && threeDSData) {
      handle3DSAuthentication();
    }
  }, [isOpen, threeDSData]);

  const handle3DSAuthentication = async () => {
    try {
      const result = await checkoutService.processPaymentWith3DS(
        threeDSData.clientSecret
      );

      if (result.status === "succeeded") {
        onSuccess(result);
      } else {
        onCancel();
      }
    } catch (error) {
      console.error("3DS processing error:", error);
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal threeDS-modal" ref={modalRef}>
        <div className="modal-header">
          <h3>Secure Payment Authentication</h3>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="threeDS-content">
            <div className="loading-spinner">
              <i className="fa fa-spinner fa-spin"></i>
            </div>
            <p>Please complete the authentication with your bank...</p>
            <div className="security-notice">
              <i className="fa fa-shield"></i>
              <span>This is a secure 3D Secure authentication process</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDSModal;
