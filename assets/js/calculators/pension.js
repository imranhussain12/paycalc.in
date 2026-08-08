/* 8th CPC Pension Revision Calculator */
(function () {
  'use strict';
  function val(id) { return document.getElementById(id); }

  window.recalc = function () {
    var pension = parseNum(val('basicPension').value);
    var factorChoice = document.querySelector('input[name="fitment"]:checked');
    var factor = factorChoice ? factorChoice.value : '2.57';
    if (factor === 'custom') {
      factor = parseNum(val('customFactor').value) || 2.57;
      val('customFactorWrap').hidden = false;
    } else {
      factor = parseFloat(factor);
      val('customFactorWrap').hidden = true;
    }
    var commPct = Math.min(40, Math.max(0, parseNum(val('commPct').value))) / 100;
    var drRate = parseNum(val('drRate').value) / 100;

    if (!pension || pension <= 0) {
      val('emptyState').hidden = false;
      val('resultContent').hidden = true;
      return;
    }
    val('emptyState').hidden = true;
    val('resultContent').hidden = false;

    var revised = Math.round(pension * factor);
    var commuted = Math.round(revised * commPct);
    var afterComm = revised - commuted;
    /* Commutation factor 8.194 (age 60 next birthday, per CCS Commutation Table) */
    var lumpSum = Math.round(commuted * 12 * 8.194);
    /* Family pension: normally 30% of last pay; pension is 50% of last pay → family pension ≈ 60% of revised pension, floor ₹9,000 under 7th CPC */
    var familyPension = Math.max(9000, Math.round(revised * 0.6));
    var dr = Math.round(revised * drRate);

    val('revisedOut').textContent = formatINR(revised);
    val('factorNote').textContent = formatINR(pension) + ' × ' + factor;
    val('rRevised').textContent = formatINR(revised);
    val('rCommuted').textContent = formatINR(commuted) + ' (' + Math.round(commPct * 100) + '%)';
    val('rAfterComm').textContent = formatINR(afterComm);
    val('rLumpSum').textContent = formatINR(lumpSum);
    val('rFamily').textContent = formatINR(familyPension);
    val('rDr').textContent = formatINR(dr) + ' (' + Math.round(drRate * 100) + '%)';
    val('rTotalMonthly').textContent = formatINR(afterComm + dr);
  };
})();
