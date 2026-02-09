import { useAuth } from "../Contexts/AuthContext";
import supabase from "../Configs/SupabaseConfig";
import { useState } from "react";
export default function useAvatar(userId) {
  const { setAvatarUrl } = useAuth();
  const [loading, setLoading] = useState(false);

  const uploadOrUpdateAvatar = async (file) => {
    if (!file || !userId) return;

    try {
      setLoading(true);

      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${userId}.${fileExt}`;

      await supabase.storage
        .from("profileAvatars")
        .upload(filePath, file, { upsert: true });

      const { data } = supabase.storage
        .from("profileAvatars")
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);

      // 👑 التحديث العالمي
      setAvatarUrl(avatarUrl);
    } catch (err) {
      console.error("Avatar error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return { uploadOrUpdateAvatar, loading };
}
