import React from "react";
import Spinner from "./spinner";
import Button from "../button";
import "../styles/createNew.css";

export default function PublishActions({
  postPublished,
  handlePostDelete,
  handlePostPublish,
  networkStatus,
  editingMode,
  handleUpdatePublish,
}) {
  return (
    <div className="publish__actions">
      {postPublished && (
        <div className="delete-button-container">
          <Button
            type="button"
            onClick={handlePostDelete}
            title="Delete"
            className="publish__actions__btn delete-button"
          />
        </div>
      )}

      <div className="publish__button">
        {editingMode ? (
          <Button
            type="button"
            onClick={handleUpdatePublish}
            title="Update"
            className="publish__actions__btn"
            disabled={!networkStatus}
          />
        ) : (
          <>
            <Button
              type="button"
              onClick={handlePostPublish}
              title="Publish"
              className="publish__actions__btn"
              disabled={!networkStatus}
            />
          </>
        )}
      </div>
    </div>
  );
}
