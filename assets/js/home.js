/* Homepage quick calculator — one number, no clicks.
   Deliberately self-contained so the homepage does not depend on the
   full calculator engine. */
(function () {
  'use strict';

  /* Level -> entry basic pay (7th CPC pay matrix, stage 1) */
  var LEVELS = [
    ['1', 18000], ['2', 19900], ['3', 21700], ['4', 25500], ['5', 29200],
    ['6', 35400], ['7', 44900], ['8', 47600], ['9', 53100], ['10', 56100],
    ['11', 67700], ['12', 78800], ['13', 123100], ['13A', 131100],
    ['14', 144200], ['15', 182200], ['16', 205400], ['17', 225000], ['18', 250000]
  ];
  var DA = 0.60;

  function inr(n) {
    if (!isFinite(n)) return '—';
    var s = String(Math.round(Math.abs(n)));
    var last3 = s.slice(-3), rest = s.slice(0, -3);
    if (rest) last3 = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
    return '₹' + (n < 0 ? '−' : '') + last3;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('qcBasic');
    var out = document.getElementById('qcValue');
    var delta = document.getElementById('qcDelta');
    var cta = document.getElementById('qcCta');
    var chipWrap = document.getElementById('levelChips');
    if (!input || !out) return;

    /* build the pay-matrix chips */
    LEVELS.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = 'L' + l[0];
      b.setAttribute('aria-pressed', 'false');
      /* Accessible name must start with the visible text ("L7") so a
         voice-control user saying "click L7" matches the button. */
      b.setAttribute('aria-label', 'L' + l[0] + ', Pay Level ' + l[0] + ', entry pay ' + inr(l[1]));
      b.addEventListener('click', function () {
        input.value = l[1];
        chipWrap.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        render();
      });
      chipWrap.appendChild(b);
    });

    function factor() {
      var f = document.querySelector('input[name="qcFactor"]:checked');
      return f ? parseFloat(f.value) : 2.57;
    }

    function render() {
      var basic = parseFloat(String(input.value).replace(/[^0-9.]/g, ''));
      if (!basic || basic <= 0) {
        out.textContent = '₹—';
        delta.innerHTML = 'Enter your basic pay, or tap your pay level below.';
        cta.href = '/tools/8th-pay-commission-calculator';
        return;
      }
      var f = factor();
      var newBasic = Math.round(basic * f);
      var nowTotal = basic * (1 + DA);
      var gain = newBasic - nowTotal;

      out.textContent = inr(newBasic);
      delta.innerHTML = gain > 0
        ? 'About <strong>' + inr(gain) + '</strong> a month more than your current Basic + DA of ' + inr(nowTotal) + '.'
        : 'At this factor, the new basic is below your current Basic + DA of ' + inr(nowTotal) + '.';
      cta.href = '/tools/8th-pay-commission-calculator?basic=' + Math.round(basic);
    }

    input.addEventListener('input', function () {
      chipWrap.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      render();
    });
    document.querySelectorAll('input[name="qcFactor"]').forEach(function (r) {
      r.addEventListener('change', render);
    });

    render();
  });
})();
