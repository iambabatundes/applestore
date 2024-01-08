import React, { useState, useEffect } from "react";

export default function PostTags({
  isTagsVisible,
  blogPosts,
  onTagsChange,
  selectedTags,
  setSelectedTags,
}) {
  const [allTags, setAllTags] = useState(() => {
    // Load tags from local storage or default to an empty array
    const storedTags = JSON.parse(localStorage.getItem("tags")) || [];
    return Array.from(
      new Set([...storedTags, ...blogPosts.flatMap((post) => post.tags || [])])
    );
  });

  const [newTag, setNewTag] = useState("");
  const [isAddingNewTag, setIsAddingNewTag] = useState(false);
  // const [selectedTags, setSelectedTags] = useState([]);

  const handleAddNewTag = () => {
    if (newTag.trim() !== "") {
      const updatedTags = Array.from(new Set([...allTags, newTag.trim()]));

      // Update allTags state
      setAllTags(updatedTags);

      // Save tags to local storage
      localStorage.setItem("tags", JSON.stringify(updatedTags));

      // Update selectedTags state
      setSelectedTags((prevTags) => [...prevTags, newTag.trim()]);

      // Clear the newTag input
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = allTags.filter((tag) => tag !== tagToRemove);

    // Update allTags state
    setAllTags(updatedTags);

    // Save tags to local storage
    localStorage.setItem("tags", JSON.stringify(updatedTags));

    // Update selectedTags state
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag !== tagToRemove)
    );
  };

  // Clear tags from local storage when the component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem("tags");
    };
  }, []);

  // Notify the parent component about the selected tags
  useEffect(() => {
    onTagsChange(selectedTags);
  }, [selectedTags, onTagsChange]);

  return (
    <>
      {isTagsVisible && (
        <section>
          {selectedTags.map((tag) => (
            <div key={tag} className="tag">
              {tag}
              <span
                className="cancel-icon"
                onClick={() => handleRemoveTag(tag)}
              >
                &#x2715; {/* Unicode character for 'X' */}
              </span>
            </div>
          ))}
          <button onClick={() => setIsAddingNewTag(!isAddingNewTag)}>
            + Add New Tag
          </button>
          {isAddingNewTag && (
            <div>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button onClick={handleAddNewTag}>Add</button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
