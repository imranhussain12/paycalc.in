/* Take-Home Pay Calculator for Central Government employees */
(function () {
  'use strict';
  function val(id) { return document.getElementById(id); }

  var HRA_RATES = { X: 0.30, Y: 0.20, Z: 0.10, NONE: 0 };
  /* Transport Allowance (TPTA): higher rate for Level 9+, TPTA cities get higher slab */
  function transportAllowance(levelBand, tptaCity) {
    if (levelBand === 'L9plus') return tptaCity ? 7200 : 3600;
    if (levelBand === 'L3to8') return tptaCity ? 3600 : 1800;
    return tptaCity ? 1350 : 900; /* Levels 1–2 */
  }

  /* New-regime tax FY 2026-27 (same engine as income-tax.js, simplified) */
  function annualTax(grossAnnual) {
    var taxable = Math.max(0, grossAnnual - 75000);
    var SLABS = [
      [400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15],
      [2000000, 0.20], [2400000, 0.25], [Infinity, 0.30]
    ];
    var tax = 0, prev = 0;
    for (var i = 0; i < SLABS.length; i++) {
      var upper = Math.min(taxable, SLABS[i][0]);
      if (upper > prev) tax += (upper - prev) * SLABS[i][1];
      prev = SLABS[i][0];
      if (taxable <= prev) break;
    }
    if (taxable <= 1200000) return 0;
    var excess = taxable - 1200000;
    if (tax > excess) tax = excess;
    return Math.round(tax * 1.04); /* + 4% cess */
  }

  window.recalc = function () {
    var basic = parseNum(val('basicPay').value);
    var daRate = parseNum(val('daRate').value) / 100;
    var city = val('hraCity').value;
    var levelBand = val('levelBand').value;
    var tptaCity = val('tptaCity').checked;
    var otherAllow = parseNum(val('otherAllow').value);
    var npsRate = parseNum(val('npsRate').value) / 100;
    var cghs = parseNum(val('cghs').value);
    var otherDed = parseNum(val('otherDed').value);

    if (!basic || basic <= 0) {
      val('emptyState').hidden = false;
      val('resultContent').hidden = true;
      return;
    }
    val('emptyState').hidden = true;
    val('resultContent').hidden = false;

    var da = basic * daRate;
    var hra = basic * (HRA_RATES[city] || 0);
    var tpta = transportAllowance(levelBand, tptaCity);
    var tptaDA = tpta * daRate; /* DA is also paid on transport allowance */
    var gross = basic + da + hra + tpta + tptaDA + otherAllow;

    var nps = (basic + da) * npsRate;
    var taxMonthly = annualTax(gross * 12) / 12;
    var totalDed = nps + cghs + otherDed + taxMonthly;
    var net = gross - totalDed;

    val('netOut').textContent = formatINR(net);
    val('netNote').textContent = 'per month, after all deductions';
    val('rBasic').textContent = formatINR(basic);
    val('rDa').textContent = formatINR(da);
    val('rHra').textContent = formatINR(hra);
    val('rTpta').textContent = formatINR(tpta + tptaDA);
    val('rOtherAllow').textContent = formatINR(otherAllow);
    val('rGross').textContent = formatINR(gross);
    val('rNps').textContent = '− ' + formatINR(nps);
    val('rTax').textContent = '− ' + formatINR(taxMonthly);
    val('rCghs').textContent = '− ' + formatINR(cghs + otherDed);
    val('rNet').textContent = formatINR(net);
    val('rAnnualGross').textContent = formatINR(gross * 12);
    val('rAnnualNet').textContent = formatINR(net * 12);
  };
})();
