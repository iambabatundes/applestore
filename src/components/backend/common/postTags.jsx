import React, { useState, useEffect } from "react";
import { getTags, getTag, saveTag } from "../../../services/tagService";

export default function PostTags({
  isTagsVisible,
  onTagsChange,
  selectedTags,
  setSelectedTags,
}) {
  const [tagsData, setTagsData] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isAddingNewTag, setIsAddingNewTag] = useState(false);
  // const [filteredTags, setFilteredTags] = useState([]);

  // Fetch tags from the backend on component mount
  useEffect(() => {
    async function fetchTags() {
      try {
        const fetchedTags = await getTags();
        setTagsData(fetchedTags);
        // setFilteredTags(fetchedTags); // set filtered tags initially
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []);

  const handleAddNewTag = async () => {
    if (newTag.trim() !== "") {
      try {
        const existingTag = await getTag(newTag.trim());
        if (existingTag) {
          setSelectedTags((prevTags) => [...prevTags, newTag.trim()]);
        } else {
          const savedTag = await saveTag({ name: newTag.trim() });
          setSelectedTags((prevTags) => [...prevTags, savedTag.name]);
          setTagsData([...tagsData, savedTag]); // update tagsData with the saved tag
        }
        setNewTag("");
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
    const filtered = tagsData.filter((tag) =>
      tag.name.toLowerCase().includes(input)
    );
    setTagsData(filtered);
    setNewTag(e.target.value);
  };

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
            {/* <input
              type="text"
              placeholder="Search tags..."
              value={newTag}
              onChange={handleInputChange}
            /> */}
            <ul>
              {tagsData.length > 0 && (
                <ul>
                  {tagsData.map((tag) => (
                    <li key={tag._id}>
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
              )}
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
