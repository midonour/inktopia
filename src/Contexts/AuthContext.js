import React, { createContext, useContext, useReducer, useEffect } from "react";
import supabase from "../Configs/SupabaseConfig";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  errors:null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true, errors:null };
    case "logout":
      return { ...state, user: null, isAuthenticated: false, errors:null };
    case "register":
      return { ...state, user: action.payload, isAuthenticated: true, errors:null };
    case "update_user":
      return { ...state, user: action.payload };
    case "errors":
      return { ...state, errors: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, errors }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // حفظ واسترجاع الجلسة عند تحميل التطبيق
  // useEffect(() => {
  //   const fetchSession = async () => {
  //     const { data, error } = await supabase.auth.getSession();
  //     if (error) {
  //       console.log("Error getting session:", error.message);
  //       return;
  //     }
  //     if (data.session?.user) {
  //       dispatch({ type: "login", payload: data.session.user });
  //     }
  //   };

  //   fetchSession();

  //   // الاستماع لأي تغيير في حالة الدخول (login/logout)
  //   const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
  //     if (session?.user) {
  //       dispatch({ type: "login", payload: session.user });
  //     } else {
  //       dispatch({ type: "logout" });
  //     }
  //   });

  //   return () => {
  //     authListener.subscription.unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    // أول حاجة: نقرأ من localStorage مباشرة
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch({ type: "login", payload: JSON.parse(savedUser) });
    }

    // بعد كده، نتأكد من session الفعلية من supabase
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Error getting session:", error.message);
        return;
      }
      if (data.session?.user) {
        dispatch({ type: "login", payload: data.session.user });
        localStorage.setItem("user", JSON.stringify(data.session.user)); // حفظ في localStorage
      } else {
        localStorage.removeItem("user"); // لو مش موجود، نمسح
      }
    };

    fetchSession();

    // الاستماع لأي تغيير في حالة الدخول (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          dispatch({ type: "login", payload: session.user });
          localStorage.setItem("user", JSON.stringify(session.user));
        } else {
          dispatch({ type: "logout" });
          localStorage.removeItem("user");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signup(Name, Email, Password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: Email,
        password: Password,
        options: { data: { name: Name } },
      });
      if (error) throw error;

      alert("Signup successful!");
      dispatch({ type: "register", payload: data.user });
    } catch (error) {
      dispatch({ type: "errors", payload: error.message });
    }
  }

  async function login(Email, Password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: Email,
        password: Password,
      });
      if (error) throw error;

      alert("Logged in successfully!");
      dispatch({ type: "login", payload: data.user });
    } catch (error) {
      dispatch({ type: "errors", payload: error.message });
      console.log("Login error:", error.message);
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch({ type: "logout" });
    } catch (error) {
      dispatch({ type: "errors", payload: error.message });
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout,errors }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
