// ===================== CALCULATORS =====================
// These functions are called from onclick attributes in page partials.
// They must be global (window scope).

function setResult(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// ---- FLUID ----
window.calcRe = function () {
  var rho = +document.getElementById('re_rho').value;
  var v   = +document.getElementById('re_v').value;
  var l   = +document.getElementById('re_l').value;
  var mu  = +document.getElementById('re_mu').value;
  if (!rho || !v || !l || !mu) { setResult('re_result','⚠ Enter all values.'); return; }
  var Re = rho * v * l / mu;
  var regime = Re < 2300 ? '✅ Laminar (Re < 2300)' : Re < 4000 ? '⚠ Transitional (2300–4000)' : '🌀 Turbulent (Re > 4000)';
  setResult('re_result', 'Re = ' + Re.toExponential(4) + '\n' + regime);
};

window.calcDW = function () {
  var f   = +document.getElementById('dw_f').value;
  var L   = +document.getElementById('dw_l').value;
  var D   = +document.getElementById('dw_d').value;
  var rho = +document.getElementById('dw_rho').value;
  var v   = +document.getElementById('dw_v').value;
  var dp  = f * (L / D) * (rho * v * v / 2);
  var hf  = dp / (rho * 9.81);
  setResult('dw_result', 'ΔP = ' + dp.toFixed(2) + ' Pa\nh_f = ' + hf.toFixed(4) + ' m\nDyn. pressure q = ' + (rho*v*v/2).toFixed(2) + ' Pa');
};

window.calcBernoulli = function () {
  var p1 = +document.getElementById('be_p1').value;
  var v1 = +document.getElementById('be_v1').value;
  var z1 = +document.getElementById('be_z1').value;
  var p2 = +document.getElementById('be_p2').value;
  var v2 = +document.getElementById('be_v2').value;
  var z2 = +document.getElementById('be_z2').value;
  var rho= +document.getElementById('be_rho').value;
  var g  = 9.81;
  var H1 = p1/(rho*g) + v1*v1/(2*g) + z1;
  var H2 = p2/(rho*g) + v2*v2/(2*g) + z2;
  var loss = H1 - H2;
  var msg = 'Total head at 1: H₁ = ' + H1.toFixed(4) + ' m\nTotal head at 2: H₂ = ' + H2.toFixed(4) + ' m\nHead difference: ΔH = ' + loss.toFixed(4) + ' m';
  if (loss < -0.001) msg += '\n⚠ Station 2 has more energy — check inputs.';
  else if (loss > 0.001) msg += '\n→ Head loss = ' + (loss*rho*g).toFixed(2) + ' Pa (pressure loss)';
  else msg += '\n✅ Bernoulli balanced (ideal flow).';
  setResult('be_result', msg);
};

// ---- THERMAL ----
window.calcConduction = function () {
  var L  = +document.getElementById('cd_l').value;
  var k  = +document.getElementById('cd_k').value;
  var A  = +document.getElementById('cd_a').value;
  var Th = +document.getElementById('cd_th').value;
  var Tc = +document.getElementById('cd_tc').value;
  var R  = L / (k * A);
  var Q  = (Th - Tc) / R;
  setResult('cd_result', 'R_cond = ' + R.toFixed(5) + ' K/W\nQ̇ = ' + Q.toFixed(2) + ' W\nHeat flux q = ' + (Q/A).toFixed(2) + ' W/m²');
};

window.calcConvection = function () {
  var h  = +document.getElementById('cv_h').value;
  var A  = +document.getElementById('cv_a').value;
  var Ts = +document.getElementById('cv_ts').value;
  var Tf = +document.getElementById('cv_tf').value;
  var Q  = h * A * (Ts - Tf);
  var R  = 1 / (h * A);
  setResult('cv_result', 'Q̇ = ' + Q.toFixed(2) + ' W\nR_conv = ' + R.toFixed(5) + ' K/W\nhA = ' + (h*A).toFixed(4) + ' W/K');
};

window.calcBiot = function () {
  var h  = +document.getElementById('bi_h').value;
  var lc = +document.getElementById('bi_lc').value;
  var k  = +document.getElementById('bi_k').value;
  var Bi = h * lc / k;
  var ok = Bi < 0.1;
  setResult('bi_result', 'Bi = ' + Bi.toFixed(5) + '\n' +
    (ok ? '✅ Bi < 0.1 → Lumped capacitance is valid.' :
          '⚠ Bi ≥ 0.1 → Temperature gradient inside body is significant.\n   Lumped capacitance is NOT valid.'));
};

// ---- STRUCTURAL ----
window.calcBeam = function () {
  var M   = +document.getElementById('bb_m').value;
  var y   = +document.getElementById('bb_y').value;
  var I   = +document.getElementById('bb_i').value;
  var Sy  = +document.getElementById('bb_sy').value;
  var sig = M * y / I;
  var sigMPa = sig / 1e6;
  var FOS = Sy / sigMPa;
  var status = FOS < 1 ? '❌ FOS < 1 — predicted failure.' : FOS < 1.5 ? '⚠ FOS < 1.5 — marginal; review design.' : '✅ FOS ≥ 1.5 — acceptable.';
  setResult('bb_result', 'σ_max = ' + sig.toExponential(4) + ' Pa = ' + sigMPa.toFixed(2) + ' MPa\nFactor of Safety = ' + FOS.toFixed(3) + '\n' + status);
};

window.calcTorsion = function () {
  var T  = +document.getElementById('tor_t').value;
  var L  = +document.getElementById('tor_l').value;
  var ro = +document.getElementById('tor_ro').value;
  var ri = +document.getElementById('tor_ri').value;
  var G  = +document.getElementById('tor_g').value * 1e9;
  var J  = (Math.PI / 2) * (Math.pow(ro,4) - Math.pow(ri,4));
  var tau = T * ro / J;
  var tht = T * L / (G * J);
  setResult('tor_result', 'J = ' + J.toExponential(4) + ' m⁴\nτ_max = ' + (tau/1e6).toFixed(2) + ' MPa\nθ (twist) = ' + tht.toFixed(6) + ' rad = ' + (tht*180/Math.PI).toFixed(4) + '°');
};

window.calcBuckling = function () {
  var E   = +document.getElementById('buck_e').value * 1e9;
  var I   = +document.getElementById('buck_i').value;
  var L   = +document.getElementById('buck_l').value;
  var K   = +document.getElementById('buck_k').value;
  var Pcr = (Math.PI * Math.PI * E * I) / Math.pow(K * L, 2);
  setResult('buck_result', 'P_cr = ' + (Pcr/1e3).toFixed(2) + ' kN\nEffective length KL = ' + (K*L).toFixed(3) + ' m');
};

window.calcVonMises = function () {
  var sx  = +document.getElementById('vm_sx').value;
  var sy  = +document.getElementById('vm_sy').value;
  var txy = +document.getElementById('vm_txy').value;
  var Sy  = +document.getElementById('vm_yield').value;
  var vm  = Math.sqrt(sx*sx - sx*sy + sy*sy + 3*txy*txy);
  var FOS = Sy / vm;
  var status = FOS < 1 ? '❌ Yielding predicted.' : FOS < 1.5 ? '⚠ Marginal — check.' : '✅ Safe.';
  setResult('vm_result', 'σ_v (Von Mises) = ' + vm.toFixed(3) + ' MPa\nYield strength = ' + Sy + ' MPa\nFOS = ' + FOS.toFixed(3) + '\n' + status);
};

// ---- VIBRATION ----
window.calcNatFreq = function () {
  var m  = +document.getElementById('fn_m').value;
  var k  = +document.getElementById('fn_k').value;
  var c  = +document.getElementById('fn_c').value;
  var wn = Math.sqrt(k / m);
  var cc = 2 * Math.sqrt(k * m);
  var zeta = c / cc;
  var fn = wn / (2 * Math.PI);
  var wd = (c > 0 && zeta < 1) ? wn * Math.sqrt(1 - zeta*zeta) : wn;
  var fd = wd / (2 * Math.PI);
  var out = 'ωₙ = ' + wn.toFixed(4) + ' rad/s\nfₙ = ' + fn.toFixed(4) + ' Hz';
  if (c > 0) {
    out += '\nζ = ' + zeta.toFixed(5) + '\nω_d = ' + wd.toFixed(4) + ' rad/s\nf_d = ' + fd.toFixed(4) + ' Hz';
    if (zeta >= 1) out += '\n⚠ Overdamped / critically damped — no oscillation.';
  }
  setResult('fn_result', out);
};

window.calcLogDecrement = function () {
  var x1 = +document.getElementById('ld_x1').value;
  var x2 = +document.getElementById('ld_x2').value;
  var n  = +document.getElementById('ld_n').value || 1;
  if (x1 <= 0 || x2 <= 0) { setResult('ld_result','⚠ Amplitudes must be positive.'); return; }
  var delta = (1/n) * Math.log(x1 / x2);
  var zeta  = delta / Math.sqrt(4 * Math.PI * Math.PI + delta * delta);
  var zetaA = delta / (2 * Math.PI);
  setResult('ld_result', 'δ (log decrement) = ' + delta.toFixed(6) + '\nζ (exact) = ' + zeta.toFixed(6) + '\nζ (approx) = ' + zetaA.toFixed(6) + '\n→ ' + (zeta*100).toFixed(3) + '% damping');
};

window.calcForcedVib = function () {
  var F0 = +document.getElementById('fv_f0').value;
  var k  = +document.getElementById('fv_k').value;
  var w  = +document.getElementById('fv_w').value;
  var wn = +document.getElementById('fv_wn').value;
  var z  = +document.getElementById('fv_z').value;
  var r  = w / wn;
  var Xst = F0 / k;
  var X   = Xst / Math.sqrt(Math.pow(1 - r*r, 2) + Math.pow(2*z*r, 2));
  var MF  = X / Xst;
  var out = 'r = ω/ωₙ = ' + r.toFixed(4) + '\nStatic deflection X_st = ' + (Xst*1000).toFixed(4) + ' mm\nAmplitude X = ' + (X*1000).toFixed(4) + ' mm\nMagnification factor MF = ' + MF.toFixed(3);
  if (r > 0.95 && r < 1.05) out += '\n⚠ Near resonance — amplified by ~' + (1/(2*z)).toFixed(1) + '×';
  setResult('fv_result', out);
};