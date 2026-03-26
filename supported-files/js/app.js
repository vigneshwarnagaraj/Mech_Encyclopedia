// ===================== APP BOOTSTRAP =====================
(function () {
  // Wire theme buttons
  var themeBtn    = document.getElementById('themeBtn');
  var themeBtnMob = document.getElementById('themeBtnMobile');
  if (themeBtn)    themeBtn.addEventListener('click', function () { window.MechTheme.toggle(); });
  if (themeBtnMob) themeBtnMob.addEventListener('click', function () { window.MechTheme.toggle(); });

  // When router navigates, update nav active state
  window.MechRouter.onNavigate(function (pageId) {
    window.MechNav.setActive(pageId);
  });

  // Load initial page from hash, or default to home
  var initialPage = window.MechRouter.getPageFromHash() || 'home';
  window.MechNav.setActive(initialPage);
  window.MechRouter.navigate(initialPage, false);
})();