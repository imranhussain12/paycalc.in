/* Income Tax Calculator — FY 2026-27 (AY 2027-28), new regime under the Income-tax Act, 2025 */
(function () {
  'use strict';
  function val(id) { return document.getElementById(id); }

  /* New-regime slabs (₹, annual) */
  var SLABS = [
    { upto: 400000, rate: 0 },
    { upto: 800000, rate: 0.05 },
    { upto: 1200000, rate: 0.10 },
    { upto: 1600000, rate: 0.15 },
    { upto: 2000000, rate: 0.20 },
    { upto: 2400000, rate: 0.25 },
    { upto: Infinity, rate: 0.30 }
  ];
  var STD_DEDUCTION = 75000;
  var REBATE_LIMIT = 1200000; /* taxable income up to which s.87A rebate makes tax nil */

  function slabTax(taxable) {
    var tax = 0, prev = 0;
    for (var i = 0; i < SLABS.length; i++) {
      var upper = Math.min(taxable, SLABS[i].upto);
      if (upper > prev) tax += (upper - prev) * SLABS[i].rate;
      prev = SLABS[i].upto;
      if (taxable <= prev) break;
    }
    return tax;
  }

  window.recalc = function () {
    var gross = parseNum(val('grossIncome').value);
    var isSalaried = val('isSalaried').checked;
    var npsEmployer = parseNum(val('npsEmployer').value);

    if (!gross || gross <= 0) {
      val('emptyState').hidden = false;
      val('resultContent').hidden = true;
      return;
    }
    val('emptyState').hidden = true;
    val('resultContent').hidden = false;

    var stdDed = isSalaried ? STD_DEDUCTION : 0;
    var deductions = stdDed + npsEmployer;
    var taxable = Math.max(0, gross - deductions);

    var tax = slabTax(taxable);
    var rebateApplied = false, marginalRelief = false;

    if (taxable <= REBATE_LIMIT) {
      tax = 0;
      rebateApplied = true;
    } else {
      /* Marginal relief just above ₹12 lakh: tax capped at income above ₹12 lakh */
      var excess = taxable - REBATE_LIMIT;
      if (tax > excess) { tax = excess; marginalRelief = true; }
    }

    /* Surcharge for high incomes (new regime, capped at 25%) */
    var surchargeRate = 0;
    if (taxable > 20000000) surchargeRate = 0.25;
    else if (taxable > 10000000) surchargeRate = 0.15;
    else if (taxable > 5000000) surchargeRate = 0.10;
    var surcharge = tax * surchargeRate;

    var cess = (tax + surcharge) * 0.04;
    var total = Math.round(tax + surcharge + cess);

    val('taxOut').textContent = formatINR(total);
    val('taxNote').textContent = rebateApplied ? 'No tax — Section 87A rebate applies (taxable income ≤ ₹12,00,000)'
      : marginalRelief ? 'Marginal relief applied' : 'Effective rate ' + ((total / gross) * 100).toFixed(1) + '% of gross';
    val('rGross').textContent = formatINR(gross);
    val('rStdDed').textContent = '− ' + formatINR(stdDed);
    val('rNps').textContent = '− ' + formatINR(npsEmployer);
    val('rTaxable').textContent = formatINR(taxable);
    val('rSlabTax').textContent = formatINR(Math.round(tax));
    val('rSurcharge').textContent = formatINR(Math.round(surcharge));
    val('rCess').textContent = formatINR(Math.round(cess));
    val('rTotal').textContent = formatINR(total);
    val('rMonthly').textContent = formatINR(Math.round(total / 12));
  };
})();
