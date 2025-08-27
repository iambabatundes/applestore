import { create } from "zustand";
import { toast } from "react-toastify";
import { voteReview } from "../../../../services/reviewService";

export const useReviewVoteStore = create((set, get) => ({
  votes: {}, // { [reviewId]: { helpful: [], notHelpful: [], votedType: 'helpful' } }

  hasVoted: (reviewId) => !!get().votes[reviewId]?.votedType,

  getVoteData: (reviewId) =>
    get().votes[reviewId] || { helpful: [], notHelpful: [], votedType: null },

  vote: async ({ reviewId, type, userId }) => {
    const current = get().votes[reviewId] || {
      helpful: [],
      notHelpful: [],
      votedType: null,
    };

    // Optimistic update
    const updated = {
      ...current,
      votedType: type,
      [type]: [...current[type], userId],
    };

    set((state) => ({
      votes: {
        ...state.votes,
        [reviewId]: updated,
      },
    }));

    localStorage.setItem(`voted-${reviewId}`, type);

    try {
      await voteReview(reviewId, type);
      toast.success("Thanks for your feedback!");
    } catch (err) {
      // Rollback on failure
      const rollback = {
        ...updated,
        votedType: null,
        [type]: updated[type].filter((id) => id !== userId),
      };

      set((state) => ({
        votes: {
          ...state.votes,
          [reviewId]: rollback,
        },
      }));

      localStorage.removeItem(`voted-${reviewId}`);
      console.error("Vote failed", err);
      toast.error("Vote failed. Retrying...");

      // Add retry logic
      setTimeout(() => get().retryVote({ reviewId, type, userId }), 3000);
    }
  },

  retryVote: async ({ reviewId, type, userId }) => {
    try {
      await voteReview(reviewId, type);
      toast.success("Vote retry successful.");
    } catch (e) {
      console.warn("Retry failed. Trying again...");
      setTimeout(() => get().retryVote({ reviewId, type, userId }), 3000);
    }
  },

  hydrateFromLocalStorage: (reviewId) => {
    const type = localStorage.getItem(`voted-${reviewId}`);
    if (!type) return;

    const current = get().votes[reviewId] || {
      helpful: [],
      notHelpful: [],
      votedType: null,
    };
    const updated = { ...current, votedType: type };

    set((state) => ({
      votes: {
        ...state.votes,
        [reviewId]: updated,
      },
    }));
  },
}));
