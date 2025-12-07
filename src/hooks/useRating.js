// useRating.js
import { useEffect, useState } from "react";
import supabase from "../Configs/SupabaseConfig";

export default function useRating(bookId, userId) {
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get rating for this user
  async function fetchUserRating() {
    let { data } = await supabase
      .from("book_ratings")
      .select("rating")
      .eq("book_id", bookId)
      .eq("user_id", userId)
      .maybeSingle();

    setUserRating(data?.rating || 0);
  }

  // Get average rating
  async function fetchAverageRating() {
    const { data } = await supabase
      .rpc("get_book_avg_rating", { bookid: bookId });

    setAvgRating(data || 0);
  }

  // Save rating
  async function setRating(r) {
    const { error } = await supabase.rpc("rate_book", {
      p_user_id: userId,
      p_book_id: bookId,
      p_rating: r,
    });

    if (!error) {
      setUserRating(r);
      fetchAverageRating();
    }
  }

  useEffect(() => {
    if (bookId && userId) {
      (async () => {
        await fetchUserRating();
        await fetchAverageRating();
        setLoading(false);
      })();
    }
  }, [bookId, userId]);

  return { userRating, avgRating, setRating, loading };
}
