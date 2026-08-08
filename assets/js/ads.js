/**
 * PayCalc.in AdSense Loader
 * ─────────────────────────
 * HOW TO ACTIVATE ADS (after AdSense approves paycalc.in):
 *
 * 1. AdSense → Ads → By ad unit → create Display ad units and copy the
 *    data-ad-slot numbers into AD_SLOTS below.
 * 2. Set ENABLED = true
 * 3. git add / commit / push — ads appear on all pages automatically.
 *
 * Current behaviour:
 *  • The base AdSense script ALWAYS loads (so the integration is live for
 *    Google's review and Auto ads can serve once approved).
 *  • ENABLED = false → the "Advertisement" placeholder boxes are HIDDEN
 *    (no blank ad slots shown to visitors or the AdSense reviewer).
 *  • ENABLED = true  → placeholders are replaced with responsive ad units.
 */

var ADSENSE_CONFIG = {
  ENABLED: false,                          // ← change to true when ready

  PUBLISHER_ID: 'ca-pub-5113767241283269',

  /* data-ad-slot ids by placeholder position (create in AdSense → Ads) */
  AD_SLOTS: {
    'ad-top': 'XXXXXXXXXX',                // above calculator (leaderboard / responsive)
    'ad-mid': 'XXXXXXXXXX',                // between calculator and article
    'ad-article': 'XXXXXXXXXX',            // in-article
    'ad-footer': 'XXXXXXXXXX'              // above footer
  }
};

(function () {
  'use strict';

  /* Load the base AdSense script (required for review + Auto ads), but keep it
     off the critical path: it is ~250KB of third-party JS that must not delay
     first paint or the calculator becoming interactive. */
  function loadAdSense() {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CONFIG.PUBLISHER_ID;
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }

  function scheduleAdSense() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadAdSense, { timeout: 3000 });
    } else {
      setTimeout(loadAdSense, 1200);
    }
  }

  if (document.readyState === 'complete') scheduleAdSense();
  else window.addEventListener('load', scheduleAdSense);

  function initSlots() {
    var slots = document.querySelectorAll('.ad-slot');
    slots.forEach(function (slot) {
      if (!ADSENSE_CONFIG.ENABLED) {
        slot.style.display = 'none';
        return;
      }
      var slotId = ADSENSE_CONFIG.AD_SLOTS[slot.id];
      if (!slotId || slotId.indexOf('X') === 0) { slot.style.display = 'none'; return; }
      slot.classList.add('ad-slot-live');
      slot.innerHTML = '<ins class="adsbygoogle" style="display:block" ' +
        'data-ad-client="' + ADSENSE_CONFIG.PUBLISHER_ID + '" ' +
        'data-ad-slot="' + slotId + '" ' +
        'data-ad-format="auto" data-full-width-responsive="true"></ins>';
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlots);
  } else {
    initSlots();
  }
})();
