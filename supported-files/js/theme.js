// ===================== THEME =====================
(function () {
  const html = document.documentElement;
  const saved = localStorage.getItem('mechTheme');
  let darkMode = saved ? saved === 'dark' : true;

  function applyTheme(dark) {
    darkMode = dark;
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('mechTheme', dark ? 'dark' : 'light');
    const icon = dark ? '🌙' : '☀️';
    const btn = document.getElementById('themeBtn');
    const mob = document.getElementById('themeBtnMobile');
    if (btn) btn.textContent = icon;
    if (mob) mob.textContent = icon;
  }

  // Apply on load immediately
  applyTheme(darkMode);

  // Expose for other modules
  window.MechTheme = {
    toggle: function () { applyTheme(!darkMode); },
    setDark: function (d) { applyTheme(d); },
    isDark: function () { return darkMode; }
  };
})();