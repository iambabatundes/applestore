import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./styles/createNew.css";
// import "./styles/allPosts.css";
import { getPost, savePost, updatePost } from "../../services/postService";
import FormContent from "./common/formData/formContent";
import CategoriesHeader from "./common/CategoriesHeader";
import TagsHeader from "./common/TagsHeader";
import FeaturedImageHeader from "./common/featuredImageHeader";
import PostTags from "./common/postTags";

import {
  getPostTags,
  savePostTag,
  getPostTag,
} from "../../services/postTagsServices";
import {
  getPostCategories,
  savePostCategory,
} from "../../services/postCategoryServices";
import DataCategory from "./products/dataCategory";
import PostMainImage from "./common/postMainImage";
import { getCurrentUser } from "../../services/authService";

export default function CreatePost() {
  const [blogPost, setBlogPost] = useState({
    title: "",
    content: "",
    category: [],
    tags: [],
    postMainImage: null,
  });

  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);
  const [networkStatus, setNetworkStatus] = useState("");

  const [errors, setErrors] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [postMainImage, setPostMainImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [postTags, setPostTags] = useState([]);
  const [category, setCategory] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [editingMode, setEditingMode] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const fetchPostTag = useCallback(async () => {
    try {
      const { data: tags } = await getPostTags();
      setPostTags(tags);
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  }, []);

  const fetchPostCategory = useCallback(async () => {
    try {
      const { data: categories } = await getPostCategories([]);
      setCategory(categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

  useEffect(() => {
    fetchPostTag();
    fetchPostCategory();

    async function getPostDetails(postId) {
      try {
        const { data: post } = await getPost(postId);

        setBlogPost({
          ...post,
          postMainImage: post.postMainImage,
        });
        setSelectedTags(post.tags.map((tag) => tag.name));
        setSelectedCategories(post.category || []);
        setPostMainImage(post.postMainImage);
        setEditorContent(post.content);
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          navigate("/admin/not-found");
        }
      }
    }

    const postId = params.id;
    if (postId) {
      setEditingMode(true);
      getPostDetails(postId);
    } else {
      setEditingMode(false);
      // Reset the form state when creating a new post
      setBlogPost({
        title: "",
        content: "",
        category: [],
        tags: [],
        postMainImage: null,
      });
      setSelectedTags([]);
      setSelectedCategories([]);
      setPostMainImage(null);
      setEditorContent("");
    }
  }, [navigate, params.id, fetchPostCategory, fetchPostTag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const categoryNames = selectedCategories.map((category) => category.name);

    const user = getCurrentUser(); // Get the current user
    const userId = user ? user._id : null;

    // const userId = user
    //   ? {
    //       _id: user._id,
    //       username: user.username,
    //       email: user.email,
    //     }
    //   : null;

    const postToSubmit = {
      ...blogPost,
      category: categoryNames,
      tags: selectedTags,
      postMainImage: postMainImage,
      userId: userId,
    };

    console.error("This is user", userId);

    try {
      if (editingMode) {
        await updatePost(postToSubmit._id, postToSubmit);
        toast.success("Post updated successfully");
      } else {
        await savePost(postToSubmit);
        toast.success("Post added successfully");
      }

      navigate("/admin/posts");
    } catch (error) {
      console.error("Error occurred while submitting post:", error);
      toast.error("An error occurred while saving the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContentChange = useCallback((content) => {
    setEditorContent(content);
    setBlogPost((prevState) => ({
      ...prevState,
      content: content,
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setPostMainImage({ file, preview });
      setBlogPost((prevState) => ({
        ...prevState,
        postMainImage: { file, preview },
      }));
    } else {
      setPostMainImage(null);
      setBlogPost((prevState) => ({
        ...prevState,
        postMainImage: null,
      }));
    }
  }, []);

  return (
    <section className="">
      <header className="createPost__heading">
        <h1 className="createPost__title">
          {editingMode ? "Edit Post" : "Add New Post"}
        </h1>
        <Link to="/admin/create">
          <button className="createPost__btn">
            {editingMode ? "Add New" : ""}
          </button>
        </Link>
      </header>

      <section className="padding createPost-section">
        <section className="padding createNew-grid">
          <div className="blog__post">
            <FormContent
              editorContent={editorContent}
              handleContentChange={handleContentChange}
              data={blogPost}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          </div>

          <div className="createPost-sideBar">
            <div className="createPost-header">
              <span className="createPost__publish-heading">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="createPost-btn"
                >
                  {editingMode ? "Update" : "Publish"}
                </button>
                {isSubmitting && <div className="createloading-spinner"></div>}
              </span>
            </div>

            <div className="createPost-header">
              <CategoriesHeader
                isCategoriesVisible={true}
                CategoryTitle="Categories"
                onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
              />

              {isCategoriesVisible && (
                <DataCategory
                  isCategoriesVisible={isCategoriesVisible}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  categories={category}
                  setCategories={setCategory}
                  // savePostCategory={savePostCategory}
                  // getPostCategories={getPostCategories}
                  getCategories={getPostCategories}
                  saveCategory={savePostCategory}
                />
              )}
            </div>

            <div className="createPost-header">
              <TagsHeader
                isTagsVisible={true}
                TagsTitle="Tags"
                onClick={() => setIsTagsVisible(!isTagsVisible)}
              />

              {isTagsVisible && (
                <PostTags
                  isTagsVisible={isTagsVisible}
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

            <div className="createPost-header">
              <FeaturedImageHeader
                isFeaturedImageVisible={true}
                FeaturedImageTitle="Featured Image"
                onClick={() =>
                  setIsFeaturedImageVisible(!isFeaturedImageVisible)
                }
              />

              {isFeaturedImageVisible && (
                <PostMainImage
                  isFeaturedImageVisible={isFeaturedImageVisible}
                  handleImageChange={handleImageChange}
                  postMainImage={postMainImage}
                  setPostMainImage={setPostMainImage}
                />
              )}

              {errors.postMainImage && (
                <div className="alert alert-danger">{errors.postMainImage}</div>
              )}
            </div>

            <div className="createPost-header">
              <span className="createPost__publish-heading">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="createPost-btn"
                >
                  {editingMode ? "Update" : "Publish"}
                </button>
                {isSubmitting && <div className="createloading-spinner"></div>}
              </span>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
