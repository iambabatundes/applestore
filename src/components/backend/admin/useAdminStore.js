import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAdminStore = create(
  persist(
    (set) => ({
      selectedLink: null,
      isMobileMenuOpen: false,
      selectedDropdownLink: null,
      darkMode: localStorage.getItem("darkMode") === "true",

      setSelectedLink: (link) => set({ selectedLink: link }),
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setSelectedDropdownLink: (link) => set({ selectedDropdownLink: link }),
      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.darkMode;
          localStorage.setItem("darkMode", newMode);
          return { darkMode: newMode };
        }),
    }),
    {
      name: "admin-ui-storage",
    }
  )
);

export default useAdminStore;
