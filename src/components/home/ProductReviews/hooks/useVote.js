import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useReviewVoteStore } from "../store/useReviewVoteStore";
import { saveVoteIntent } from "./useVoteIntent";

export default function useVote(review, currentUserId) {
  const navigate = useNavigate();
  const location = useLocation();

  const { vote, hasVoted, getVoteData, hydrateFromLocalStorage } =
    useReviewVoteStore();

  const voteData = getVoteData(review._id);
  const alreadyVoted = hasVoted(review._id);

  useEffect(() => {
    hydrateFromLocalStorage(review._id);
  }, [review._id, hydrateFromLocalStorage]);

  const handleVote = (type) => {
    if (!currentUserId) {
      saveVoteIntent({
        path: location.pathname,
        reviewId: review._id,
        voteType: type,
      });

      navigate("/login", {
        state: {
          path: location.pathname,
          reviewId: review._id,
          action: "vote",
          voteType: type,
        },
      });
      return;
    }

    if (alreadyVoted) return;
    vote({ reviewId: review._id, type, currentUserId });
  };

  useEffect(() => {
    if (
      location?.state?.action === "vote" &&
      location?.state?.reviewId === review._id &&
      location?.state?.voteType &&
      !alreadyVoted &&
      currentUserId
    ) {
      vote({
        reviewId: review._id,
        type: location.state.voteType,
        currentUserId,
      });
      window.history.replaceState({}, document.title); // Clear
    }
  }, [location, review._id, currentUserId, alreadyVoted]);

  return {
    voteData,
    handleVote,
    alreadyVoted,
  };
}
