import React from "react";
import Spinner from "./spinner";
import Button from "../button";
import "../styles/createNew.css";

export default function PublishActions({
  postPublished,
  handlePostDelete,
  publishing,
  handlePostPublish,
  networkStatus,
  editingMode,
  handleUpdatePublish,
  updating,
}) {
  return (
    <div className="publish__actions">
      {postPublished && (
        <div className="delete-button-container">
          <Button
            type="submit"
            onClick={handlePostDelete}
            title="Delete"
            className="publish__actions__btn delete-button"
          />
        </div>
      )}

      <div className="publish__button">
        {updating && <Spinner className="spinner" />}
        {editingMode ? (
          <Button
            type="submit"
            onClick={handleUpdatePublish}
            title="Update"
            className="publish__actions__btn"
            disabled={!networkStatus}
          />
        ) : (
          <>
            {publishing && <Spinner className="spinner" />}
            <Button
              type="submit"
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
