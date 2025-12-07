    // import React, { use, useState,useEffect } from 'react'

    // function Slider({books}) {
    //     const [currentIndex, setCurrentIndex] = useState(0);

    //     // const nextSlide = () => {
    //     //     setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
    //     // };
    //     // const prevSlide = () => {
    //     //     setCurrentIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length);
    //     // }
    //     useEffect(() => {
    //         const interval = setInterval(() => {
    //             setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
    //         }, 1000);
    //         return () => clearInterval(interval);
    //     }, [books.length]);

    //     return (
    //         books.map((book, index) => (
    //             <div
    //                 key={book.id}
    //                 className={index === currentIndex ? 'slide active' : 'slide'}
    //             >
    //                 {index === currentIndex && (
    //                     <>
    //                     <img src={book.cover_url} alt={book.title} className="image" />
    //                 <p className="title">{book.title}</p>
    //                     </>
    //                 )}
    //             </div>
    //         ))
    //     )
    // }

    // export default Slider

import React, { useState, useEffect } from "react";
import "../Styles/slider.css";

function Slider({ books }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % books.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [books.length]);

  return (
    <div className="story-slider">
      {books.map((book, i) => (
        <div
          key={book.id}
          className={`story-slide ${i === index ? "active" : ""}`}
        >
          <img src={book.cover_url} alt="" />
        </div>
      ))}

      <div className="dots">
        {books.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
