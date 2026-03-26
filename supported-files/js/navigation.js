// ===================== NAVIGATION =====================
window.MechNav = (function () {
  const items   = document.querySelectorAll('.sb-item');
  const hero    = document.getElementById('heroSection');
  const sidebar = document.getElementById('sidebar');

  function setActive(pageId) {
    items.forEach(function (item) {
      if (item.dataset.page === pageId) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('active');
      }
    });

    // Show/hide hero
    if (hero) hero.style.display = pageId === 'home' ? '' : 'none';
  }

  // Wire up clicks
  items.forEach(function (item) {
    item.addEventListener('click', function () {
      const pageId = item.dataset.page;
      setActive(pageId);
      window.MechRouter && window.MechRouter.navigate(pageId);

      // Close mobile sidebar
      if (window.innerWidth <= 900 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
  }

  // Keyboard navigation (sidebar scroll)
  document.addEventListener('keydown', function (e) {
    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const scroll = document.getElementById('sb-scroll');
    if (!scroll) return;

    const moves = {
      ArrowDown: 80,
      ArrowUp: -80,
      PageDown: scroll.clientHeight * 0.9,
      PageUp: -scroll.clientHeight * 0.9
    };

    if (moves[e.key] !== undefined) {
      e.preventDefault();
      scroll.scrollBy({ top: moves[e.key], behavior: 'smooth' });
    }
    if (e.key === 'Home') { e.preventDefault(); scroll.scrollTo({ top: 0, behavior: 'smooth' }); }
    if (e.key === 'End')  { e.preventDefault(); scroll.scrollTo({ top: scroll.scrollHeight, behavior: 'smooth' }); }
  });

  return { setActive: setActive };
})();