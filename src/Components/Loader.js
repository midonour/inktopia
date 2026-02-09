import React from "react";
import "../Styles/Loader.css";

export default function Loader({ children }) {
  return (
    <div className="loader">
      {children}
    </div>
  );
}

