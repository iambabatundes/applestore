import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminSidebarStore = create(
  persist(
    (set) => ({
      isCollapsed: false,
      isHidden: false,
      lastScrollY: 0,

      setIsCollapsed: (value) => set({ isCollapsed: value }),
      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      setIsHidden: (value) => set({ isHidden: value }),
      setLastScrollY: (value) => set({ lastScrollY: value }),
    }),
    {
      name: "admin-sidebar-storage",
    }
  )
);
