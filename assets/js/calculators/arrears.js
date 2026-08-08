/* 8th CPC Arrears Calculator */
(function () {
  'use strict';
  function val(id) { return document.getElementById(id); }

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  document.addEventListener('DOMContentLoaded', function () {
    var sel = val('implMonth');
    if (!sel) return;
    /* Options: Jul 2026 → Dec 2028 */
    for (var y = 2026; y <= 2028; y++) {
      for (var m = 0; m < 12; m++) {
        if (y === 2026 && m < 6) continue;
        var opt = document.createElement('option');
        opt.value = y + '-' + m;
        opt.textContent = MONTHS[m] + ' ' + y;
        sel.appendChild(opt);
      }
    }
    sel.value = '2027-4'; /* May 2027 default */
  });

  window.recalc = function () {
    var basic = parseNum(val('basicPay').value);
    var factorChoice = document.querySelector('input[name="fitment"]:checked');
    var factor = factorChoice ? factorChoice.value : '2.57';
    if (factor === 'custom') {
      factor = parseNum(val('customFactor').value) || 2.57;
      val('customFactorWrap').hidden = false;
    } else {
      factor = parseFloat(factor);
      val('customFactorWrap').hidden = true;
    }
    var daRate = parseNum(val('daRate').value) / 100;

    if (!basic || basic <= 0) {
      val('emptyState').hidden = false;
      val('resultContent').hidden = true;
      return;
    }
    val('emptyState').hidden = true;
    val('resultContent').hidden = false;

    var parts = val('implMonth').value.split('-');
    var implY = parseInt(parts[0], 10), implM = parseInt(parts[1], 10);
    /* Months from Jan 2026 through the implementation month (inclusive) */
    var nMonths = (implY - 2026) * 12 + implM + 1;
    if (nMonths < 0) nMonths = 0;

    var newBasic = Math.round(basic * factor);
    var curTotal = basic + basic * daRate; /* basic + DA under 7th CPC */
    var monthlyDiff = Math.max(0, newBasic - curTotal);
    var total = monthlyDiff * nMonths;

    val('arrearsOut').textContent = formatINR(total);
    val('arrearsWords').textContent = total > 0 ? 'about ' + inWords(total) + ' for ' + nMonths + ' months' : '';
    val('rNewBasic').textContent = formatINR(newBasic);
    val('rCurTotal').textContent = formatINR(curTotal);
    val('rMonthlyDiff').textContent = formatINR(monthlyDiff);
    val('rMonths').textContent = nMonths + ' months (Jan 2026 – ' + MONTHS[implM] + ' ' + implY + ')';

    /* Month-by-month table (grouped by year for compactness) */
    var tbody = val('monthTableBody');
    tbody.innerHTML = '';
    var running = 0;
    for (var i = 0; i < nMonths; i++) {
      var y = 2026 + Math.floor(i / 12);
      var m = i % 12;
      running += monthlyDiff;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + MONTHS[m] + ' ' + y + '</td><td>' + formatINR(monthlyDiff) + '</td><td>' + formatINR(running) + '</td>';
      tbody.appendChild(tr);
    }
  };
})();
