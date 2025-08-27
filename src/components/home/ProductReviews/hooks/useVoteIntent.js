import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReviewVoteStore } from "../store/useReviewVoteStore";
import { authStore } from "../../../../services/authService";
import { useStore } from "zustand";

const VOTE_KEY = "voteIntent";

export function saveVoteIntent({ path, reviewId, voteType }) {
  sessionStorage.setItem(
    VOTE_KEY,
    JSON.stringify({ path, reviewId, voteType })
  );
}

export function clearVoteIntent() {
  sessionStorage.removeItem(VOTE_KEY);
}

export function getVoteIntent() {
  const raw = sessionStorage.getItem(VOTE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export default function useVoteIntent(review) {
  const location = useLocation();
  const navigate = useNavigate();

  const { vote, hasVoted } = useReviewVoteStore();
  const { user, isAuthReady } = useStore(authStore);

  useEffect(() => {
    const intent = getVoteIntent();
    const userId = user?._id;

    if (
      isAuthReady &&
      intent?.reviewId === review._id &&
      intent?.voteType &&
      userId &&
      !hasVoted(review._id)
    ) {
      vote({ reviewId: intent.reviewId, type: intent.voteType, userId });
      clearVoteIntent();
    }
  }, [review._id, isAuthReady]);
}
