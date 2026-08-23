(function () {
  const toggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const html = document.documentElement;
  function applyTheme(theme) {
    html.classList.toggle("dark", theme === "dark");
    if (themeIcon) {
      themeIcon.className =
        theme === "dark" ? "bi bi-moon-fill" : "bi bi-sun-fill";
    }
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }
  function setTheme(theme) {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }
  const urlTheme = new URLSearchParams(location.search).get("theme");
  if (urlTheme === "dark" || urlTheme === "light") {
    applyTheme(urlTheme);
  } else {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
  }
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = html.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
    });
  }
})();
