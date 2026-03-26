// ===================== MATHJAX RE-RENDER =====================
window.MechMath = (function () {
  function retypeset(element) {
    if (!window.MathJax || !window.MathJax.typesetPromise) return;
    const target = element || document.body;
    window.MathJax.typesetPromise([target]).catch(function (err) {
      console.warn('[MathJax] Typeset error:', err);
    });
  }

  // Initial full typeset after window loads
  window.addEventListener('load', function () {
    retypeset();
  });

  return { retypeset: retypeset };
})();