import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getPostsByTag } from "../../../../services/postService";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px", // corrected typo
    maxWidth: "80%",
    maxHeight: "80%",
    overflow: "auto",
  },
};

export default function PostTagModal({ tag, onClose }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data: fetchedPosts } = await getPostsByTag(tag._id); // Fetch products using the tag ID
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    if (tag) {
      fetchPosts(); // Fetch posts when the tag is selected
    }
  }, [tag]);

  return (
    <Modal
      isOpen={tag !== null} // Open modal when tags are fetched
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <section>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{tag.name} Details</h2>
        {/* Display tag details */}
        <p>Tag ID: {tag._id}</p>
        {/* Display associated products */}
        <h3>Associated Posts:</h3>

        <ul>
          {posts.map((post) => (
            <li key={post._id}>{post.name}</li>
          ))}
        </ul>

        <button onClick={onClose}>Close</button>
      </section>
    </Modal>
  );
}
