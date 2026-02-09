import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../Configs/SupabaseConfig";
import { useAuth } from "../Contexts/AuthContext";
import "../Styles/ProfilePage.css";
import Loader from "../Components/Loader";
export default function ProfilePage() {
  const { user, avatarUrl, setAvatarUrl } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;
  const [profile, setProfile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // console.log("ProfilePage user:", profile?.avatar_url);

  // console.log("User in ProfilePage:", user);
  // =======================
  // Fetch profile + bookmarks
  // =======================
  useEffect(() => {
    if (!userId) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Profile info
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        setProfile(profileData);

        // 2️⃣ Bookmarks
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from("bookmarks")
          .select(
            `
            id,
            created_at,
            books (
              id,
              title,
              author,
              cover_url
            )
          `,
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (bookmarkError) throw bookmarkError;

        setBookmarks(bookmarkData || []);
      } catch (err) {
        console.error("Profile fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // =======================
  // Remove bookmark
  // =======================
  const removeBookmark = async (bookmarkId) => {
    try {
      await supabase.from("bookmarks").delete().eq("id", bookmarkId);

      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (err) {
      console.error("Remove bookmark error:", err.message);
    }
  };
  
  if (!userId) return <p>Please login to view your profile.</p>;
  if (loading) return <Loader>Loading profile...</Loader>;
// console.log("avatarUrl in ProfilePage:", profile?.avatar_url);
  return (
    <div className="profile-container">
      {/* =======================
          Profile Header
      ======================= */}
      <div className="profile-header">
        <img
          src={
            avatarUrl || profile?.avatar_url || "https://via.placeholder.com/120?text=Avatar"
          }
          alt="Avatar"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{user.user_metadata.name || "Unnamed User"}</h2>
          <p>{user.email}</p>
          <span className="joined-date">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="avatar-upload-wrapper">
          <span className="custom-avatar-upload">
            <i className="fa-solid fa-upload"></i> Avatar
          </span>
          <input type="file" accept="image/*" onChange={(e) => setAvatarUrl(e.target.files[0])} />
        </div>
      </div>

      {/* =======================
          Bookmarks Section
      ======================= */}
      <div className="profile-section">
        <h3>📚 My Bookmarks</h3>

        {bookmarks.length === 0 ? (
          <p className="empty-text">No bookmarked books yet.</p>
        ) : (
          <div className="bookmarks-grid">
            {bookmarks.map((bm) => (
              <div key={bm.id} className="bookmark-card">
                {bm.books?.cover_url ? (
                  <img
                    src={bm.books.cover_url}
                    alt={bm.books.title}
                    className="bookmark-cover"
                  />
                ) : (
                  <div className="bookmark-cover placeholder">No Image</div>
                )}

                <div className="bookmark-info">
                  <h4>{bm.books?.title}</h4>
                  <p>{bm.books?.author || "Unknown Author"}</p>
                </div>

                <div className="bookmark-actions">
                  <button
                    className="read-btn"
                    onClick={() => navigate(`/bookDetails/${bm.books.id}`)}
                  >
                    Read
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => removeBookmark(bm.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
