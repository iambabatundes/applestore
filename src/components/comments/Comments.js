import React, { useState, useEffect } from "react";

import "./styles/Comments.css";
import Comment from "./Comment";
import AddComment from "./AddComment";

const Comments = ({
  comments,
  addComments,
  updateScore,
  updateReplies,
  editComment,
  commentDelete,
  setDeleteModalState,
}) => {
  // const getData = async () => {
  //   try {
  //     const res = await fetch();
  //     if (res.ok) {
  //       const data = await res.json();
  //       updateComments(data.comments);
  //     } else {
  //       console.error("Failed to fetch data:", res.status, res.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  return (
    <main className="App">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          commentData={comment}
          updateScore={updateScore}
          updateReplies={updateReplies}
          editComment={editComment}
          commentDelete={commentDelete}
          setDeleteModalState={setDeleteModalState}
        />
      ))}
      <AddComment buttonValue={"send"} addComments={addComments} />
    </main>
  );
};

export default Comments;
