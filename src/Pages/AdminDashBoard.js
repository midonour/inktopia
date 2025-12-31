import React, { useState, useEffect } from "react";
import "../Styles/AdminDashBoard.css";
import supabase from "../Configs/SupabaseConfig";

export default function AdminDashBoard() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");
  const [file, setFile] = useState(null);

  // ===== Fetch all books =====
  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.log(error);
    else setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ===== Handle Add Book =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !cover || !file) {
      alert("Please fill all fields");
      return;
    }

    try {
      // 1️⃣ Upload file to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("books_files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const fileUrl = `${supabase.storageUrl}/books_files/${fileData.path}`;

      // 2️⃣ Insert book record in DB
      const { data: newBook, error: insertError } = await supabase
        .from("books")
        .insert([
          {
            title,
            author,
            cover_url: cover,
            file_url: fileUrl,
            downloads_count: 0,
            reads_count: 0,
            average_rating: 0,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 3️⃣ Update UI
      setBooks([newBook, ...books]);
      setTitle("");
      setAuthor("");
      setCover("");
      setFile(null);
      alert("Book added successfully!");
    } catch (err) {
      console.log(err);
      alert("Error adding book: " + err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Stats */}
      <section className="stats">
        <div className="stat-card">
          <h2>Total Books</h2>
          <p>{books.length}</p>
        </div>
        <div className="stat-card">
          <h2>Total Downloads</h2>
          <p>{books.reduce((sum, b) => sum + (b.downloads_count || 0), 0)}</p>
        </div>
        <div className="stat-card">
          <h2>Total Reads</h2>
          <p>{books.reduce((sum, b) => sum + (b.reads_count || 0), 0)}</p>
        </div>
      </section>

      {/* Add Book Form */}
      <section className="manage-books">
        <h2>Manage Books</h2>

        <form className="add-book-form" onSubmit={handleSubmit}>
          <h3>➕ Add a New Book</h3>

          <input
            type="text"
            placeholder="📖 Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="📝 Book author"
            value={title}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <span className="custom-file-upload">
            <i class="fa-solid fa-upload"></i> upload book
          </span>
          <input
            type="url"
            placeholder="🖼️ Cover Image URL"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />

          <button type="submit">Add Book</button>
        </form>

        <div className="books-cards">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img
                src={book.cover_url || "https://via.placeholder.com/220x280"}
                alt={book.title}
              />
              <div className="book-card-content">
                <h3>{book.title}</h3>
                <p>{book.author || "Unknown Author"}</p>

                <div className="card-actions">
                  <button className="edit-btn">✏️ Edit</button>
                  <button className="delete-btn">🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
