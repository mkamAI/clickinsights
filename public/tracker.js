/**
 * ClickInsights.AI Tracker
 * Paste this snippet before </body> on every page you want to track.
 * Replace SITE_ID with your actual site ID from the ClickInsights dashboard.
 *
 * <script src="https://clickinsights.ai/tracker.js" data-site-id="YOUR_SITE_ID" async></script>
 */
(function () {
  var script = document.currentScript || document.querySelector('script[data-site-id]');
  var SITE_ID = script && script.getAttribute('data-site-id');
  var API = 'https://clickinsights.ai/api/track';

  if (!SITE_ID) {
    console.warn('[ClickInsights] No data-site-id attribute found on tracker script.');
    return;
  }

  // Session
  var sessionId = (sessionStorage.getItem('ci_session') || Math.random().toString(36).substr(2, 12));
  sessionStorage.setItem('ci_session', sessionId);

  var pageStart = Date.now();
  var maxScroll = 0;
  var rageTaps = 0;
  var lastClick = { x: 0, y: 0, t: 0 };

  // ─── Send ────────────────────────────────────────────────────────────────────
  function send(payload) {
    var body = JSON.stringify(Object.assign({
      siteId: SITE_ID,
      sessionId: sessionId,
      url: window.location.pathname,
      referrer: document.referrer,
      timestamp: Date.now(),
      screen: window.innerWidth + 'x' + window.innerHeight,
      device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    }, payload));

    if (navigator.sendBeacon) {
      navigator.sendBeacon(API, body);
    } else {
      fetch(API, { method: 'POST', body: body, keepalive: true }).catch(function () {});
    }
  }

  // ─── Page View ───────────────────────────────────────────────────────────────
  send({ type: 'pageview', title: document.title });

  // ─── Scroll Depth ────────────────────────────────────────────────────────────
  window.addEventListener('scroll', function () {
    var scrolled = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );
    if (scrolled > maxScroll) maxScroll = Math.min(scrolled, 100);
  }, { passive: true });

  // ─── Click Tracking ──────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var now = Date.now();
    var dx = Math.abs(e.clientX - lastClick.x);
    var dy = Math.abs(e.clientY - lastClick.y);

    // Rage click: 3+ clicks within 700ms in same area
    if (now - lastClick.t < 700 && dx < 30 && dy < 30) {
      rageTaps++;
    } else {
      rageTaps = 1;
    }

    lastClick = { x: e.clientX, y: e.clientY, t: now };

    var el = e.target;
    send({
      type: 'click',
      xPct: Math.round((e.clientX / window.innerWidth) * 100),
      yPct: Math.round((e.clientY / window.innerHeight) * 100),
      tag: el.tagName,
      text: (el.innerText || el.value || '').slice(0, 60),
      rage: rageTaps >= 3,
    });
  });

  // ─── Exit ────────────────────────────────────────────────────────────────────
  window.addEventListener('beforeunload', function () {
    send({
      type: 'exit',
      timeOnPage: Date.now() - pageStart,
      scrollDepth: maxScroll,
    });
  });

  // ─── SPA Navigation (React/Next/Vue) ─────────────────────────────────────────
  var _pushState = history.pushState;
  history.pushState = function () {
    _pushState.apply(history, arguments);
    pageStart = Date.now();
    maxScroll = 0;
    send({ type: 'pageview', title: document.title });
  };

})();
