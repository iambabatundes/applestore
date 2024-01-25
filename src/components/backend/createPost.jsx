import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./styles/createNew.css";
import "./styles/allPosts.css";
import MessageData from "./common/messageData";
import PublishData from "./common/publishData";
import FormTitle from "./common/formData/formTitle";
import FormContent from "./common/formData/formContent";
import Header from "./common/header";
import PublishHeader from "./common/publishHeader";
import CategoriesHeader from "./common/CategoriesHeader";
import TagsHeader from "./common/TagsHeader";
import FeaturedImageHeader from "./common/featuredImageHeader";
import PostCategories from "./common/postCategories";
import PostTags from "./common/postTags";
import FeaturedMedia from "./common/FeaturedMedia";

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
  addNewPost,
  blogPosts,
  setBlogPosts,
}) {
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState("All Categories");
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
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
    image: "",
    categories: "",
    postedBy: "",
    datePosted: new Date().toISOString(),
  });
  const [editingMode, setEditingMode] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState();

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleTitleChange = (e) => {
    setNewPost((prevPost) => ({ ...prevPost, title: e.target.value }));

    // Function to update permalink based on title input
    const updatePermalink = (title) => {
      // Remove leading and trailing spaces and convert to lowercase
      const cleanedTitle = title.trim().toLowerCase();
      // Replace spaces with hyphens
      const permalink = cleanedTitle.replace(/\s+/g, "-");
      setPermalink(permalink);
    };

    // Call updatePermalink with the new title value
    updatePermalink(e.target.value);
  };

  const handleContentChange = (e) => {
    setNewPost((prevPost) => ({ ...prevPost, content: e.target.value }));
  };

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

  const handleThumbnailSelection = (media) => {
    setSelectedThumbnail(media);
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

  useEffect(() => {
    // If in edit mode, initialize newPost state with post details
    if (editingMode && postToEdit) {
      setNewPost({
        title: postToEdit.title,
        content: postToEdit.content,
        tags: postToEdit.tags,
        categories: postToEdit.categories,
        datePosted: postToEdit.datePosted,
        image: postToEdit.image,
        postedBy: postToEdit.postedby,
        // ... other fields
      });
    }
  }, [editingMode, postToEdit]);

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

  const handleUpdatePublish = () => {
    // Perform validation if needed

    if (!networkStatus) {
      setMessage(
        "Connection lost. Saving has been disabled until you are reconnected."
      );
      return;
    }

    // Format date and time
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

    // Update the datePosted property in the newPost state
    setNewPost((prevPost) => ({ ...prevPost, datePosted: formattedDate }));

    // Check if postToEdit is not null before accessing its properties
    if (postToEdit && postToEdit.id) {
      // Update the existing post in the list
      const updatedPosts = blogPosts.map((post) => {
        if (post.id === postToEdit.id) {
          return { ...post, ...newPost };
        }
        return post;
      });

      setBlogPosts(updatedPosts);
    }

    // Perform other update actions if needed

    // Save user action to local storage
    saveUserAction("Published");
    setTimeout(() => {
      setMessage("Post updated"); // Update message
      setUpdating(false);
      setSavingDraft(false);
    }, 2000);
  };

  const handlePostPublish = () => {
    if (!networkStatus) {
      setMessage(
        "Connection lost. Saving has been disabled until you are reconnected."
      );
      return;
    }

    // Format date and time
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

    // Update the datePosted property in the newPost state

    // Add the details of the new post
    const newPosted = {
      ...newPost,
      id: uuidv4(),
      title: newPost.title,
      categories: [...selectedCategories],
      tags: [...selectedTags],
      postedBy: newPost.postedBy,
      image: [selectedThumbnail],
    };

    setBlogPosts((prevPosts) => [newPosted, ...prevPosts]);

    const generateUniqueId = () => {
      return uuidv4();
    };

    const addNewPost = (newPost) => {
      // Generate a unique identifier for the new post
      const postId = generateUniqueId(); // Implement a function to generate a unique ID

      // Add the identifier to the new post
      const postWithId = { ...newPost, id: postId };

      // Check if the new post already exists in the list
      const existingPostIndex = blogPosts.findIndex(
        (post) => post.id === postId
      );

      if (existingPostIndex !== -1) {
        // If it exists, update the existing post
        const updatedPosts = [...blogPosts];
        updatedPosts[existingPostIndex] = postWithId;
        setBlogPosts(updatedPosts);
      } else {
        // If it doesn't exist, add the new post
        setBlogPosts((prevPosts) => [postWithId, ...prevPosts]);
      }
    };

    // Call the addNewPost function to add the new post to the list
    // addNewPost(newPosted);

    // Reset the form after adding the post

    setNewPost({
      title: "",
      content: "",
      tags: [],
      image: selectedThumbnail,
      categories: [],
      postedBy: "",
      datePosted: formattedDate,
    });

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

    setEditingMode(true);
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

  const toggleCategories = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  const toggleTags = () => {
    setIsTagsVisible(!isTagsVisible);
  };

  const toggleFeaturedImage = () => {
    setIsFeaturedImageVisible(!isFeaturedImageVisible);
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
      <h1 className="title">
        <Header
          headerTitle={editingMode ? "Edit Post" : "Add New Post"}
          buttonTitle={editingMode ? "Add New" : ""}
          to="/admin/create"
        />
      </h1>

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
            // updatePermalink={updatePermalink}
            cancelEditPermalink={cancelEditPermalink}
            editedPermalink={editedPermalink}
            isEditingPermalink={isEditingPermalink}
            permalinkURL={permalinkURL}
            saveEditedPermalink={saveEditedPermalink}
            setEditedPermalink={setEditedPermalink}
            showPermalink={showPermalink}
            startEditPermalink={startEditPermalink}
            handleTitleChange={handleTitleChange}
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
              onClick={toggleContent}
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
                  updating={updating}
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
                  editingMode={editingMode}
                  handleUpdatePublish={handleUpdatePublish}
                />
              </>
            )}
          </div>

          <div className="createPost-publish">
            <CategoriesHeader
              isCategoriesVisible={isCategoriesVisible}
              CategoryTitle="Categories"
              onClick={toggleCategories}
            />

            {isCategoriesVisible && (
              <PostCategories
                handleTabChange={handleTabChange}
                selectedTab={selectedTab}
                isCategoriesVisible={isCategoriesVisible}
                blogPosts={blogPosts}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            )}
          </div>

          <div className="createPost-publish">
            <TagsHeader
              isTagsVisible={isTagsVisible}
              TagsTitle="Tags"
              onClick={toggleTags}
            />

            {isTagsVisible && (
              <PostTags
                blogPosts={blogPosts}
                isTagsVisible={isTagsVisible}
                onTagsChange={handleTagsChange}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            )}
          </div>

          <div className="createPost-publish">
            <FeaturedImageHeader
              isFeaturedImageVisible={isFeaturedImageVisible}
              FeaturedImageTitle="Featured Image"
              onClick={toggleFeaturedImage}
            />

            {isFeaturedImageVisible && (
              <FeaturedMedia
                isFeaturedImageVisible={isFeaturedImageVisible}
                filteredMedia={filteredMedia}
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
                mediaData={mediaData}
                handleSearch={handleSearch}
                handleFilterChange={handleFilterChange}
                mediaSearch={mediaSearch}
                selectedFilter={selectedFilter}
                selectedDate={selectedDate}
                uniqueDates={uniqueDates}
                selectedThumbnail={selectedThumbnail}
                setSelectedThumbnail={handleThumbnailSelection}
              />
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
