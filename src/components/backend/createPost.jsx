import React, { useState, useEffect } from "react";
import "./styles/createNew.css";
import "./styles/allPosts.css";
import MessageData from "./common/messageData";
import PublishHeader from "./common/publishHeader";
import PublishData from "./common/publishData";
import FormTitle from "./common/formData/formTitle";
import FormContent from "./common/formData/formContent";

export default function CreatePost({
  mediaData,
  handleFilterChange,
  selectedFilter,
  handleDateChange,
  selectedDate,
  uniqueDates,
  handleSearch,
  mediaSearch,
  filteredMedia,
}) {
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
  const [visibility, setVisibility] = useState("Public");
  const [stickToTop, setStickToTop] = useState(false);
  const [isEditingVisibility, setIsEditingVisibility] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // January is 1
  const [day, setDay] = useState(new Date().getDate());
  const [hour, setHour] = useState(new Date().getHours());
  const [minute, setMinute] = useState(new Date().getMinutes());
  const [isImmediate, setIsImmediate] = useState(true); // Track if publ
  const [immediateDisplay, setImmediateDisplay] = useState("immediately");
  const [isEditingDateTime, setIsEditingDateTime] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const visibilityOptions = ["Public", "Private"];

  const handleVisibilityEdit = () => {
    setIsEditingVisibility(true);
  };

  const handleVisibilitySave = () => {
    setIsEditingVisibility(false);
  };

  const handleVisibilityCancel = () => {
    setIsEditingVisibility(false);
  };

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

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatSelectedDate = () => {
    return `${months[month - 1]} ${day}, ${year} at ${hour}:${minute}`;
  };

  const handleEditDateTime = () => {
    setIsImmediate(false);
    setIsEditingDateTime(true); // User is now in edit mode
  };

  const handleDateAndTimeEdit = () => {
    setIsImmediate(false); // User chooses to set date and time
  };

  const handleSaveDateTime = () => {
    setIsImmediate(true);
    setIsEditingDateTime(true); // User has saved the date/time
    // Update the display immediately with the new date and time
    const formattedDate = formatSelectedDate();
    setImmediateDisplay(formattedDate);
  };

  // Function to handle canceling date and time selection
  const handleCancelDateTime = () => {
    if (isImmediate) {
      const formattedDate = formatSelectedDate();
      setImmediateDisplay(formattedDate);
    }
    setIsImmediate(true);
    setIsEditingDateTime(false); // User has canceled the edit
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
          <FormTitle
            updatePermalink={updatePermalink}
            cancelEditPermalink={cancelEditPermalink}
            editedPermalink={editedPermalink}
            isEditingPermalink={isEditingPermalink}
            permalinkURL={permalinkURL}
            saveEditedPermalink={saveEditedPermalink}
            setEditedPermalink={setEditedPermalink}
            showPermalink={showPermalink}
            startEditPermalink={startEditPermalink}
          />

          <FormContent
            mediaData={mediaData}
            selectedMedia={selectedMedia}
            setSelectedMedia={setSelectedMedia}
            handleFilterChange={handleFilterChange}
            selectedFilter={selectedFilter}
            handleDateChange={handleDateChange}
            selectedDate={selectedDate}
            uniqueDates={uniqueDates}
            handleSearch={handleSearch}
            mediaSearch={mediaSearch}
            filteredMedia={filteredMedia}
          />
        </div>

        <div>
          <div className="createPost-publish">
            <PublishHeader
              isContentVisible={isContentVisible}
              publishTitle="Public"
              toggleContent={toggleContent}
            />

            {isContentVisible && (
              <>
                <PublishData
                  day={day}
                  handleCancelDateTime={handleCancelDateTime}
                  handleEditDateTime={handleEditDateTime}
                  handlePostDelete={handlePostDelete}
                  handlePostPublish={handlePostPublish}
                  handleSaveDateTime={handleSaveDateTime}
                  handleSaveDraft={handleSaveDraft}
                  handleVisibilityCancel={handleVisibilityCancel}
                  handleVisibilityEdit={handleVisibilityEdit}
                  handleVisibilitySave={handleVisibilitySave}
                  immediateDisplay={immediateDisplay}
                  hour={hour}
                  isContentVisible={isContentVisible}
                  isEditingVisibility={isEditingVisibility}
                  isImmediate={isImmediate}
                  minute={minute}
                  month={month}
                  networkStatus={networkStatus}
                  postPublished={postPublished}
                  publishing={publishing}
                  savingDraft={savingDraft}
                  setDay={setDay}
                  setHour={setHour}
                  setMinute={setMinute}
                  setMonth={setMonth}
                  setVisibility={setVisibility}
                  setYear={setYear}
                  setStickToTop={setStickToTop}
                  stickToTop={stickToTop}
                  visibility={visibility}
                  visibilityOptions={visibilityOptions}
                  year={year}
                  months={months}
                />
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
