import React from "react";
import { useNavigate } from "react-router-dom";
import useBookmark from "../hooks/useBookmark";
function Book({ book }) {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark, loading } = useBookmark(book.id);
  // console.log("Rendering Book component with book:", book);
  return (
    <div
      className="book-card"
      onClick={() => navigate(`/bookDetails/${book.id}`)}
    >
      <div className="book-img-wrapper">
        <img src={book.cover_url} alt="Book Cover" />
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="avg-rating">
          ⭐ {book.average_rating?.toFixed(1) || 0}/6.0
        </p>
        <button
          className="bookmark-btn"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation(); 
            toggleBookmark();
          }}
        >
          <i
            className={`${isBookmarked ? "fa-solid" : "fa-regular"} book-mark-icon fa-bookmark`}
          ></i>
        </button>
      </div>
    </div>
  );
}

export default Book;
