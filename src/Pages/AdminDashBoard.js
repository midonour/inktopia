// // import React, { useState, useEffect } from "react";
// // import "../Styles/AdminDashBoard.css";
// // import supabase from "../Configs/SupabaseConfig";

// // export default function AdminDashBoard() {
// //   const [books, setBooks] = useState([]);
// //   const [title, setTitle] = useState("");
// //   const [author, setAuthor] = useState("");
// //   const [cover, setCover] = useState("");
// //   const [file, setFile] = useState(null);

// //   const fetchBooks = async () => {
// //     const { data, error } = await supabase
// //       .from("books")
// //       .select("*")
// //       .order("created_at", { ascending: false });

// //     if (!error) setBooks(data);
// //   };

// //   useEffect(() => {
// //     fetchBooks();
// //   }, []);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!title || !author || !cover || !file) {
// //       alert("Please fill all fields");
// //       return;
// //     }

// //     const fileName = `${Date.now()}_${file.name}`;
// //     const { data: fileData, error: uploadError } = await supabase.storage
// //       .from("eBooks")
// //       .upload(fileName, file);

// //     if (uploadError) return alert(uploadError.message);

// //     const fileUrl = `${supabase.storageUrl}/eBooks/${fileData.path}`;

// //     const { data: newBook } = await supabase
// //       .from("books")
// //       .insert([
// //         {
// //           title,
// //           author,
// //           cover_url: cover,
// //           file_url: fileUrl,
// //           downloads_count: 0,
// //           reads_count: 0,
// //           average_rating: 0,
// //         },
// //       ])
// //       .select()
// //       .single();

// //     setBooks([newBook, ...books]);
// //     setTitle("");
// //     setAuthor("");
// //     setCover("");
// //     setFile(null);
// //   };

// //   const handleDelete = async (bookId, bookName) => {
// //     if (!window.confirm("Are you sure you want to delete this book?")) return;
// //     const { error } = await supabase.from("books").delete().eq("id", bookId);
// //     const { data, errors } = await supabase.storage
// //       .from("eBooks")
// //       .remove([`${bookName}.pdf`]);
// //     if (error) return alert(error.message);
// //     setBooks(books.filter((b) => b.id !== bookId));
// //   };
// //   return (
// //     <div className="admin-dashboard">
// //       {/* Stats */}
// //       <section className="stats">
// //         <div className="stat-card">
// //           <h2>Total Books</h2>
// //           <p>{books.length}</p>
// //         </div>
// //         <div className="stat-card">
// //           <h2>Total Downloads</h2>
// //           <p>{books.reduce((s, b) => s + (b?.downloads_count ?? 0), 0)}</p>
// //         </div>
// //         <div className="stat-card">
// //           <h2>Total Reads</h2>
// //           <p>{books.reduce((s, b) => s + (b?.reads_count ?? 0), 0)}</p>
// //         </div>
// //       </section>

// //       {/* Add Book */}
// //       <section className="manage-books">
// //         <h2>Manage Books</h2>

// //         <form className="add-book-form" onSubmit={handleSubmit}>
// //           <h3>➕ Add a New Book</h3>

// //           <input
// //             type="text"
// //             placeholder="📖 Book Title"
// //             value={title}
// //             onChange={(e) => setTitle(e.target.value)}
// //           />

// //           <input
// //             type="text"
// //             placeholder="📝 Book Author"
// //             value={author}
// //             onChange={(e) => setAuthor(e.target.value)}
// //           />

// //           {/* File Upload */}
// //           <div className="file-upload-wrapper">
// //             <span className="custom-file-upload">
// //               <i className="fa-solid fa-upload"></i> Upload Book
// //             </span>
// //             <input type="file" onChange={(e) => setFile(e.target.files[0])} />
// //           </div>

// //           <input
// //             type="url"
// //             placeholder="🖼️ Cover Image URL"
// //             value={cover}
// //             onChange={(e) => setCover(e.target.value)}
// //           />

// //           <button type="submit">Add Book</button>
// //         </form>

// //         {/* Books */}
// //         <div className="books-cards">
// //           {books.map((book) => (
// //             <div className="book-card" key={book.id}>
// //               <img
// //                 src={book?.cover_url ?? "https://via.placeholder.com/220x280"}
// //                 alt={book.title}
// //               />
// //               <div className="book-card-content">
// //                 <h3>{book.title}</h3>
// //                 <p>{book.author || "Unknown Author"}</p>

// //                 <div className="card-actions">
// //                   <button
// //                     className="delete-btn"
// //                     onClick={() => handleDelete(book.id, book.title)}
// //                   >
// //                     🗑️ Delete
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import "../Styles/AdminDashBoard.css";
// import supabase from "../Configs/SupabaseConfig";

// export default function AdminDashBoard() {
//   const [books, setBooks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [cover, setCover] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   /* ================= Fetch Books ================= */
//   const fetchBooks = async () => {
//     const { data, error } = await supabase
//       .from("books")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error(error);
//       return;
//     }

//     setBooks(data || []);
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       console.log("SESSION 👉", data.session);
//     });
//   }, []);

//   /* ================= Add Book ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     console.log(user);
//     if (!title || !author || !cover || !file) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       /* 1️⃣ Upload file */
//       const fileExt = file.name.split(".").pop();
//       const fileName = `${crypto.randomUUID()}.${fileExt}`;

//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from("eBooks")
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       /* 2️⃣ Get public URL */
//       const { data } = supabase.storage
//         .from("eBooks")
//         .getPublicUrl(uploadData.path);

