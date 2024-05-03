import React, { useState, useEffect } from "react";
import Header from "./common/header";
import MessageData from "./common/messageData";
import FormTitle from "./common/formData/formTitle";
import Button from "./button";
import TagsHeader from "./common/TagsHeader";
import PostTags from "./common/postTags";
import { getProducts } from "../productData";
import CategoryHeader from "./common/CategoriesHeader";
import PostCategories from "./common/postCategories";
import FeaturedImageHeader from "./common/featuredImageHeader";
import FeaturedMedia from "./common/FeaturedMedia";
import ProductForm from "./common/formData/productContent";

export default function AddProduct({
  editingMode,
  handleSearch,
  mediaData,
  mediaSearch,
  filteredMedia,
  selectedFilter,
}) {
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [networkMessage, setNetworkMessage] = useState("");
  const [networkStatus, setNetworkStatus] = useState(true);
  const [localStorageRestore, setLocalStorageRestore] = useState(null);
  const [localStorageNotice, setLocalStorageNotice] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);

  useEffect(() => {
    setProduct(getProducts);
  }, [product]);

  const handleCloseMessage = () => {
    setMessage(""); // Clear the message
  };
  const handleCloseNetworkMessage = () => {
    setNetworkMessage(""); // Clear the message
  };

  const restoreBackup = () => {
    // Restore the backup from sessionStorage
    const sessionBackup = sessionStorage.getItem("backup");
    if (sessionBackup) {
      // Clear the sessionStorage backup after restoration
      sessionStorage.removeItem("backup");
      setLocalStorageRestore(null); // Clear the state
    }
  };

  const toggleCategories = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  const toggleTags = () => {
    setIsTagsVisible(!isTagsVisible);
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  return (
    <section className="padding">
      <Header
        headerTitle={editingMode ? "Edit Product" : "Add New Product"}
        buttonTitle={editingMode ? "Add New" : ""}
        to="/admin/add-product"
      />

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

      <section className="createNew-grid">
        <section className="blog__post">
          <ProductForm />
        </section>

        <div>
          <div className="createPost-publish">
            <Button title="Publish" />
          </div>

          <div className="createPost-publish">
            <CategoryHeader
              CategoryTitle="Categories"
              isCategoriesVisible={isCategoriesVisible}
              onClick={toggleCategories}
            />

            <PostCategories
              isCategoriesVisible={isCategoriesVisible}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          <div className="createPost-publish">
            <TagsHeader
              TagsTitle="Tags"
              isTagsVisible={isTagsVisible}
              onClick={toggleTags}
            />

            <PostTags
              isTagsVisible={isTagsVisible}
              onTagsChange={handleTagsChange}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>

          <div className="createPost-publish">
            <FeaturedImageHeader
              FeaturedImageTitle="Product Image"
              isFeaturedImageVisible={isFeaturedImageVisible}
            />

            <FeaturedMedia />
          </div>
        </div>
      </section>
    </section>
  );
}
