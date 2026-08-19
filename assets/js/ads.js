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
 *  • The base AdSense script is loaded by the async <script> tag in each page's
 *    <head>. It lives in the HTML source because that is what AdSense's site
 *    verifier reads — do not move it back into JavaScript.
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

  /* The base AdSense script is loaded by the async <script> tag in each page's
     <head> — that is the snippet AdSense's site verifier looks for, so it must
     stay in the HTML source. This file must NOT inject it a second time. */

  function initSlots() {
    if (!ADSENSE_CONFIG.ENABLED) return;   /* CSS already hides placeholders */
    var slots = document.querySelectorAll('.ad-slot');
    slots.forEach(function (slot) {
      var slotId = ADSENSE_CONFIG.AD_SLOTS[slot.id];
      if (!slotId || slotId.indexOf('X') === 0) return;
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
