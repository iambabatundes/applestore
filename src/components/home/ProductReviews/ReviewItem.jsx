import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { voteReview, reportReview } from "../../../services/reviewService";
import StarRating from "../common/starRating";
import "./styles/reviewItem.css";
import ReportReviewModal from "./ReportReviewModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function ReviewItem({ review, currentUserId }) {
  const [searchParams] = useSearchParams();
  const openReviewModal = searchParams.get("openReviewModal") === "true";
  const navigate = useNavigate();
  const location = useLocation();

  if (!review) return null; // Prevents the error

  const [votes, setVotes] = useState(
    review.votes || { helpful: [], notHelpful: [] }
  );
  const [votedType, setVotedType] = useState(null);
  const [reporting, setReporting] = useState(false);
  const [showModalReport, setShowModalReport] = useState(false);

  useEffect(() => {
    const localVote = localStorage.getItem(`voted-${review._id}`);
    if (localVote) {
      setVotedType(localVote);
    }
  }, [review._id]);

  const hasVoted = Boolean(votedType);

  const handleVote = async (type) => {
    navigate("/login", {
      state: {
        path: location.pathname,
        modal: "review",
        productId: review.productId || review._id,
      },
    });

    if (hasVoted) return;

    // 1. Optimistically update UI
    setVotedType(type);
    setVotes((prev) => ({
      ...prev,
      [type]: [...prev[type], currentUserId],
    }));
    localStorage.setItem(`voted-${review._id}`, type);

    try {
      await voteReview(review._id, type);

      toast.success("Thanks for your feedback!");
    } catch (err) {
      console.error("Vote failed", err);
      toast.error("Vote failed. Please try again.");

      setVotedType(null);
      localStorage.removeItem(`voted-${review._id}`);
      setVotes((prev) => ({
        helpful:
          type === "helpful"
            ? prev.helpful.filter((id) => id !== currentUserId)
            : prev.helpful,
        notHelpful:
          type === "notHelpful"
            ? prev.notHelpful.filter((id) => id !== currentUserId)
            : prev.notHelpful,
      }));
    }
  };

  const handleReportSubmit = async (reason) => {
    setReporting(true);
    try {
      await reportReview(review._id, reason);
      toast.success("Thank you. Your report has been submitted.");
    } catch (err) {
      toast.error("Failed to report review.");
    } finally {
      setReporting(false);
      setShowModal(false);
    }
  };

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
            hasVoted ? "disabled" : ""
          }`}
          disabled={hasVoted}
        >
          👍 ({votes.helpful.length})
        </span>
        <span
          onClick={() => handleVote("notHelpful")}
          className={votedType === "notHelpful" ? "active" : ""}
          disabled={hasVoted}
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

      {openReviewModal && (
        <ReportReviewModal
          isOpen={showModalReport}
          onClose={() => setShowModalReport(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}
