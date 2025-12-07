// LoadingBooks.js
import React from "react";
import "../Styles/Loader.css";

export default function Loader() {
  return (
    <div className="loading-books">
      <div className="book-flip">
        <div className="cover"></div>
      </div>
      <p>Loading books...</p>
    </div>
  );
}

