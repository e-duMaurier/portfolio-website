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
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
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

(function () {
  /* find every block: Chroma wraps some blocks in .highlight, others are bare <pre> */
  const blocks = document.querySelectorAll(".highlight, pre");
  for (const block of blocks) {
    if (block.matches("pre") && block.closest(".highlight")) continue;
    const code = block.querySelector("code");
    if (!code || !code.innerText.trim()) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-code";
    btn.setAttribute("aria-label", "Copy code");
    btn.title = "Copy code";
    btn.innerHTML =
      '<i class="bi bi-clipboard" aria-hidden="true"></i><span>Copy</span>';
    btn.addEventListener("click", () => {
      const text = code.innerText.replace(/\n$/, "");
      const done = () => {
        btn.innerHTML =
          '<i class="bi bi-check-lg" aria-hidden="true"></i><span>Copied</span>';
        btn.setAttribute("aria-label", "Copied");
        setTimeout(() => {
          btn.innerHTML =
            '<i class="bi bi-clipboard" aria-hidden="true"></i><span>Copy</span>';
          btn.setAttribute("aria-label", "Copy code");
        }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      }
    });
    block.classList.add("has-copy");
    block.prepend(btn);
  }
})();
