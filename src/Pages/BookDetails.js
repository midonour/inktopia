import { useEffect, useState } from "react";
import "../Styles/BookDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../Configs/SupabaseConfig";
import StarRating from "../Components/StarRating";
import { useAuth } from "../Contexts/AuthContext";
import Loader from "../Components/Loader";
import useBookmark from "../hooks/useBookmark";
export default function BookDetails() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { user } = useAuth();
  const userId = user?.id;

  const [book, setBook] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const { isBookmarked, toggleBookmark, loading } = useBookmark(bookId);
  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch book data
        const { data: bookData, error: bookError } = await supabase
          .from("books")
          .select("*")
          .eq("id", bookId)
          .single();

        if (bookError) throw bookError;
        setBook(bookData);

        // Fetch user's rating
        if (userId) {
          const { data: rateData, error: rateError } = await supabase
            .from("book_ratings")
            .select("rating")
            .eq("book_id", bookId)
            .eq("user_id", userId)
            .single();

          // Ignore "no rows" error
          if (rateError && rateError.code !== "PGRST116") throw rateError;
          if (rateData) setUserRating(rateData.rating);
        }
      } catch (err) {
        console.error("Fetch book or rating error:", err.message);
      }
    };

    fetchAll();
  }, [bookId, userId]);

  // =======================
  // Save user rating
  // =======================
  async function handleRatingSubmit(newRating) {
    if (!userId) return alert("You must be logged in to rate!");

    setUserRating(newRating);

    try {
      // Upsert user rating (يحتاج unique constraint على book_id + user_id)
      const { error: upsertError } = await supabase
        .from("book_ratings")
        .upsert(
          { book_id: bookId, user_id: userId, rating: newRating },
          { onConflict: "book_id,user_id" },
        );

      if (upsertError) throw upsertError;

      // Get all ratings for this book
      const { data: allRatings, error: ratingsError } = await supabase
        .from("book_ratings")
        .select("rating")
        .eq("book_id", bookId);

      if (ratingsError) throw ratingsError;

      console.log("All ratings after upsert:", allRatings);

      // Compute average rating
      const avg =
        allRatings && allRatings.length > 0
          ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
          : newRating;

      // Update average_rating in books table
      const { error: updateError } = await supabase
        .from("books")
        .update({ average_rating: avg })
        .eq("id", bookId);

      if (updateError) throw updateError;

      // Update UI instantly
      setBook((prev) => ({ ...prev, average_rating: avg }));
    } catch (err) {
      console.error("Error updating rating:", err.message);
    }
  }

  // =======================
  // Handle download
  // =======================
  const handleDownload = async () => {
    if (!book?.storage_path) return alert("Book file not found!");

    try {
      const { data, error } = await supabase.storage
        .from("eBooks")
        .download(book.storage_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = book.storage_path.split("/").pop();
      a.click();
      window.URL.revokeObjectURL(url);

      // Update downloads_count in DB & UI
      const { error: updateError } = await supabase
        .from("books")
        .update({ downloads_count: (book.downloads_count || 0) + 1 })
        .eq("id", bookId);

      if (updateError)
        console.error("Update download count error:", updateError);

      setBook((prev) => ({
        ...prev,
        downloads_count: (prev.downloads_count || 0) + 1,
      }));
    } catch (err) {
      console.error("Download error:", err.message);
      alert("Failed to download book.");
    }
  };
  
  if (!book) return <Loader>Loading book details...</Loader>;

  return (
    <div className="book-details-container">
      <div className="book-details">
        <i
          className={`${isBookmarked ? "fa-solid" : "fa-regular"} bookmark-icon fa-bookmark`}
          disabled={loading}
          onClick={toggleBookmark}
        ></i>
        {/* Cover */}
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="book-cover" />
        ) : (
          <div className="book-cover-placeholder">
            <i className="fa-regular fa-image"></i>
            <p>No Cover Available</p>
          </div>
        )}

        {/* Info */}
        <div className="written-info">
          <h1>{book.title}</h1>
          <h3>{book.author || "Unknown Author"}</h3>
          <p>{book.description || "No description available."}</p>

          {/* ⭐ User Rating */}
          <div className="rating-box">
            <h4>Your rating:</h4>
            <StarRating
              maxRating={6}
              size={35}
              rating={userRating}
              onSetRating={handleRatingSubmit}
            />

            <p className="avg-rating">
              ⭐ Average Rating: {book.average_rating?.toFixed(1) || 0}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="book-actions">
          <button
            className="read-btn"
            onClick={() => navigate(`/reader/${bookId}/${book.storage_path}`)}
          >
            Read online
          </button>

          <button className="download-btn" onClick={handleDownload}>
            Download ({book.downloads_count || 0})
          </button>
        </div>
      </div>
    </div>
  );
}
