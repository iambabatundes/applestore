import React from "react";

export default function utils() {
  function handleTrashAction(selectedPosts) {
    if (selectedPosts.length === 0) {
      // Handle case where no posts are selected
      alert("Please select one or more posts to move to the trash.");
      return;
    }

    // Create a set of IDs for selected posts for efficient lookup
    const selectedPostIds = selectedPosts.map((post) => post.id);

    // Update the status of selected posts to "trash"
    const updatedPosts = blogPosts.map((post) => ({
      ...post,
      status: selectedPostIds.has(post.id) ? "trash" : post.status,
    }));

    // Update the state with the new status
    setBlogPosts(updatedPosts);

    // Clear the selection (optional)
    resetIndividualPostCheckboxes();
    setSelectAll(false);
  }

  function handleBulkAction() {
    // Check if a bulk action is selected
    if (selectedBulkAction === "-1") {
      // Handle case where no action is selected
      alert("Please select a bulk action.");
      return;
    }

    // Find the posts that are checked (selected)
    const selectedPosts = blogPosts.filter((post) => post.selected);

    if (selectedPosts.length === 0) {
      // Handle case where no posts are selected
      alert("Please select one or more posts to apply the bulk action.");
      return;
    }

    // Apply the selected bulk action
    if (selectedBulkAction === "edit") {
      // Handle the "Edit" action
      console.log("Editing selected posts:", selectedPosts);
    } else if (selectedBulkAction === "trash") {
      // Handle the "Trash" action by calling handleTrashAction
      handleTrashAction(selectedPosts); // This should call your handleTrashAction function
    }

    // Reset the bulk action dropdown to its default value
    setSelectedBulkAction("-1");

    // Uncheck all selected posts
    const updatedPosts = blogPosts.map((post) => ({
      ...post,
      selected: false,
    }));
    setBlogPosts(updatedPosts);
  }

  return <div>utils</div>;
}
