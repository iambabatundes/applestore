import React, { useState } from "react";
import "./styles/tags.css";
import TagForm from "./tagForm";
import TagModal from "./tagModal";
import TagsList from "./tagsList";
import useTags from "./hook/useTags";
import TagSearchBox from "./tagSearchBox";

export default function AddTags({ className }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedTagForPreview, setSelectedTagForPreview] = useState(null);

  const { tags, loading, errors, addTag, editTag, deleteTags } = useTags({
    setSelectedTag,
  });

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
  };

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
  };

  function handlePreview(tag) {
    // setSelectedTag(tag);
    setSelectedTagForPreview(tag);
    setIsModalOpen(true);
  }

  function handleSearch(query) {
    setSearchQuery(query);
  }

  let filteredTags = tags;
  if (searchQuery) {
    filteredTags = tags.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <section className="padding">
      <h1 className="addTag__title">Product Tags</h1>
      <section className={`${className} addTag-header`}>
        <div className="addTag__form-main">
          <TagForm
            onAddTag={addTag}
            selectedTag={selectedTag}
            onEditTag={editTag}
          />
        </div>

        <section className="addTags__tagList">
          <span className="tags__filtered-container">
            <TagSearchBox onChange={handleSearch} value={searchQuery} />
            <span className="tags__filteredTags-length">
              Showing {filteredTags.length} item
              {filteredTags.length !== 1 ? "s" : ""}
            </span>
          </span>
          <div className="tagsList__main">
            <TagsList
              tags={filteredTags}
              onEdit={handleSelectTag}
              onPreview={handlePreview}
              loading={loading}
              error={errors}
              onDelete={deleteTags}
            />
          </div>
        </section>

        {isModalOpen && selectedTagForPreview && (
          <TagModal
            tag={selectedTagForPreview}
            products={selectedTagForPreview.products}
            onClose={closeModal}
          />
        )}
      </section>
    </section>
  );
}
