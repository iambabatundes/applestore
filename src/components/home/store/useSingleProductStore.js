import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSingleProductStore = create(
  persist(
    (set) => ({
      selectedMedia: null,
      isZoomed: false,
      fadeClass: "visible",
      selectedImage: "",

      setSelectedMedia: (media) => set({ selectedMedia: media }),
      setIsZoomed: (zoomed) => set({ isZoomed: zoomed }),
      setFadeClass: (cls) => set({ fadeClass: cls }),
      setSelectedImage: (img) => set({ selectedImage: img }),
      resetMediaState: () =>
        set({
          selectedMedia: null,
          isZoomed: false,
          fadeClass: "visible",
          selectedImage: "",
        }),
    }),
    {
      name: "product-media-state", // localStorage key
    }
  )
);
