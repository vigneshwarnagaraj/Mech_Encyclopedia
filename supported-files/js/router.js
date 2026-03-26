// ===================== ROUTER =====================
// Hash-based routing: #home, #constants, etc.
// Falls back gracefully when hash is not present.

window.MechRouter = (function () {
  const BASE_PATH = 'supported-files/pages/';
  let currentPage = null;
  let onNavigateCallback = null;

  function getPageFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'home';
  }

  function setHash(pageId) {
    history.pushState(null, '', '#' + pageId);
  }

  function navigate(pageId, updateHash) {
    if (pageId === currentPage) return;
    currentPage = pageId;

    if (updateHash !== false) setHash(pageId);

    const container = document.getElementById('page-container');
    const loading   = document.getElementById('page-loading');
    const errorDiv  = document.getElementById('page-error');

    if (!container) return;

    // Show loading state
    container.innerHTML = '';
    if (loading) loading.style.display = 'block';
    if (errorDiv) errorDiv.style.display = 'none';

    const url = BASE_PATH + pageId + '.html';

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        if (loading) loading.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.className = 'page-content';
        wrapper.innerHTML = html;
        container.appendChild(wrapper);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-render MathJax
        window.MechMath && window.MechMath.retypeset(wrapper);

        // Fire callback
        if (typeof onNavigateCallback === 'function') {
          onNavigateCallback(pageId);
        }
      })
      .catch(function (err) {
        if (loading) loading.style.display = 'none';
        if (errorDiv) {
          errorDiv.style.display = 'block';
          errorDiv.innerHTML = '<div class="danger"><strong>Error:</strong> Could not load page "' + pageId + '". ' +
            'Make sure you are running from a web server (not file://). ' +
            'Details: ' + err.message + '</div>';
          container.appendChild(errorDiv);
        }
        console.error('[Router] Failed to load page:', pageId, err);
      });
  }

  function onNavigate(fn) {
    onNavigateCallback = fn;
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function () {
    const pageId = getPageFromHash();
    navigate(pageId, false);
    window.MechNav && window.MechNav.setActive(pageId);
  });

  return {
    navigate: navigate,
    onNavigate: onNavigate,
    current: function () { return currentPage; },
    getPageFromHash: getPageFromHash
  };
})();