import React from "react";
import { useNavigate } from "react-router-dom";
function Book({ book }) {
  const navigate = useNavigate();

  return (
    <div
      className="book-card"
      onClick={() =>
        navigate(
          `/bookDetails/${book.id}`
        )
      }
    >
      <div className="book-img-wrapper">
        <img src={book.cover_url} alt="Book Cover" />
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
      </div>
    </div>
  );
}

export default Book;
