/* 8th Pay Commission Salary Calculator */
(function () {
  'use strict';

  /* 7th CPC pay matrix entry pay (Level : entry basic ₹) — shared via window for other pages */
  window.PAY_LEVELS = [
    { level: '1',  entry: 18000,  max: 56900 },
    { level: '2',  entry: 19900,  max: 63200 },
    { level: '3',  entry: 21700,  max: 69100 },
    { level: '4',  entry: 25500,  max: 81100 },
    { level: '5',  entry: 29200,  max: 92300 },
    { level: '6',  entry: 35400,  max: 112400 },
    { level: '7',  entry: 44900,  max: 142400 },
    { level: '8',  entry: 47600,  max: 151100 },
    { level: '9',  entry: 53100,  max: 167800 },
    { level: '10', entry: 56100,  max: 177500 },
    { level: '11', entry: 67700,  max: 208700 },
    { level: '12', entry: 78800,  max: 209200 },
    { level: '13', entry: 123100, max: 215900 },
    { level: '13A', entry: 131100, max: 216600 },
    { level: '14', entry: 144200, max: 218200 },
    { level: '15', entry: 182200, max: 224100 },
    { level: '16', entry: 205400, max: 224400 },
    { level: '17', entry: 225000, max: 225000 },
    { level: '18', entry: 250000, max: 250000 }
  ];

  window.HRA_RATES = { X: 0.27, Y: 0.18, Z: 0.09 };

  function val(id) { return document.getElementById(id); }

  /* Populate level dropdown */
  document.addEventListener('DOMContentLoaded', function () {
    var sel = val('payLevel');
    if (sel) {
      window.PAY_LEVELS.forEach(function (l) {
        var opt = document.createElement('option');
        opt.value = l.level;
        opt.textContent = 'Level ' + l.level + '  (₹' + formatINR(l.entry, { plain: true }) + ' – ₹' + formatINR(l.max, { plain: true }) + ')';
        sel.appendChild(opt);
      });
      sel.value = '10';
    }
    /* Deep-link prefill: ?basic=56100&level=10 (used by /levels/ pages) */
    var params = new URLSearchParams(location.search);
    var qBasic = parseInt(params.get('basic'), 10);
    if (qBasic > 0) {
      document.getElementById('basicPay').value = qBasic;
      if (sel && params.get('level')) {
        var lv = params.get('level');
        if (window.PAY_LEVELS.some(function (l) { return l.level === lv; })) sel.value = lv;
      }
      if (typeof window.recalc === 'function') window.recalc();
    }
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
      if (val('customFactorWrap')) val('customFactorWrap').hidden = true;
    }
    var daRate = parseNum(val('daRate').value) / 100;
    var withHRA = val('inclHRA').checked;
    var city = val('hraCity').value;
    var withNPS = val('inclNPS').checked;
    var npsRate = parseNum(val('npsRate').value) / 100;

    val('hraCityWrap').hidden = !withHRA;
    val('npsRateWrap').hidden = !withNPS;

    var results = val('results');
    if (!basic || basic <= 0 || !factor || factor <= 0) {
      results.setAttribute('data-empty', 'true');
      val('emptyState').hidden = false;
      val('resultContent').hidden = true;
      return;
    }
    val('emptyState').hidden = true;
    val('resultContent').hidden = false;
    results.removeAttribute('data-empty');

    /* Current (7th CPC) */
    var curDA = basic * daRate;
    var hraPct = window.HRA_RATES[city] || 0;
    var curHRA = withHRA ? basic * hraPct : 0;
    var curGross = basic + curDA + curHRA;
    var curNPS = withNPS ? (basic + curDA) * npsRate : 0;
    var curNet = curGross - curNPS;

    /* Projected (8th CPC): DA merged into basic, resets to 0% */
    var newBasic = Math.round(basic * factor);
    var newDA = 0;
    var newHRA = withHRA ? newBasic * hraPct : 0;
    var newGross = newBasic + newDA + newHRA;
    var newNPS = withNPS ? newBasic * npsRate : 0;
    var newNet = newGross - newNPS;

    val('newBasicOut').textContent = formatINR(newBasic);
    val('factorNote').textContent = 'Basic ' + formatINR(basic) + ' × fitment factor ' + factor + (factor === 2.57 ? ' (same as 7th CPC)' : '');

    function fillRow(prefix, cur, proj, diffAsDash) {
      val(prefix + 'Cur').textContent = formatINR(cur);
      val(prefix + 'New').textContent = formatINR(proj);
      var d = val(prefix + 'Diff');
      if (diffAsDash) { d.textContent = '—'; d.className = ''; return; }
      var diff = proj - cur;
      d.textContent = (diff >= 0 ? '+' : '') + formatINR(diff);
      d.className = diff >= 0 ? 'pos' : 'neg';
    }

    fillRow('rBasic', basic, newBasic);
    val('rDaCur').textContent = formatINR(curDA);
    val('rDaNew').textContent = '₹0 (merged)';
    val('rDaDiff').textContent = '—';
    val('daRateLabel').textContent = 'DA (' + Math.round(daRate * 100) + '%)';

    var hraRow = val('rHraRow');
    var npsRow = val('rNpsRow');
    hraRow.hidden = !withHRA;
    npsRow.hidden = !withNPS;
    if (withHRA) fillRow('rHra', curHRA, newHRA);
    fillRow('rGross', curGross, newGross);
    if (withNPS) {
      val('rNpsCur').textContent = formatINR(curNPS);
      val('rNpsNew').textContent = formatINR(newNPS);
      var nd = newNPS - curNPS;
      val('rNpsDiff').textContent = (nd >= 0 ? '+' : '') + formatINR(nd);
      val('rNpsDiff').className = '';
    }
    fillRow('rNet', curNet, newNet);

    /* Arrears: Jan 2026 → May 2027 = 17 months. Monthly gain vs current basic+DA. */
    var monthlyGain = Math.max(0, newBasic - (basic + curDA));
    var arrears = monthlyGain * 17;
    val('arrearsOut').textContent = formatINR(arrears);
    val('arrearsWords').textContent = arrears > 0 ? '(about ' + inWords(arrears) + ')' : '';
    val('monthlyGainOut').textContent = formatINR(monthlyGain);
  };
})();
