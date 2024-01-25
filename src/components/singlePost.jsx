import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../components/styles/singleBlog.css";
import Comments from "./comments/Comments";

export default function SinglePost({ blogPosts, setBlogPosts }) {
  const initialComments = {
    currentUser: {
      username: "juliusomo",
    },
    comments: [
      {
        id: 1,
        content:
          "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        createdAt: "23 November 2021",
        score: 12,
        username: "amyrobson",
        currentUser: false,
        replies: [],
      },
      {
        id: 2,
        content:
          "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        createdAt: "5 December 2021",
        score: 5,
        username: "maxblagun",
        currentUser: false,
        replies: [
          {
            id: 3,
            content:
              "@maxblaugn, If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
            createdAt: "18 December 2021",
            score: 4,
            username: "ramsesmiron",
            currentUser: false,
            replies: [],
          },
          {
            id: 4,
            content:
              "@ramsesmiron, I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            createdAt: "30 December 2021",
            score: 2,
            username: "juliusomo",
            currentUser: true,
            replies: [],
          },
        ],
      },
    ],
  };

  const [comments, updateComments] = useState(initialComments.comments);
  const [deleteModalState, setDeleteModalState] = useState(false);

  const { title } = useParams();

  function formatPermalink(title) {
    return title.toLowerCase().replaceAll(" ", "-");
  }

  useEffect(() => {
    // Fetch the updated blog posts when the component mounts
    const updatedBlogPosts = blogPosts;

    // Check if blogPosts is not undefined and not empty
    if (updatedBlogPosts && updatedBlogPosts.length > 0) {
      // Find and set the specific blog post by title
      const post = updatedBlogPosts.find(
        (post) => formatPermalink(post.title) === title
      );

      // Set the individual post, not the entire list
      setBlogPosts(post);
    }
  }, [title, setBlogPosts, blogPosts]); // Add blogPosts as a dependency

  useEffect(() => {
    localStorage.getItem("comments") !== null
      ? updateComments(JSON.parse(localStorage.getItem("comments")))
      : updateComments();
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
    deleteModalState
      ? document.body.classList.add("overflow--hidden")
      : document.body.classList.remove("overflow--hidden");
  }, [comments, deleteModalState]);

  if (!blogPosts) {
    return <div>Loading...</div>;
  }

  // update score
  let updateScore = (score, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.score = score;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.score = score;
          }
        });
      });
    }
    updateComments(updatedComments);
  };

  // add comments
  let addComments = (newComment) => {
    let updatedComments = [...comments, newComment];
    updateComments(updatedComments);
  };

  // add replies
  let updateReplies = (replies, id) => {
    let updatedComments = [...comments];
    updatedComments.forEach((data) => {
      if (data.id === id) {
        data.replies = [...replies];
      }
    });
    updateComments(updatedComments);
  };

  // edit comment
  let editComment = (content, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.content = content;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.content = content;
          }
        });
      });
    }

    updateComments(updatedComments);
  };

  // delete comment
  let commentDelete = (id, type, parentComment) => {
    let updatedComments = [...comments];
    let updatedReplies = [];

    if (type === "comment") {
      updatedComments = updatedComments.filter((data) => data.id !== id);
    } else if (type === "reply") {
      comments.forEach((comment) => {
        if (comment.id === parentComment) {
          updatedReplies = comment.replies.filter((data) => data.id !== id);
          comment.replies = updatedReplies;
        }
      });
    }

    updateComments(updatedComments);
  };

  return (
    <section>
      <header
        className="singlePost__main"
        style={{ backgroundImage: `url(${blogPosts.image})` }}
      >
        <div className="singlePost__container">
          <h2 className="single-blog-post__title">{blogPosts.title}</h2>
          <div className="singlePost__tags">
            <span>
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <span className="single-blog-post__date">
                {blogPosts.datePosted}
              </span>
            </span>

            <div className="singlePost__postedBy">
              <i className="fa fa-user" aria-hidden="true"></i>
              <span className="single-blog-post__author">
                {blogPosts.postedBy}
              </span>
            </div>

            <div className="singlePost__comment">
              <i className="fa fa-comment-o" aria-hidden="true"></i>
              {comments.length === 0 ? (
                <span>No Comment</span>
              ) : (
                <span>{comments.length} Comment(s)</span>
              )}
            </div>
          </div>
        </div>
      </header>
      <section className="singlePost">
        <section className="singlePost__left">
          <img
            className="single-blog-post__image"
            src={blogPosts.image}
            alt={blogPosts.title}
          />
          <p className="single-blog-post__content">{blogPosts.content}</p>

          <Comments
            updateReplies={updateReplies}
            comments={comments}
            updateScore={updateScore}
            editComment={editComment}
            commentDelete={commentDelete}
            setDeleteModalState={setDeleteModalState}
            addComments={addComments}
          />
        </section>

        {/* Recent Article Section */}
        <section className="singlePost__right">
          <h1>Recent Article</h1>

          <div>
            <div className="singlePost__recent">
              <img
                className="singleBlog-recent__image"
                src={blogPosts.image}
                alt={blogPosts.title}
              />

              <div className="singlePost__recent-main">
                <Link>
                  <h2 className="singleBlog__recent-post__title">
                    {blogPosts.title}
                  </h2>
                </Link>
                <div className="singlePost__recent-tag">
                  <section>
                    <i className="fa fa-clock-o" aria-hidden="true"></i>
                    <span className="single-blog-post__date">
                      {blogPosts.datePosted}
                    </span>
                  </section>

                  <section className="singlePost__recent-icon">
                    <i className="fa fa-user" aria-hidden="true"></i>
                    <span className="singlePost__recent-post__author">
                      {blogPosts.postedBy}
                    </span>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
