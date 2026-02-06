import { useEffect, useState, useRef, use } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
import { useReader } from "../Contexts/ReaderContext";
import { useAuth } from "../Contexts/AuthContext";
import supabase from "../Configs/SupabaseConfig";
import "../Styles/BookReader.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  
  useEffect(() => {
  function updateWidth() {
    if (containerRef.current) {
      setPageWidth(containerRef.current.offsetWidth - 24);
    }
  }

  updateWidth();
  window.addEventListener("resize", updateWidth);

  return () => window.removeEventListener("resize", updateWidth);
}, []);

  if (!signedUrl) {
    return <div className="reader-loading">Loading PDF...</div>;
  }

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
          <Page pageNumber={currentPage} className="page" width={pageWidth}/>
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
