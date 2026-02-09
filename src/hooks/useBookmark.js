import { useEffect, useState, useCallback } from "react";
import supabase from "../Configs/SupabaseConfig";
import { useAuth } from "../Contexts/AuthContext";

export default function useBookmark(bookId) {
  const { user } = useAuth();
  const userId = user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =======================
  // Check bookmark status
  // =======================
  const checkBookmark = useCallback(async () => {
    if (!userId || !bookId) {
      setIsBookmarked(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .maybeSingle();

      if (error) throw error;

      setIsBookmarked(!!data);
    } catch (err) {
      console.error("Check bookmark error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, bookId]);

  // =======================
  // Toggle bookmark
  // =======================
  const toggleBookmark = async () => {
    if (!userId) {
      alert("You must be logged in to use bookmarks");
      return;
    }

    setError(null);

    try {
      // Optimistic UI
      setIsBookmarked((prev) => !prev);

      if (isBookmarked) {
        // Remove
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("book_id", bookId);

        if (error) throw error;
      } else {
        // Add
        const { error } = await supabase.from("bookmarks").insert({
          user_id: userId,
          book_id: bookId,
        });

        if (error) throw error;
      }
    } catch (err) {
      console.error("Toggle bookmark error:", err.message);
      setError(err.message);
      setIsBookmarked((prev) => !prev);
    }
  };
  useEffect(() => {
    checkBookmark();
  }, [checkBookmark]);

  return {
    isBookmarked,
    toggleBookmark,
    loading,
    error,
    refreshBookmark: checkBookmark,
  };
}
