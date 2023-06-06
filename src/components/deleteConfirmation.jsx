import React from "react";
import "../components/styles/deleteConfirmation.css";

export default function DeleteConfirmation({
  handleConfirmDelete,
  handleDeleteCancel,
  isConfirmationOpen,
  commentToDeleteId,
}) {
  return (
    <section>
      {isConfirmationOpen && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this comment?</p>
          <button onClick={() => handleConfirmDelete(commentToDeleteId)}>
            Yes
          </button>
          <button onClick={handleDeleteCancel}>No</button>
        </div>
      )}
    </section>
  );
}
