import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import supabase from "../Configs/SupabaseConfig";

const initialState = {
  books: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "start_fetch":
      return { ...state, loading: true, error: null };

    case "SET_BOOKS":
      return { ...state, books: action.payload, loading: false };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "ADD_BOOK":
      return { ...state, books: [...state.books, action.payload] };

    default:
      return state;
  }
}

const BooksContext = createContext();

function BooksProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getBooks = useCallback(async () => {
    dispatch({ type: "start_fetch" });

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } else {
      dispatch({ type: "SET_BOOKS", payload: data });
    }
  }, []);

  // const addBook = useCallback(async (book) => {
  // const { data, error } = await supabase
  //   .storage
  //   .from('eBooks')
  //   .upload(book.file, {
  //     cacheControl: '3600',
  //     upsert: false
  //   })
  // if (error) {
  //   console.error('Error uploading file:', error.message);
  //   return;
  // }
  // const { Error } = await supabase
  //   .from('books')
  //   .insert({ id: data.Key, title: book.title, url: book.url, cover: book.cover });
  // }, []);

  const addBook = useCallback(async (book) => {
    // 1) رفع ملف الـ PDF
    const fileName = `${Date.now()}-${book.file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("eBooks")
      .upload(fileName, book.file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      return;
    }

    // 2) الحصول على رابط الملف
    // const { data: publicURL } = supabase.storage
    //   .from("eBooks")
    //   .getPublicUrl(fileName);

    // 3) إدخال البيانات الصحيحة في جدول books
    const { data: insertedBook, error: dbError } = await supabase
      .from("books")
      .insert({
        title: book.title,
        file_url: `${fileName}`, // ✔ متوافق مع الجدول
        cover_url: book.cover || null, // ✔ متوافق مع الجدول
      })
      .select()
      .single();
    if (dbError) {
      console.error("DB Error:", dbError.message);
      return;
    }

    dispatch({ type: "ADD_BOOK", payload: insertedBook });
  }, []);

  // addBook
  //deleteBook
  //updateBook
  // etc. can be added here

  return (
    <BooksContext.Provider value={{ state, getBooks, dispatch, addBook }}>
      {children}
    </BooksContext.Provider>
  );
}

function useBooks() {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
}

export { BooksProvider, useBooks };
