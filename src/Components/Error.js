import React from "react";
import "../Styles/Error.css";

export default function Error({ message }) {
  return (
    <div className="error-books">
      <div className="book-shake"></div>
      <p>{message}</p>
    </div>
  );
}
