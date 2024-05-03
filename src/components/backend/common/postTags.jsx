import React, { useState, useEffect } from "react";
import { getTags, getTag } from "../../tags";

export default function PostTags({
  isTagsVisible,
  onTagsChange,
  selectedTags,
  setSelectedTags,
}) {
  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isAddingNewTag, setIsAddingNewTag] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);

  // Fetch tags from the backend on component mount
  useEffect(() => {
    const fetchedTags = getTags();
    setAllTags(fetchedTags);
    setFilteredTags(fetchedTags);
  }, []);

  const handleAddNewTag = () => {
    if (newTag.trim() !== "") {
      const existingTag = getTag(newTag.trim());
      if (existingTag) {
        setSelectedTags((prevTags) => [...prevTags, newTag.trim()]);
      } else {
        const updatedTags = [...selectedTags, newTag.trim()];
        setSelectedTags(updatedTags);
        setAllTags([
          ...allTags,
          { id: allTags.length + 1, name: newTag.trim() },
        ]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
  };

  const handleInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    const filtered = allTags.filter((tag) =>
      tag.name.toLowerCase().includes(input)
    );
    setFilteredTags(filtered);
    setNewTag(e.target.value);
  };

  useEffect(() => {
    onTagsChange(selectedTags);
  }, [selectedTags, onTagsChange]);

  return (
    <>
      {isTagsVisible && (
        <section>
          {selectedTags.length === 0 && <p>No Tags Found</p>}
          {selectedTags.map((tag) => (
            <div key={tag} className="tag">
              {tag}
              <span
                className="cancel-icon"
                onClick={() => handleRemoveTag(tag)}
              >
                &#x2715;
              </span>
            </div>
          ))}
          <div>
            <input
              type="text"
              placeholder="Search tags..."
              value={newTag}
              onChange={handleInputChange}
            />
            <ul>
              {filteredTags.map((tag) => (
                <li key={tag.id}>
                  <label>
                    <input
                      type="checkbox"
                      value={tag.name}
                      checked={selectedTags.includes(tag.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags((prevTags) => [
                            ...prevTags,
                            e.target.value,
                          ]);
                        } else {
                          setSelectedTags((prevTags) =>
                            prevTags.filter((t) => t !== e.target.value)
                          );
                        }
                      }}
                    />
                    {tag.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => setIsAddingNewTag(true)}>Add New Tag</button>
          {isAddingNewTag && (
            <div>
              <input
                type="text"
                placeholder="Enter new tag..."
                value={newTag}
                onChange={handleInputChange}
              />
              <button onClick={handleAddNewTag}>Add</button>
              <button onClick={() => setIsAddingNewTag(false)}>Cancel</button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
