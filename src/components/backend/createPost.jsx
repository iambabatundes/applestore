import React, { useState, useEffect } from "react";

import "./styles/createNew.css";
import "./styles/allPosts.css";
import { savePost, updatePost } from "../../services/postService";
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
import PublishData from "./common/publishData";
import Button from "../common/button";
import { getUploads, deleteUpload } from "../../services/mediaService";
import { handleFileChange } from "./media/fileUploadHandler";
import { getTags, getTag, saveTag } from "../../services/tagService";
import { getCategories, getCategory } from "../../services/categoryService";

export default function CreatePost({
  handleFilterChange,
  handleDateChange,
  handleSearch,
  mediaSearch,
}) {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [isTagsVisible, setIsTagsVisible] = useState(false);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState("All Categories");
  const [networkStatus, setNetworkStatus] = useState("");

  const [blogPost, setBlogPost] = useState({
    title: "",
    content: "",
    categories: "",
    tags: "",
    postedBy: "",
    datePosted: "",
    postMainImage: "",
  });
  const [editingMode, setEditingMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    async function fetchMediaData() {
      try {
        const { data: mediaData } = await getUploads();
        setMediaData(mediaData);
      } catch (error) {
        console.error("Error fetching media data:", error);
      }
    }

    fetchMediaData();

    async function fetchTag() {
      const { data: tags } = await getTags();
      setTags(tags);
    }

    fetchTag();

    async function getCategory() {
      const { data: categories } = await getCategories();
      setCategories(categories);
    }

    getCategory();
  }, [mediaData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingMode) {
        await updatePost(blogPost);
      } else {
        await savePost(blogPost);
      }
      alert("Post submitted successfully!");
    } catch (error) {
      console.error("Error occurred while submitting post:", error);
      alert(
        "An error occurred while submitting the post. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleUploadDelete(uploadId) {
    const originalMedia = [...mediaData];
    const originalMedias = originalMedia.filter((u) => u._id !== uploadId._id);
    setMediaData(originalMedias);

    try {
      await deleteUpload(uploadId._id);
    } catch (error) {}
  }

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleTitleChange = (e) => {
    setBlogPost((prevPost) => ({ ...prevPost, title: e.target.value }));
  };

  const handleThumbnailSelection = (media) => {
    setSelectedThumbnail(media);
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

  return (
    <section className="padding">
      <h1 className="title">
        <Header
          headerTitle={editingMode ? "Edit Post" : "Add New Post"}
          buttonTitle={editingMode ? "Add New" : ""}
          to="/admin/create"
        />
      </h1>

      <section className="createNew-grid">
        <div className="blog__post">
          <FormTitle handleTitleChange={handleTitleChange} />

          <FormContent
            selectedMedia={selectedMedia}
            setSelectedMedia={setSelectedMedia}
            handleFilterChange={handleFilterChange}
            handleDateChange={handleDateChange}
            handleSearch={handleSearch}
            mediaSearch={mediaSearch}
            filteredMedia={mediaData}
          />
        </div>

        <div>
          <div className="createPost-publish">
            {/* <Button title="Publish" /> */}
            <button onClick={handleSubmit}>Publish</button>
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
                blogPosts={blogPost}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                categories={categories}
                setCategories={setCategories}
                getCategory={getCategory}
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
                blogPosts={blogPost}
                isTagsVisible={isTagsVisible}
                onTagsChange={handleTagsChange}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                tags={tags}
                setTags={setTags}
                getTag={getTag}
                saveTag={saveTag}
                getTags={getTags}
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
                filteredMedia={mediaData}
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
                handleSearch={handleSearch}
                handleFilterChange={handleFilterChange}
                mediaSearch={mediaSearch}
                selectedThumbnail={selectedThumbnail}
                setSelectedThumbnail={handleThumbnailSelection}
                handleFileChange={handleFileChange}
                setMediaData={setMediaData}
                setNotification={setNotification}
                setUploadProgress={setUploadProgress}
                uploadProgress={uploadProgress}
                setSelectedFiles={setSelectedFiles}
                handleUploadDelete={handleUploadDelete}
              />
            )}

            {notification && <div className="notification">{notification}</div>}
          </div>
        </div>
      </section>
    </section>
  );
}
