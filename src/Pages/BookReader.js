import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
import { useReader } from "../Contexts/ReaderContext";
import { useAuth } from "../Contexts/AuthContext";
import supabase from "../Configs/SupabaseConfig";
import "../Styles/BookReader.css";
import Loader from "../Components/Loader";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ReaderPage() {
  const {
    currentPage,
    totalPages,
    dispatch,
    save_progress,
    load_progress,
    load_reader_data,
  } = useReader();
  // alert(url);
  const { user } = useAuth();
  const userId = user?.id;

  const { bookId, storagePath } = useParams();
  const [signedUrl, setSignedUrl] = useState(null);
  const containerRef = useRef(null);
  const [pageWidth, setPageWidth] = useState(0);

  // console.log("   Book ID:", bookId);
  // Load reader data

  useEffect(() => {
    load_reader_data({
      title: bookId,
      bookId: bookId,
    });
    // eslint-disable-next-line
  }, [bookId]);

  // Load progress
  useEffect(() => {
    if (bookId && userId) {
      load_progress(bookId, userId);
    }
  }, [bookId, userId, load_progress]);

  // Create signed URL
  useEffect(() => {
    async function fetchSignedUrl() {
      if (!storagePath) return;
      const { data, error } = await supabase.storage
        .from("eBooks")
        .createSignedUrl(storagePath, 60 * 60); // 1 hour

      if (error) {
        console.error("Error creating signed URL:", error);
        setSignedUrl(null);
      } else {
        setSignedUrl(data.signedUrl);
      }
    }

    fetchSignedUrl();
  }, [storagePath]);

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
    return <Loader>Loading PDF...</Loader>;
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
          <Page pageNumber={currentPage} className="page" width={pageWidth} />
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
