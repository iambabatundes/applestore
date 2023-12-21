import React from "react";
import { Link } from "react-router-dom";
import Input from "../input";
import Button from "../../button";

export default function FormTitle({
  updatePermalink,
  showPermalink,
  permalinkURL,
  isEditingPermalink,
  editedPermalink,
  saveEditedPermalink,
  cancelEditPermalink,
  setEditedPermalink,
  startEditPermalink,
  handleTitleChange,
}) {
  return (
    <div>
      <Input
        type="text"
        id="AddTile"
        className="createPost__title"
        name="Add title"
        onChange={(e) => updatePermalink(e.target.value)}
        placeholder="Add title"
        size="28"
        spellCheck="true"
        autoComplete="off"
      />

      {showPermalink && (
        <div className="permalink">
          <>
            <span>Permalink: </span>
            <Link className="permalink-url" target="_blank">
              {permalinkURL}
            </Link>
          </>

          {isEditingPermalink ? (
            <div>
              <input
                type="text"
                value={editedPermalink}
                className="edit-permalink__input"
                onClick={handleTitleChange}
                onChange={(e) => setEditedPermalink(e.target.value)} // Update edited permalink
              />
              <button className="dataBtn" onClick={saveEditedPermalink}>
                Save
              </button>
              <button
                className="dataBtn cancelData"
                onClick={cancelEditPermalink}
              >
                Cancel
              </button>
            </div>
          ) : (
            <Button
              title="Edit"
              className="permalink-edit"
              onClick={startEditPermalink}
            />
          )}
        </div>
      )}
    </div>
  );
}
