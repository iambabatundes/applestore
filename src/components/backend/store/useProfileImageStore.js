import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProfileImageStore = create(
  persist(
    (set) => ({
      //   profileImage: null,
      progress: 0,
      dragging: false,
      error: "",

      //   setProfileImage: (image) => set({ profileImage: image }),
      removeProfileImage: () => set({ profileImage: null, progress: 0 }),
      setProgress: (progress) => set({ progress }),
      setDragging: (dragging) => set({ dragging }),
      setError: (error) => set({ error }),

      resetProfileImageState: () =>
        set({ profileImage: null, progress: 0, dragging: false, error: "" }),
    }),
    {
      name: "profile-image-store",
    }
  )
);
