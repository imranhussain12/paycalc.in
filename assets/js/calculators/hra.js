/* HRA Calculator for Central Government employees */
(function () {
  'use strict';
  function val(id) { return document.getElementById(id); }

  var RATES = { X: 0.27, Y: 0.18, Z: 0.09 };
  var MINIMUMS = { X: 5400, Y: 3600, Z: 1800 }; /* HRA floor per 7th CPC (30%/20%/10% of ₹18,000 basis) */

  window.recalc = function () {
    var basic = parseNum(val('basicPay').value);
    var city = val('hraCity').value;
    if (!basic || basic <= 0) {
      val('emptyState').hidden = false;
      val('resultContent').hidden = true;
      return;
    }
    val('emptyState').hidden = true;
    val('resultContent').hidden = false;

    var rate = RATES[city];
    var hra = Math.max(Math.round(basic * rate), MINIMUMS[city]);
    var floorApplied = basic * rate < MINIMUMS[city];

    val('hraOut').textContent = formatINR(hra);
    val('hraNote').textContent = Math.round(rate * 100) + '% of ' + formatINR(basic) + (floorApplied ? ' (minimum HRA applied)' : '');
    val('rBasic').textContent = formatINR(basic);
    val('rHra').textContent = formatINR(hra);
    val('rAnnual').textContent = formatINR(hra * 12);
    val('rTotal').textContent = formatINR(basic + hra);
    val('floorNote').hidden = !floorApplied;
  };
})();
