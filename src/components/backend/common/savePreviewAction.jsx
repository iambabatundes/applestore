import React from "react";
import "../styles/createNew.css";
import Button from "../button";
import Spinner from "./spinner";

export default function SavePreviewAction({
  handleSaveDraft,
  networkStatus,
  savingDraft,
  handlePostPublish,
}) {
  return (
    <span className="createPost-publish__button">
      <span>
        <Button
          onClick={handleSaveDraft}
          disabled={!networkStatus}
          title="Save Draft"
          type="submit"
          className="btn__action"
        />

        {savingDraft && <Spinner className="spinner" />}
      </span>
      <Button
        onClick={handlePostPublish}
        disabled={!networkStatus}
        title="Preview"
        type="submit"
        className="btn__action"
      />
    </span>
  );
}
