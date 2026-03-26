// ===================== SEARCH =====================
(function () {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function (e) {
    const q = e.target.value.toLowerCase().trim();
    const items  = document.querySelectorAll('.sb-item');
    const groups = document.querySelectorAll('.sb-group');

    if (!q) {
      items.forEach(function (item) { item.style.display = 'flex'; });
      groups.forEach(function (g) { g.style.display = ''; });
      return;
    }

    // Track which groups have visible children
    const groupVisibility = new Map();

    items.forEach(function (item) {
      const text    = item.textContent.toLowerCase();
      const visible = text.includes(q);
      item.style.display = visible ? 'flex' : 'none';

      // Find preceding group label
      let prev = item.previousElementSibling;
      while (prev && !prev.classList.contains('sb-group')) {
        prev = prev.previousElementSibling;
      }
      if (prev && prev.classList.contains('sb-group')) {
        if (visible) groupVisibility.set(prev, true);
      }
    });

    // Show/hide group headers based on whether any items matched
    groups.forEach(function (g) {
      g.style.display = groupVisibility.has(g) ? '' : 'none';
    });
  });
})();