import { useState } from "react";

const readTheme = () => document.documentElement.getAttribute("data-theme") === "dark";

export default function ThemeToggle() {
  const [dark, setDark] = useState(readTheme);

  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage can be blocked; the theme still changes for this visit */
    }
    setDark(!dark);
  }

  return (
    <button
      type="button"
      className="theme"
      onClick={toggle}
      aria-label={dark ? "Switch to birana parchment theme" : "Switch to dark theme"}
    >
      {dark ? (
        <>
          <span className="g" aria-hidden="true">ብራና</span> Birana
        </>
      ) : (
        <>☾ Dark</>
      )}
    </button>
  );
}
