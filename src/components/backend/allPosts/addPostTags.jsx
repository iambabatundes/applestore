import React, { useState } from "react";
import "./styles/addtag.css";
import PostTagModal from "./common/postTagModal";
// import TagForm from "./common/tagForm";
import TagForm from "../tags/tagForm";
// import TagsList from "./common/tagsList";
import TagsList from "../tags/tagsList";
import useTags from "./hook/useTags";
import TagSearchBox from "../tags/tagSearchBox";

export default function AddPostTags({ className }) {
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
      <h1 className="addTag__title">Post Tags</h1>
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
          <PostTagModal
            tag={selectedTagForPreview}
            posts={selectedTagForPreview.posts}
            onClose={closeModal}
          />
        )}
      </section>
    </section>
  );
}
