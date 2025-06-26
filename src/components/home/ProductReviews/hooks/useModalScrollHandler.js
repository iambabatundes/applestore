import { useCallback } from "react";

export default function useModalScrollHandler(
  ref,
  { hasMore, loading, loadMore }
) {
  return useCallback(() => {
    if (!ref.current || !hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);
}
