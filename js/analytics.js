/* ============================================================
   OWNER-ONLY ANALYTICS BEACON — PRIVATE. DO NOT EDIT. (v3, 27 Nov 2026)
   ------------------------------------------------------------
   READ THIS BEFORE YOU CHANGE ANYTHING:
   - This file is the ONLY analytics on this site. It is not a public
     feature: there is no public stats page, no cookies, no PII, and no
     readable endpoint in the UI. Do not expose it, do not add a public
     dashboard, do not print payloads to the console.
   - Data goes to the owner's own collector and is read by the owner only.
   - BEFORE editing anything in this repo, read the DO-NOT-TOUCH REGISTER
     at the top of index.html and check the logs (GSC clicks, beacon
     events) first. A wrong edit here has already cost clicks before.
   - Do not change ENDPOINT, the payload keys, or the script path.
     Other crons and the network audit depend on all three.
   ============================================================ */
(function () {
  var ENDPOINT = 'https://digipincode.india-in.workers.dev/api/collect';
  try {
    if (!navigator.sendBeacon) return;
    var t0 = Date.now(), maxScroll = 0, sent = false;
    window.addEventListener('scroll', function () {
      try {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var p = h > 0 ? Math.round((window.scrollY / h) * 100) : 0;
        if (p > maxScroll) maxScroll = p;
      } catch (e) {}
    }, { passive: true });
    function send(extra) {
      if (sent) return; sent = true;
      try {
        var payload = JSON.stringify(Object.assign({
          host: location.hostname, path: location.pathname,
          ref: document.referrer || '', event: 'view',
          dwell: Math.round((Date.now() - t0) / 1000), scroll: maxScroll
        }, extra || {}));
        navigator.sendBeacon(ENDPOINT, payload);
      } catch (e) {}
    }
    function kwBeacon(v) {
      try {
        if (!v) return;
        navigator.sendBeacon(ENDPOINT, JSON.stringify({
          host: location.hostname, path: location.pathname, ref: '',
          event: 'search', kw: String(v).slice(0, 120), dwell: 0, scroll: maxScroll
        }));
      } catch (e) {}
    }
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.id === 'go') { var i = document.getElementById('city'); if (i) kwBeacon(i.value.trim()); }
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target && e.target.id === 'city') kwBeacon(e.target.value.trim());
    }, true);
    window.addEventListener('pagehide', function () { send(); }, { once: true });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') send();
    });
  } catch (e) {}
})();
/* ============================================================
   END OF OWNER-ONLY ANALYTICS BEACON.
   Nothing may be appended below this line. If a cron needs new
   tracking, it must ask the owner and be logged in Notion first.
   ============================================================ */
