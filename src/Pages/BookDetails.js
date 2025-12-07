import React, { useEffect, useState } from "react";
import "../Styles/BookDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../Configs/SupabaseConfig";
import { useReader } from "../Contexts/ReaderContext";
import StarRating from "../Components/StarRating";
import { useAuth } from "../Contexts/AuthContext";

export default function BookDetails() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { load_reader_data } = useReader();
  const { user } = useAuth();

  const userId = user?.id;

  const [book, setBook] = useState(null);
  const [userRating, setUserRating] = useState(0);

  // Fetch book + stored rating
  useEffect(() => {
    const fetchAll = async () => {
      // Fetch book data
      const { data: bookData } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .single();

      setBook(bookData);

      // Fetch user's rating
      if (userId) {
        const { data: rateData } = await supabase
          .from("book_ratings")
          .select("rating")
          .eq("book_id", bookId)
          .eq("user_id", userId)
          .single();

        if (rateData) setUserRating(rateData.rating);
      }
    };

    fetchAll();
  }, [bookId, userId]);

  // Save user's rating
  async function handleRatingSubmit(newRating) {
    setUserRating(newRating);

    // Insert or update user rating
    await supabase.from("book_ratings").upsert(
      {
        book_id: bookId,
        user_id: userId,
        rating: newRating,
      },
      { onConflict: "book_id,user_id" }
    );

    // Update book average
    const { data: allRatings } = await supabase
      .from("book_ratings")
      .select("rating")
      .eq("book_id", bookId);

    const avg =
      allRatings.reduce((sum, r) => sum + r.rating, 0) /
      allRatings.length;

    await supabase
      .from("books")
      .update({ average_rating: avg })
      .eq("id", bookId);

    // Update UI instantly
    setBook((prev) => ({ ...prev, average_rating: avg }));
  }

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("eBooks")
        .download(book.file_url);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = book.file_url;
      a.click();
      window.URL.revokeObjectURL(url);

      await supabase
        .from("books")
        .update({ downloads_count: book.downloads_count + 1 })
        .eq("id", bookId);
    } catch (err) {
      console.log("Download error:", err.message);
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-details-container">

      <div className="book-details">
        <h1>{book.title}</h1>

        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="book-cover" />
        ) : (
          <div className="book-cover-placeholder">
            <i className="fa-regular fa-image"></i>
            <p>No Cover Available</p>
          </div>
        )}

        <h3>{book.author || "Unknown Author"}</h3>
        <p>{book.description || "No description available."}</p>

        {/* ⭐ User Rating */}
        <div className="rating-box">
          <h4>Your rating:</h4>
          <StarRating
            maxRating={5}
            size={35}
            rating={userRating}
            onSetRating={handleRatingSubmit}
          />

          <p className="avg-rating">
            ⭐ Average Rating: {book.average_rating?.toFixed(1) || 0}
          </p>
        </div>

        <div className="book-actions">
          <button
            className="read-btn"
            onClick={() => navigate(`/reader/${bookId}/${book.file_url}`)}
          >
            Read online
          </button>

          <button className="download-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

