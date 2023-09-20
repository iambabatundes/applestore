import React, { useState, useEffect } from "react";
import "./styles/createNew.css";
import "./styles/allPosts.css";
import Button from "./button";
import Spinner from "./common/spinner";
import MessageData from "./common/messageData";
import { Link } from "react-router-dom";

export default function CreatePost() {
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [networkMessage, setNetworkMessage] = useState("");
  const [localStorageNotice, setLocalStorageNotice] = useState("");
  const [networkStatus, setNetworkStatus] = useState(true);
  const [localStorageRestore, setLocalStorageRestore] = useState(null); // State for backup restoration
  const [postPublished, setPostPublished] = useState(false); //
  const [permalink, setPermalink] = useState(""); // State for permalink
  const [showPermalink, setShowPermalink] = useState(false); // State to control permalink visibility
  const [isEditingPermalink, setIsEditingPermalink] = useState(false); // Track edit mode for permalink
  const [editedPermalink, setEditedPermalink] = useState(permalink); //

  useEffect(() => {
    // Check the network status when the component mounts
    setNetworkStatus(window.navigator.onLine);

    // Add event listeners to monitor network status changes
    window.addEventListener("online", () => {
      setNetworkStatus(true);
      setNetworkMessage("Connection is back");
    });
    window.addEventListener("offline", () => {
      setNetworkStatus(false);
      setNetworkMessage("Connection lost");
    });

    // Check for the presence of sessionStorage and set the localStorageNotice accordingly
    if (!networkStatus && sessionStorage.getItem("userActions")) {
      setLocalStorageNotice(
        "This post is being backed up in your browser, just in case."
      );

      // Check if there's a backup in sessionStorage
      const sessionBackup = sessionStorage.getItem("backup");
      if (sessionBackup) {
        setLocalStorageRestore(sessionBackup);
      }
    }
  }, [networkStatus]);

  const handleSaveDraft = () => {
    if (!networkStatus) {
      setMessage("No network. Try to connect to a network.");
      return;
    }

    // Simulate saving as a draft with a 2-second delay
    setSavingDraft(true);
    // Save user action to local storage
    saveUserAction("Saved as draft");
    setTimeout(() => {
      setMessage("Post saved as draft"); // Update message
      setSavingDraft(false);
      setShowPermalink(true); // Show permalink after save
    }, 2000);
  };

  const handlePostPublish = () => {
    if (!networkStatus) {
      setMessage(
        "Connection lost. Saving has been disabled until you are reconnected."
      );
      return;
    }

    // Simulate publishing with a 2-second delay
    setPublishing(true);
    // Save user action to local storage
    saveUserAction("Published");
    setTimeout(() => {
      setMessage("Post Published"); // Update message
      setPublishing(false);
      setSavingDraft(false);
      setShowPermalink(true); // Show permalink after publish
    }, 2000);
  };

  const saveUserAction = (action) => {
    // Save the user's action in local storage
    const userActions = JSON.parse(localStorage.getItem("userActions")) || [];
    userActions.push({ action, timestamp: new Date().toString() });
    localStorage.setItem("userActions", JSON.stringify(userActions));
  };

  const restoreBackup = () => {
    // Restore the backup from sessionStorage
    const sessionBackup = sessionStorage.getItem("backup");
    if (sessionBackup) {
      // Update your editor content with the sessionBackup content
      // Example: setContent(sessionBackup);

      // Clear the sessionStorage backup after restoration
      sessionStorage.removeItem("backup");
      setLocalStorageRestore(null); // Clear the state
    }
  };

  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };

  const handlePostDelete = () => {
    // do something here
  };

  const handleCloseMessage = () => {
    setMessage(""); // Clear the message
  };

  const handleCloseNetworkMessage = () => {
    setNetworkMessage(""); // Clear the message
  };

  // const handlePermalinksEdit = () => {
  //   setNetworkMessage(""); // Clear the message
  // };

  // Function to start editing the permalink
  const startEditPermalink = () => {
    setIsEditingPermalink(true);
    setEditedPermalink(permalink); // Initialize edited permalink with the current permalink
  };

  // Function to save the edited permalink
  const saveEditedPermalink = () => {
    // Clean the edited permalink by removing leading/trailing spaces and replacing spaces with hyphens
    const cleanedEditedPermalink = editedPermalink.trim().replace(/\s+/g, "-");

    setIsEditingPermalink(false);
    setEditedPermalink(cleanedEditedPermalink); // Update the permalink with the cleaned edited value
    setPermalink(cleanedEditedPermalink); // Also update the displayed permalink
  };

  // Function to cancel editing the permalink
  const cancelEditPermalink = () => {
    setIsEditingPermalink(false);
    setEditedPermalink(permalink); // Reset the edited permalink to the current permalink
  };

  // Construct the permalink based on the user's input
  const permalinkBase = window.location.origin + "/blog/";
  const permalinkURL = permalinkBase + permalink;

  // Function to update permalink based on title input
  const updatePermalink = (title) => {
    // Remove leading and trailing spaces and convert to lowercase
    const cleanedTitle = title.trim().toLowerCase();
    // Replace spaces with hyphens
    const permalink = cleanedTitle.replace(/\s+/g, "-");
    setPermalink(permalink);
  };

  return (
    <section className="padding">
      <h1 className="title">Add New Post</h1>

      <MessageData
        handleCloseMessage={handleCloseMessage}
        handleCloseNetworkMessage={handleCloseNetworkMessage}
        message={message}
        networkMessage={networkMessage}
        networkStatus={networkStatus}
        localStorageRestore={localStorageRestore}
        restoreBackup={restoreBackup}
        localStorageNotice={localStorageNotice}
      />

      <section className="createPost-grid">
        <div className="blog__post">
          <input
            type="text"
            name="Add title"
            id="AddTile"
            placeholder="Add title"
            className="createPost__title"
            spellCheck
            autoComplete="off"
            size="30"
            onChange={(e) => updatePermalink(e.target.value)}
            // onBlur={updatePermalink}
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
                    onChange={(e) => setEditedPermalink(e.target.value)} // Update edited permalink
                  />
                  <button
                    className="EditedPermalink"
                    onClick={saveEditedPermalink}
                  >
                    Save
                  </button>
                  <button
                    className="EditedPermalink canel-edit"
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

        <div>
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

          <div>
            <span className="">
              <h3>Publish</h3>
              <i className="fa fa-caret-down" aria-hidden="true"></i>
            </span>
          </div>
        </div>
      </section>
    </section>
  );
}
