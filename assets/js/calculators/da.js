/* DA Calculator + historical chart */
(function () {
  'use strict';
  function val(id) { return document.getElementById(id); }

  /* DA history for Central Government employees (7th CPC period) */
  var DA_HISTORY = [
    { label: 'Jan 2016', pct: 0 },
    { label: 'Jul 2016', pct: 2 },
    { label: 'Jan 2017', pct: 4 },
    { label: 'Jul 2017', pct: 5 },
    { label: 'Jan 2018', pct: 7 },
    { label: 'Jul 2018', pct: 9 },
    { label: 'Jan 2019', pct: 12 },
    { label: 'Jul 2019', pct: 17 },
    { label: 'Jan 2020', pct: 17 }, /* hikes frozen during COVID-19 */
    { label: 'Jul 2020', pct: 17 },
    { label: 'Jan 2021', pct: 17 },
    { label: 'Jul 2021', pct: 28 },
    { label: 'Jan 2022', pct: 34 },
    { label: 'Jul 2022', pct: 38 },
    { label: 'Jan 2023', pct: 42 },
    { label: 'Jul 2023', pct: 46 },
    { label: 'Jan 2024', pct: 50 },
    { label: 'Jul 2024', pct: 53 },
    { label: 'Jan 2025', pct: 55 },
    { label: 'Jul 2025', pct: 58 },
    { label: 'Jan 2026', pct: 60 }
  ];

  function drawChart() {
    var host = val('daChart');
    if (!host) return;
    var W = 680, H = 260, padL = 42, padR = 16, padT = 16, padB = 42;
    var maxPct = 65;
    var innerW = W - padL - padR, innerH = H - padT - padB;
    var pts = DA_HISTORY.map(function (d, i) {
      var x = padL + (i / (DA_HISTORY.length - 1)) * innerW;
      var y = padT + innerH - (d.pct / maxPct) * innerH;
      return { x: x, y: y, d: d };
    });
    var line = pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Line chart of Central Government DA percentage from January 2016 (0%) to January 2026 (60%)">';
    /* gridlines */
    [0, 10, 20, 30, 40, 50, 60].forEach(function (g) {
      var y = padT + innerH - (g / maxPct) * innerH;
      svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="#E2E8F0" stroke-width="1"/>';
      svg += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="#718096" font-family="monospace">' + g + '%</text>';
    });
    /* x labels: every 4th point */
    pts.forEach(function (p, i) {
      if (i % 4 === 0 || i === pts.length - 1) {
        svg += '<text x="' + p.x + '" y="' + (H - 12) + '" text-anchor="middle" font-size="10" fill="#718096">' + p.d.label + '</text>';
      }
    });
    svg += '<polyline points="' + line + '" fill="none" stroke="#1A365D" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    pts.forEach(function (p, i) {
      var last = i === pts.length - 1;
      svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (last ? 5 : 3) + '" fill="' + (last ? '#D97706' : '#1A365D') + '"/>';
    });
    var lastP = pts[pts.length - 1];
    svg += '<text x="' + (lastP.x - 8) + '" y="' + (lastP.y - 10) + '" text-anchor="end" font-size="12" font-weight="700" fill="#D97706" font-family="monospace">60%</text>';
    svg += '</svg>';
    host.innerHTML = svg;
  }

  document.addEventListener('DOMContentLoaded', drawChart);

  window.recalc = function () {
    var basic = parseNum(val('basicPay').value);
    var daRate = parseNum(val('daRate').value) / 100;
    if (!basic || basic <= 0) {
      val('emptyState').hidden = false;
      val('resultContent').hidden = true;
      return;
    }
    val('emptyState').hidden = true;
    val('resultContent').hidden = false;
    var da = Math.round(basic * daRate);
    val('daOut').textContent = formatINR(da);
    val('daNote').textContent = Math.round(daRate * 100) + '% of ' + formatINR(basic);
    val('rBasic').textContent = formatINR(basic);
    val('rDa').textContent = formatINR(da);
    val('rTotal').textContent = formatINR(basic + da);
  };
})();
