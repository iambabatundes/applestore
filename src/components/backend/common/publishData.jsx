import React from "react";
import "../styles/createNew.css";
import PublishActions from "./PublishActions";
import PublishVisibility from "./publishVisibility";
import PublishImmediately from "./publishImmediately";
import PublishStatus from "./publishStatus";
import SavePreviewAction from "./savePreviewAction";

export default function PublishData({
  isContentVisible,
  handleSaveDraft,
  networkStatus,
  savingDraft,
  handlePostPublish,
  handlePostDelete,
  publishing,
  postPublished,
  editingMode,
  handleUpdatePublish,
  updating,
}) {
  return (
    <>
      {isContentVisible && (
        <>
          <SavePreviewAction
            handlePostPublish={handlePostPublish}
            handleSaveDraft={handleSaveDraft}
            networkStatus={networkStatus}
            savingDraft={savingDraft}
          />
          <div className="publishing-actions">
            <PublishStatus />
          </div>
          <PublishActions
            handlePostDelete={handlePostDelete}
            networkStatus={networkStatus}
            handlePostPublish={handlePostPublish}
            postPublished={postPublished}
            publishing={publishing}
            editingMode={editingMode}
            handleUpdatePublish={handleUpdatePublish}
            updating={updating}
          />
        </>
      )}
    </>
  );
}
