import React from "react";
import Input from "./input";
import Button from "../button";

export default function PublishVisibility({
  visibilityOptions,
  isEditingVisibility,
  visibility,
  setVisibility,
  handleVisibilitySave,
  handleVisibilityCancel,
  handleVisibilityEdit,
  stickToTop,
  setStickToTop,
}) {
  return (
    <div className="post-actions postbox post-visibility">
      <i className="fa fa-eye" aria-hidden="true"></i>
      Visibility:
      <span className="post-display post-visibility-public">{visibility}</span>
      {isEditingVisibility ? (
        <>
          <div className="visibility-options">
            {visibilityOptions.map((option) => (
              <div key={option}>
                <Input
                  checked={visibility === option}
                  className="radioData"
                  onChange={() => setVisibility(option)}
                  value={option}
                  id={option}
                  name="visibility"
                  type="radio"
                />

                <label htmlFor={option}>{option}</label>
              </div>
            ))}

            <Button
              className="dataBtn"
              onClick={handleVisibilitySave}
              title="Save"
            />
            <Button
              className="dataBtn cancelData"
              onClick={handleVisibilityCancel}
              title="Cancel"
            />
          </div>
        </>
      ) : (
        <span
          className="post-edit edit-visibility"
          onClick={handleVisibilityEdit}
        >
          Edit
        </span>
      )}
    </div>
  );
}
