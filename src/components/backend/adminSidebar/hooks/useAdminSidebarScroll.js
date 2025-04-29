import { useEffect } from "react";
import { useAdminSidebarStore } from "../../store/adminSideBarStore";

export const useAdminSidebarScroll = () => {
  const { lastScrollY, setLastScrollY, setIsHidden } = useAdminSidebarStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHidden(currentScrollY > lastScrollY && currentScrollY > 100);
      setLastScrollY(currentScrollY);
    };

    if (window.innerWidth > 1024) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, setIsHidden, setLastScrollY]);
};
