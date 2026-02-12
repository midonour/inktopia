import { useAuth } from "../Contexts/AuthContext";
import supabase from "../Configs/SupabaseConfig";
import { useState } from "react";
export default function useAvatar(userId) {
  const { setAvatarUrl } = useAuth();
  const [loading, setLoading] = useState(false);
  console.log("useAvatar userId:", userId);
  // const uploadOrUpdateAvatar = async (file) => {
  //   if (!file || !userId) return;

  //   try {
  //     setLoading(true);

  //     const fileExt = file.name.split(".").pop();
  //     const filePath = `avatars/${userId}.${fileExt}`;
  //     // console.log("Avatar uploaded successfully to storage:", filePath, file);

  //     const { data: storagedata, error } = await supabase.storage
  //       .from("profileAvatars")
  //       .upload(filePath, file, { upsert: true });

  //     if (error) {
  //       throw error;
  //     }

  //     const { data } = supabase.storage
  //       .from("profileAvatars")
  //       .getPublicUrl(filePath);

  //     const avatarUrl = data.publicUrl;

  //     await supabase
  //       .from("profiles")
  //       .update({ avatar_url: avatarUrl })
  //       .eq("id", userId);

  //     // 👑 التحديث العالمي
  //     setAvatarUrl(avatarUrl);
  //     // console.log("Avatar updated successfully:", avatarUrl);
  //   } catch (err) {
  //     console.error("Avatar error:", err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const uploadOrUpdateAvatar = async (file) => {
    if (!file || !userId) return;

    try {
      setLoading(true);

      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${userId}.${fileExt}`;

      // استبدال مباشر
      const { error: uploadError } = await supabase.storage
        .from("profileAvatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profileAvatars")
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl + `?t=${Date.now()}`; // 🔥 يكسر الكاش

      await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);

      setAvatarUrl(avatarUrl);
    } catch (err) {
      console.error("Avatar error:", err.message);
    } finally {
      setLoading(false);
    }
  };
  return { uploadOrUpdateAvatar, loading };
}
