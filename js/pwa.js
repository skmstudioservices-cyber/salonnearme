/* PWA registration — owner-safe, no cache of /api/* (27 Nov 2026).
   Guard: read the DO-NOT-TOUCH REGISTER in index.html before editing. */
(function () {
  try {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    });
  } catch (e) {}
})();
