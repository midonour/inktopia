import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import supabase from "../Configs/SupabaseConfig";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  avatarUrl: null,
  errors: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        errors: null,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        avatarUrl: null,
        errors: null,
      };
    case "set_avatar":
      return {
        ...state,
        avatarUrl: action.payload,
      };
    case "errors":
      return {
        ...state,
        errors: action.payload,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, avatarUrl, errors }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  // =======================
  // Restore session + Listen to auth changes
  // =======================
    useEffect(() => {
      const restoreSession = async () => {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user) {
            dispatch({ type: "login", payload: session.user });
            await fetchAvatar(session.user.id);
          }
        } catch (err) {
          console.error("Error restoring session:", err);
        }
      };

      const fetchAvatar = async (userId) => {
        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("avatar_url")
            .eq("id", userId)
            .single();
          if (!error) {
            dispatch({
              type: "set_avatar",
              payload: profile?.avatar_url || null,
            });
          }
        } catch (err) {
          console.error("Error fetching avatar:", err);
        }
      };

      restoreSession();

      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            dispatch({ type: "login", payload: session.user });
            fetchAvatar(session.user.id);
          } else {
            dispatch({ type: "logout" });
          }
        },
      );

      return () => data.subscription.unsubscribe();
    }, []);

  // =======================
  // Signup
  // =======================
  const signup = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("User not created");

      // create profile row
      await supabase.from("profiles").insert({
        id: data.user.id,
        username: name,
      });

      dispatch({ type: "login", payload: data.user });
    } catch (err) {
      dispatch({ type: "errors", payload: err?.message || err });
    }
  };

  // =======================
  // Login
  // =======================
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Login failed");

      dispatch({ type: "login", payload: data.user });

      // fetch avatar
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", data.user.id)
        .single();

      if (!profileError) {
        dispatch({ type: "set_avatar", payload: profile?.avatar_url || null });
      }
    } catch (err) {
      dispatch({ type: "errors", payload: err?.message || err });
    }
  };

  // =======================
  // Logout
  // =======================
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: "logout" });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        avatarUrl,
        errors,
        setAvatarUrl: (url) => dispatch({ type: "set_avatar", payload: url }),
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =======================
// useAuth Hook
// =======================
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
