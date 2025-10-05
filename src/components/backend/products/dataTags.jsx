import React, { useState, useEffect } from "react";
import "../../backend/common/styles/dataTags.css";

export default function DataTags({
  isTagsVisible,
  selectedTags,
  setSelectedTags,
  dataTags = [], // Default to empty array
  setDataTags,
  getDataTags,
  saveDataTag,
  errors,
  setErrors,
}) {
  const [newTag, setNewTag] = useState("");
  const [isAddingNewTag, setIsAddingNewTag] = useState(false);
  // const [filtseredTags, setFilteredTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState(dataTags || []);

  useEffect(() => {
    setFilteredTags(dataTags || []);
  }, [dataTags]);

  const handleAddNewTag = async () => {
    if (newTag.trim() !== "") {
      try {
        const existingTag = await getDataTags(newTag.trim());
        if (existingTag) {
          setSelectedTags((prevTags) => [...prevTags, existingTag.name]);
        } else {
          const savedTag = await saveDataTag({ name: newTag.trim() });
          setSelectedTags((prevTags) => [...prevTags, savedTag.name]);
          setDataTags((prevTags) => [...(prevTags || []), savedTag]);
        }
        setNewTag("");
        setIsAddingNewTag(false);
      } catch (error) {
        console.error("Error adding new tag:", error);
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
  };

  const handleInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    // Safely filter tags
    const filtered = (dataTags || []).filter((tag) =>
      tag.name.toLowerCase().includes(input)
    );
    setFilteredTags(filtered);
    setNewTag(e.target.value);
  };

  if (
    isTagsVisible &&
    (!dataTags || dataTags.length === 0) &&
    !isAddingNewTag
  ) {
    return (
      <section className="data-tags">
        <p className="data-tags__no-tags">
          No tags available. Click "Add New Tag" to create your first tag.
        </p>
        <button
          onClick={() => setIsAddingNewTag(true)}
          className="new-tag-button"
        >
          Add New Tag
        </button>
        {isAddingNewTag && (
          <div className="tag-input-container">
            <input
              type="text"
              placeholder="Enter new tag name..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="tag-input"
            />
            <div className="new-tag-actions">
              <button onClick={handleAddNewTag} className="add-button">
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingNewTag(false);
                  setNewTag("");
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <>
      {isTagsVisible && (
        <section className="data-tags">
          {selectedTags.length === 0 && (
            <p className="data-tags__no-tags">No Tags Selected</p>
          )}
          <div className="tags-list">
            {selectedTags.map((tag) => (
              <div key={tag} className="tags">
                {tag}
                <span
                  className="cancel-icon"
                  onClick={() => handleRemoveTag(tag)}
                >
                  &#x2715;
                </span>
              </div>
            ))}
          </div>
          <div className="tag-input-container">
            <input
              type="text"
              placeholder="Search or add tags..."
              value={newTag}
              onChange={handleInputChange}
              className="tag-input"
            />
            {isAddingNewTag && (
              <div className="new-tag-actions">
                <button onClick={handleAddNewTag} className="add-button">
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingNewTag(false);
                    setNewTag("");
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <ul className="filtered-tags-list">
            {(filteredTags || []).map((tag) => (
              <li key={tag._id} className="tag-item">
                <label>
                  <input
                    className="category__checkbox"
                    type="checkbox"
                    value={tag.name}
                    checked={selectedTags.includes(tag.name)}
                    onChange={(e) => {
                      const value = tag.name;
                      if (e.target.checked) {
                        setSelectedTags((prevTags) => [...prevTags, value]);
                      } else {
                        setSelectedTags((prevTags) =>
                          prevTags.filter((t) => t !== value)
                        );
                      }
                    }}
                  />
                  {tag.name}
                </label>
              </li>
            ))}
          </ul>
          {!isAddingNewTag && (
            <button
              onClick={() => setIsAddingNewTag(true)}
              className="new-tag-button"
            >
              Add New Tag
            </button>
          )}
        </section>
      )}
    </>
  );
}
