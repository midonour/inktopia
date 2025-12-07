import { useEffect } from "react";
import "../Styles/HomePage.css";
import Book from "../Components/Book";
import Loader from "../Components/Loader";
import Error from "../Components/Error";
import Slider from "../Components/Slider";
import { useBooks } from "../Contexts/BooksContext";
import { useAuth } from "../Contexts/AuthContext";

function HomePage() {
  const { state, getBooks } = useBooks();
  const { books, loading, error } = state;

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  const {user} =useAuth();
  if (loading) return <Loader />;
  if (error) return <Error />;
  console.log("HomePage user:", user);
  const last3Books = books.slice(0, 3);

  return (
    <div className="home-page">
      {/* Title */}
      <h1 className="home-title">Welcome to InkTopia</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search for books..." />
        <button>Search</button>
      </div>

      {/* Slider */}
      <h2 className="slider-title">New Reveals</h2>
      <Slider books={last3Books} />

      {/* Books Grid */}
      <div className="books-section">
        <h2 className="section-title">Explore Our Collection</h2>

        <div className="books">
          {books.map((book) => (
            <Book key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
