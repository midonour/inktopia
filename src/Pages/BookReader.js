// import { use, useEffect, useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { useParams } from "react-router-dom";
// import { useReader } from "../Contexts/ReaderContext";
// import { useAuth } from "../Contexts/AuthContext";
// import supabase from "../Configs/SupabaseConfig";
// import "../Styles/BookReader.css";
// pdfjs.GlobalWorkerOptions.workerSrc =
//   `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// function ReaderPage() {
//   const { url,  currentPage, totalPages, dispatch, save_progress, load_progress,load_reader_data } = useReader();
//   const { user } = useAuth();
//   const userId = user?.id;
//   const { bookId,bookUrl } = useParams();
//   // const decodedBook = JSON.parse(decodeURIComponent(book));
//   const [signedUrl, setSignedUrl] = useState(null);

//   useEffect(() => {
//     load_reader_data({
//                 url: bookUrl,
//                 title: bookUrl,
//                 bookId: bookId,
//               });
//   }, [bookId, dispatch]);
//   // Load progress
//   useEffect(() => {
//     if (bookId) load_progress(bookId, userId);
//   }, [bookId, load_progress, userId]);


//   // Generate signed URL when url changes
//   useEffect(() => {
//     async function fetchSignedUrl() {
//       if (!url) return;

//       const { data, error } = await supabase.storage
//         .from("eBooks")
//         .createSignedUrl(url, 60 * 60); // ساعة

//       if (error) {
//         console.error("Error creating signed URL:", error);
//         setSignedUrl(null);
//       } else {
//         setSignedUrl(data.signedUrl);
//       }
//     }

//     fetchSignedUrl();
//   }, [url]);


//   if (!signedUrl) return <p>Loading PDF...</p>;

//   return (
//   <div className="reader-wrapper">
//     {!signedUrl ? (
//       <div className="reader-loading">Loading PDF...</div>
//     ) : (
//       <>
//         <div className="pdf-container">
//           <Document
//             file={signedUrl}
//             loading={<div className="reader-loading">Loading PDF...</div>}
//             onLoadSuccess={(pdf) =>
//               dispatch({ type: "SET_TOTAL_PAGES", payload: pdf.numPages })
//             }
//           >
//             <Page pageNumber={currentPage}  className="page"/>
//           </Document>
//         </div>

//         <div className="reader-controls">
//           <button
//             className="nav-btn"
//             disabled={currentPage <= 1}
//             onClick={() => {
//               dispatch({ type: "SET_CURRENT_PAGE", payload: currentPage - 1 });
//               save_progress(bookId, userId, currentPage - 1, totalPages);
//             }}
//           >
//             ← Prev
//           </button>

//           <span className="page-counter">
//             {currentPage} / {totalPages}
//           </span>

//           <button
//             className="nav-btn"
//             disabled={currentPage >= totalPages}
//             onClick={() => {
//               dispatch({ type: "SET_CURRENT_PAGE", payload: currentPage + 1 });
//               save_progress(bookId, userId, currentPage + 1, totalPages);
//             }}
//           >
//             Next →
//           </button>
//         </div>
//       </>
//     )}
//   </div>
// );

// }

// export default ReaderPage;


import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
import { useReader } from "../Contexts/ReaderContext";
import { useAuth } from "../Contexts/AuthContext";
import supabase from "../Configs/SupabaseConfig";
import "../Styles/BookReader.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ReaderPage() {
  const {
    url,
    currentPage,
    totalPages,
    dispatch,
    save_progress,
    load_progress,
    load_reader_data,
  } = useReader();

  const { user } = useAuth();
  const userId = user?.id;

  const { bookId, bookUrl } = useParams();

  const [signedUrl, setSignedUrl] = useState(null);
  const containerRef = useRef(null);
  const [pageWidth, setPageWidth] = useState(0);

  // Load reader data
  useEffect(() => {
    load_reader_data({
      url: bookUrl,
      title: bookUrl,
      bookId: bookId,
    });
  }, [bookId, dispatch]);

  // Load progress
  useEffect(() => {
    if (bookId && userId) {
      load_progress(bookId, userId);
    }
  }, [bookId, userId, load_progress]);

  // Create signed URL
  useEffect(() => {
    async function fetchSignedUrl() {
      if (!url) return;

      const { data, error } = await supabase.storage
        .from("eBooks")
        .createSignedUrl(url, 60 * 60); // 1 hour

      if (error) {
        console.error("Error creating signed URL:", error);
        setSignedUrl(null);
      } else {
        setSignedUrl(data.signedUrl);
      }
    }

    fetchSignedUrl();
  }, [url]);

  // Responsive width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!signedUrl) {
    return <div className="reader-loading">Loading PDF...</div>;
  }
  console.log("Rendered with pageWidth:", pageWidth);
  return (
    <div className="reader-wrapper">
      <div className="pdf-container" ref={containerRef}>
        <Document
          file={signedUrl}
          loading={<div className="reader-loading">Loading PDF...</div>}
          onLoadSuccess={(pdf) =>
            dispatch({ type: "SET_TOTAL_PAGES", payload: pdf.numPages })
          }
        >
          <Page
            pageNumber={currentPage}
            
            className="page"
          />
        </Document>
      </div>

      <div className="reader-controls">
        <button
          className="nav-btn"
          disabled={currentPage <= 1}
          onClick={() => {
            const prev = currentPage - 1;
            dispatch({ type: "SET_CURRENT_PAGE", payload: prev });
            save_progress(bookId, userId, prev, totalPages);
          }}
        >
          ← Prev
        </button>

        <span className="page-counter">
          {currentPage} / {totalPages}
        </span>

        <button
          className="nav-btn"
          disabled={currentPage >= totalPages}
          onClick={() => {
            const next = currentPage + 1;
            dispatch({ type: "SET_CURRENT_PAGE", payload: next });
            save_progress(bookId, userId, next, totalPages);
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default ReaderPage;
