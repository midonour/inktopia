import React, { createContext, useContext, useReducer } from "react";
import supabase from "../Configs/SupabaseConfig";

const initialState = {
  url: "",
  title: "",
  bookId: null,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_READER_DATA":
      return {
        ...state,
        url: action.payload.url,
        title: action.payload.title,
        bookId: action.payload.bookId,
        currentPage: action.payload.currentPage || 1,
        totalPages: action.payload.totalPages || 1,
      };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

const ReaderContext = createContext();

export function ReaderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ----------------------------------------
  // LOAD PROGRESS
  // ----------------------------------------
  async function load_progress(bookId, userId) {
    // أولًا نجيب آخر تقدم للمستخدم
    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (progressError) {
      console.log("Load progress error:", progressError.message);
      return;
    }

    if (progressData && progressData.length > 0) {
      const row = progressData[0];
      dispatch({ type: "SET_CURRENT_PAGE", payload: row.current_page });
    } else {
      // لو مفيش تقدم، يبدأ من الصفحة 1
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
    }
  }

  // ----------------------------------------
  // SAVE PROGRESS
  // ----------------------------------------
  async function save_progress(bookId, userId, currentPage, totalPages) {
    const { error } = await supabase.from("user_progress").upsert({
      user_id: userId,
      book_id: bookId,
      current_page: currentPage,
      total_pages: totalPages,
    });

    if (error) console.error("Error saving progress:", error);
  }

  // ----------------------------------------
  // LOAD READER DATA
  // ----------------------------------------
  async function load_reader_data(payload) {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({
      type: "SET_READER_DATA",
      payload: {
        ...payload,
      },
    });

    dispatch({ type: "SET_LOADING", payload: false });
  }

  return (
    <ReaderContext.Provider
      value={{
        ...state,
        dispatch,
        load_reader_data,
        load_progress,
        save_progress,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error("useReader must be used inside ReaderProvider");
  return ctx;
}
