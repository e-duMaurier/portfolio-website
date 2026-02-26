(function() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;
  function setTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
      themeIcon.className = 'bi bi-moon-fill';
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      themeIcon.className = 'bi bi-sun-fill';
      localStorage.setItem('theme', 'light');
    }
  }
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = html.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  }
})();