//       /* 3️⃣ Insert into DB */
//       const { data: newBook, error: insertError } = await supabase
//         .from("books")
//         .insert([
//           {
//             title,
//             author,
//             cover_url: cover,
//             file_url: data.publicUrl,
//             downloads_count: 0,
//             reads_count: 0,
//             average_rating: 0,
//           },
//         ])
//         .select()
//         .single();

//       if (insertError) throw insertError;

//       setBooks((prev) => [newBook, ...prev]);

//       /* 4️⃣ Reset form */
//       setTitle("");
//       setAuthor("");
//       setCover("");
//       setFile(null);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= Delete Book ================= */
//   const handleDelete = async (book) => {
//     if (!window.confirm("Are you sure you want to delete this book?")) return;

//     try {
//       /* 1️⃣ Delete from storage */
//       if (book.storage_path) {
//         const { error: storageError } = await supabase.storage
//           .from("eBooks")
//           .remove([book.storage_path]);

//         if (storageError) throw storageError;
//       }

//       /* 2️⃣ Delete from DB */
//       const { error: dbError } = await supabase
//         .from("books")
//         .delete()
//         .eq("id", book.id);

//       if (dbError) throw dbError;

//       setBooks((prev) => prev.filter((b) => b.id !== book.id));
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Delete failed");
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       {/* ================= Stats ================= */}
//       <section className="stats">
//         <div className="stat-card">
//           <h2>Total Books</h2>
//           <p>{books.length}</p>
//         </div>

//         <div className="stat-card">
//           <h2>Total Downloads</h2>
//           <p>{books.reduce((s, b) => s + (b.downloads_count || 0), 0)}</p>
//         </div>

//         <div className="stat-card">
//           <h2>Total Reads</h2>
//           <p>{books.reduce((s, b) => s + (b.reads_count || 0), 0)}</p>
//         </div>
//       </section>

//       {/* ================= Manage Books ================= */}
//       <section className="manage-books">
//         <h2>Manage Books</h2>

//         <form className="add-book-form" onSubmit={handleSubmit}>
//           <h3>➕ Add a New Book</h3>

//           <input
//             type="text"
//             placeholder="📖 Book Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <input
//             type="text"
//             placeholder="📝 Book Author"
//             value={author}
//             onChange={(e) => setAuthor(e.target.value)}
//           />

//           <div className="file-upload-wrapper">
//             <span className="custom-file-upload">
//               <i className="fa-solid fa-upload"></i> Upload Book
//             </span>
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//           </div>

//           <input
//             type="url"
//             placeholder="🖼️ Cover Image URL"
//             value={cover}
//             onChange={(e) => setCover(e.target.value)}
//           />

//           <button type="submit" disabled={loading}>
//             {loading ? "Uploading..." : "Add Book"}
//           </button>
//         </form>

//         {/* ================= Books ================= */}
//         <div className="books-cards">
//           {books.map((book) => (
//             <div className="book-card" key={book.id}>
//               <img
//                 src={book.cover_url || "https://via.placeholder.com/220x280"}
//                 alt={book.title}
//               />

//               <div className="book-card-content">
//                 <h3>{book.title}</h3>
//                 <p>{book.author || "Unknown Author"}</p>

//                 <div className="card-actions">
//                   <button
//                     className="delete-btn"
//                     onClick={() => handleDelete(book)}
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import "../Styles/AdminDashBoard.css";
import supabase from "../Configs/SupabaseConfig";

export default function AdminDashBoard() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= Fetch Books ================= */
  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setBooks(data || []);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* ================= Add Book ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !cover || !file) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      /* 1️⃣ Upload PDF */
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage.from("eBooks").upload(fileName, file);

      if (uploadError) throw uploadError;

      /* 2️⃣ Get public URL */
      const { data: urlData } = supabase.storage
        .from("eBooks")
        .getPublicUrl(uploadData.path);

      const fileUrl = urlData?.publicUrl;

      if (!fileUrl) {
        throw new Error("File URL is null");
      }

      /* 3️⃣ Insert into DB */
      const { data: newBook, error: insertError } = await supabase
        .from("books")
        .insert([
          {
            title,
            author,
            cover_url: cover,
            file_url: fileUrl,
            storage_path: uploadData.path, // 👈 مهم للحذف
            downloads_count: 0,
            reads_count: 0,
            average_rating: 0,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      setBooks((prev) => [newBook, ...prev]);

      /* 4️⃣ Reset form */
      setTitle("");
      setAuthor("");
      setCover("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Delete Book ================= */
  const handleDelete = async (book) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      /* 1️⃣ Delete from storage */
      if (book.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("eBooks")
          .remove([book.storage_path]);

        if (storageError) throw storageError;
      }

      /* 2️⃣ Delete from DB */
      const { error: dbError } = await supabase
        .from("books")
        .delete()
        .eq("id", book.id);

      if (dbError) throw dbError;

      setBooks((prev) => prev.filter((b) => b.id !== book.id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* ================= Stats ================= */}
      <section className="stats">
        <div className="stat-card">
          <h2>Total Books</h2>
          <p>{books.length}</p>
        </div>

        <div className="stat-card">
          <h2>Total Downloads</h2>
          <p>{books.reduce((s, b) => s + (b.downloads_count || 0), 0)}</p>
        </div>

        <div className="stat-card">
          <h2>Total Reads</h2>
          <p>{books.reduce((s, b) => s + (b.reads_count || 0), 0)}</p>
        </div>
      </section>

      {/* ================= Manage Books ================= */}
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
            placeholder="📝 Book Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          {/* <input type="text" placeholder="" */}

          <div className="file-upload-wrapper">
            <span className="custom-file-upload">
              <i className="fa-solid fa-upload"></i> Upload Book
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <input
            type="url"
            placeholder="🖼️ Cover Image URL"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Book"}
          </button>
        </form>

        {/* ================= Books ================= */}
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
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(book)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
