import { Switch } from "@mui/material";
import { FaMoon, FaSun } from "react-icons/fa";

export default function SidebarDarkModeToggle({ darkMode, toggleDarkMode }) {
  return (
    <div className="admin-navbar__dark-mode-toggles">
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        color="default"
        icon={<FaMoon />}
        checkedIcon={<FaSun />}
        inputProps={{ "aria-label": "dark mode toggle" }}
      />
    </div>
  );
}
