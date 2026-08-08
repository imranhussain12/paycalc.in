/* PayCalc.in — shared helpers */
(function () {
  'use strict';

  /* Indian number formatting: 125000 -> 1,25,000 */
  window.formatINR = function (n, opts) {
    opts = opts || {};
    if (n === null || n === undefined || isNaN(n)) return '—';
    var rounded = Math.round(n);
    var sign = rounded < 0 ? '−' : '';
    var s = Math.abs(rounded).toString();
    var last3 = s.slice(-3);
    var rest = s.slice(0, -3);
    if (rest) last3 = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
    return (opts.plain ? '' : '₹') + sign + last3;
  };

  /* Words form for large amounts: 1250000 -> "12.5 lakh" */
  window.inWords = function (n) {
    if (isNaN(n)) return '';
    var abs = Math.abs(n);
    if (abs >= 1e7) return (n / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' crore';
    if (abs >= 1e5) return (n / 1e5).toFixed(2).replace(/\.?0+$/, '') + ' lakh';
    if (abs >= 1e3) return (n / 1e3).toFixed(1).replace(/\.?0+$/, '') + ' thousand';
    return String(Math.round(n));
  };

  /* Parse a user-typed number (allows commas) */
  window.parseNum = function (v) {
    if (typeof v === 'number') return v;
    var n = parseFloat(String(v || '').replace(/[,₹\s]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  /* Mobile nav */
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.mobile-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* Live recalculation wiring: any element with [data-calc] triggers recalc() */
    if (typeof window.recalc === 'function') {
      var inputs = document.querySelectorAll('[data-calc]');
      inputs.forEach(function (el) {
        el.addEventListener('input', window.recalc);
        el.addEventListener('change', window.recalc);
      });
      window.recalc();
    }
  });
})();
