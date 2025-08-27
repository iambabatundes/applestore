import React, { useState, useEffect } from "react";
import StarRating from "../common/starRating";
import "./styles/reviewItem.css";

import useVote from "./hooks/useVote";
import useVoteIntent from "./hooks/useVoteIntent";

export default function ReviewItem({
  review,
  currentUserId,
  setShowModalReport,
  reporting,
}) {
  useVoteIntent(review, currentUserId);

  if (!review) return null;

  const { voteData, handleVote, alreadyVoted } = useVote(review, currentUserId);

  const [votes, setVotes] = useState({
    helpful: review.votes?.helpful || [],
    notHelpful: review.votes?.notHelpful || [],
  });

  useEffect(() => {
    if (voteData?.type) {
      setVotes((prev) => ({
        ...prev,
        [voteData.type]: [...prev[voteData.type], currentUserId],
      }));
    }
  }, [voteData?.type, currentUserId]);

  const votedType = voteData?.type;

  const getMediaUrl = (media) => {
    if (media.storageType === "cloud") return media.cloudUrl;
    if (media.storageType === "local")
      return `${import.meta.env.VITE_API_URL}/uploads/${media.localPath}`;
    return null;
  };

  return (
    <div className="reviewItem animated fadeIn">
      {review.reviewMedia?.length > 0 && (
        <div className="reviewItem__media">
          {review.reviewMedia.map((media, index) => {
            const url = getMediaUrl(media);
            return media.type === "image" ? (
              <img
                key={index}
                src={url}
                alt="review-media"
                className="reviewItem__media-img"
                loading="lazy"
              />
            ) : (
              <video
                key={index}
                controls
                src={url}
                className="reviewItem__media-video"
              ></video>
            );
          })}
        </div>
      )}

      <div className="reviewItem__user">
        <article>
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${
              review.user.profileImages
            }`}
            alt={review.user.username}
          />

          <span>{review.user.username}</span>
        </article>
        <small>{new Date(review.createdAt).toLocaleDateString()}</small>
      </div>

      <div className="reviewItem__content">
        <div className="reviewItem__rating">
          <StarRating rating={review.rating} totalStars={5} />
        </div>
        <h5>{review.title}</h5>
        <p>{review.description}</p>
      </div>

      <div className="reviewItem__vote">
        <span
          onClick={() => handleVote("helpful")}
          className={`vote-btn ${votedType === "helpful" ? "active" : ""} ${
            alreadyVoted ? "disabled" : ""
          }`}
          disabled={alreadyVoted}
        >
          👍 ({votes.helpful.length})
        </span>
        <span
          onClick={() => handleVote("notHelpful")}
          className={votedType === "notHelpful" ? "active" : ""}
          disabled={alreadyVoted}
        >
          👎 ({votes.notHelpful.length})
        </span>

        <span
          className="reviewItem__reportBtn"
          onClick={() => setShowModalReport(true)}
          disabled={reporting}
        >
          🚩 {reporting ? "Reporting..." : "Report"}
        </span>
      </div>
    </div>
  );
}
