import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import Button from "../common/button";
import { getUploads } from "../../services/mediaService";
import { handleFileChangeWrapper } from "./media/fileUploadHandler";

import {
  getPostTags,
  savePostTag,
  getPostTag,
} from "../../services/postTagsServices";
import {
  getPostCategories,
  getPostCategory,
  savePostCategory,
} from "../../services/postCategoryServices";

export default function CreatePost() {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);
  const [networkStatus, setNetworkStatus] = useState("");

  const location = useLocation();
  const editingMode = location.state && location.state.post;
  const initialPost = editingMode
    ? location.state.post
    : {
        title: "",
        content: "",
        category: [],
        tags: [],
        postMainImage: null,
      };

  const [blogPost, setBlogPost] = useState(initialPost);
  const [errors, setErrors] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(
    initialPost.category || []
  );
  const [selectedTags, setSelectedTags] = useState(initialPost.tags || []);
  const [selectedThumbnail, setSelectedThumbnail] = useState(
    initialPost.postMainImage || null
  );
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [postTags, setPostTags] = useState([]);
  const [category, setCategory] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editorContent, setEditorContent] = useState(blogPost.content);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: mediaData } = await getUploads();
        setMediaData(mediaData);

        const { data: tags } = await getPostTags();
        setPostTags(tags);

        const { data: category } = await getPostCategories();
        setCategory(category);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const postToSubmit = {
      ...blogPost,
      category: selectedCategories,
      tags: selectedTags,
      postMainImage: selectedThumbnail,
    };

    try {
      if (editingMode) {
        await updatePost(postToSubmit._id, postToSubmit); // Pass the post ID and post data
      } else {
        await savePost(postToSubmit);
      }
      alert("Post submitted successfully!");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error occurred while submitting post:", error);
      alert("An error occurred while submitting the post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  const handleThumbnailSelection = (media) => {
    setSelectedThumbnail(media);
  };

  const handlePublishOpen = () => {
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
          <FormTitle
            value={blogPost.title} // Set the value
            handleTitleChange={(e) =>
              setBlogPost({ ...blogPost, title: e.target.value })
            }
          />
          {errors.title && (
            <div className="alert alert-danger">{errors.title}</div>
          )}

          <FormContent
            selectedMedia={selectedMedia}
            setSelectedMedia={setSelectedMedia}
            filteredMedia={mediaData}
            handleFileChange={handleFileChangeWrapper}
            handleEditorChange={(content) =>
              setBlogPost({ ...blogPost, content })
            }
            initialContent={blogPost.content}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            handleFileSelect={(fileId) =>
              setSelectedMedia((prevSelectedFiles) =>
                prevSelectedFiles.includes(fileId) ? [] : [fileId]
              )
            }
          />
        </div>

        <div>
          <div className="createPost-publishs">
            <div className="publish__button">
              <button onClick={handleSubmit}>
                {editingMode ? "Update" : "Publish"}
              </button>
            </div>
          </div>

          <div className="createPost-publish">
            <CategoriesHeader
              isCategoriesVisible={isCategoriesVisible}
              CategoryTitle="Categories"
              onClick={toggleCategories}
            />

            {isCategoriesVisible && (
              <PostCategories
                isCategoriesVisible={isCategoriesVisible}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                categories={category}
                setCategories={setCategory}
                getCategory={getPostCategory}
                savePostCategory={savePostCategory}
                getPostCategories={getPostCategories}
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
                isTagsVisible={isTagsVisible}
                onTagsChange={handleTagsChange}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                getPostTag={getPostTag}
                savePostTag={savePostTag}
                getPostTags={getPostTags}
                postTags={postTags}
                setPostTags={setPostTags}
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
                selectedThumbnail={selectedThumbnail}
                setSelectedThumbnail={handleThumbnailSelection}
                handleFileChange={handleFileChangeWrapper}
                setMediaData={setMediaData}
                setNotification={setNotification}
                setUploadProgress={setUploadProgress}
                uploadProgress={uploadProgress}
                setSelectedFiles={setSelectedFiles}
                handleFileSelect={(fileId) =>
                  setSelectedMedia((prevSelectedFiles) =>
                    prevSelectedFiles.includes(fileId) ? [] : [fileId]
                  )
                }
              />
            )}

            {errors.postMainImage && (
              <div className="alert alert-danger">{errors.postMainImage}</div>
            )}

            {notification && <div className="notification">{notification}</div>}
          </div>

          <div className="createPost-publishs">
            <div className="publish__button">
              <button onClick={handleSubmit}>
                {editingMode ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
