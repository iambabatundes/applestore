import React, { useState } from "react";
import "../styles/createNew.css";
import PublishActions from "./PublishActions";
import PublishImmediately from "./publishImmediately";

export default function PublishData({
  isContentVisible,
  networkStatus,
  handlePostPublish,
  handlePostDelete,
  publishing,
  postPublished,
  editingMode,
  handleUpdatePublish,
  updating,
}) {
  const [isImmediate, setIsImmediate] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [immediateDisplay, setImmediateDisplay] = useState("Immediately");

  const handleEditDateTime = () => {
    setIsImmediate(false);
  };

  const handleSaveDateTime = () => {
    setIsImmediate(true);
    setImmediateDisplay(selectedDate.toLocaleString()); // Format as needed
  };

  const handleCancelDateTime = () => {
    setIsImmediate(true);
  };

  return (
    <>
      {isContentVisible && (
        <>
          <PublishImmediately
            isImmediate={isImmediate}
            immediateDisplay={immediateDisplay}
            handleEditDateTime={handleEditDateTime}
            handleSaveDateTime={handleSaveDateTime}
            handleCancelDateTime={handleCancelDateTime}
            setDate={setSelectedDate}
            selectedDate={selectedDate}
          />
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
