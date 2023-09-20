import React from "react";

export default function PublishData({
  toggleContent,
  isContentVisible,
  handleSaveDraft,
  networkStatus,
  savingDraft,
  handlePostPublish,
  handlePostDelete,
  publishing,
}) {
  return (
    <div className="createPost-publish">
      <div className="createPost-publish-main" onClick={toggleContent}>
        <h3 className="createPost-publish__title">Publish</h3>
        <i
          className={`fa fa-caret-${isContentVisible ? "down" : "up"}`}
          aria-hidden="true"
        ></i>
      </div>

      {isContentVisible && (
        <>
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
          <div className="publishing-actions">
            <div className="post-actions postbox post-status">
              <i className="fa fa-exclamation" aria-hidden="true"></i>
              Status:
              <span className="post-display" id="post-status-display">
                Draft
              </span>
            </div>

            <div className="post-actions postbox post-visibility">
              <i className="fa fa-eye" aria-hidden="true"></i>
              Visibility:
              <span className="post-display post-visibility-public">
                Public
              </span>
              <span className="post-edit edit-visibility">Edit</span>
            </div>

            <div className="post-actions postbox post-immediately">
              <i className="fa fa-calendar" aria-hidden="true"></i>
              Publish:
              <span className="post-display post-immediately-now">
                immediately
              </span>
              <span className="post-edit edit-immediately">Edit</span>
            </div>
          </div>

          <div className="publish__actions">
            {postPublished && ( // Render delete button only when post is published
              <div className="delete-button-container">
                <Button
                  type="submit"
                  onClick={handlePostDelete}
                  title="Delete"
                  className="delete-button"
                />
              </div>
            )}

            <span>
              {publishing && <span className="spinner"></span>}

              <Button
                type="submit"
                onClick={handlePostPublish}
                title="Publish"
                className="publish__actions__btn"
                disabled={!networkStatus}
              />
            </span>
          </div>
        </>
      )}
    </div>
  );
}
