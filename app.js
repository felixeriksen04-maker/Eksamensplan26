// Ukeplan mot JUUL: viser fag og timer per dag fra plan.js.
(function () {
  "use strict";
  var P = window.PLAN;
  var UKEDAG = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
  var MND = ["jan.", "feb.", "mars", "april", "mai", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "des."];

  function to(n) {
    return (n < 10 ? "0" : "") + n;
  }
  function iso(d) {
    return d.getFullYear() + "-" + to(d.getMonth() + 1) + "-" + to(d.getDate());
  }
  function dato(s) {
    return new Date(s + "T12:00:00");
  }
  function kortDato(s) {
    var d = dato(s);
    return d.getDate() + ". " + MND[d.getMonth()];
  }
  function ukedag(s) {
    return UKEDAG[dato(s).getDay()];
  }
  function timer(t) {
    return String(t).replace(".", ",") + " t";
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fagListe() {
    return '<ul class="fag">' + Object.keys(P.fag).map(function (k) {
      var f = P.fag[k];
      var hva = f.lenke ? '<a href="' + esc(f.lenke) + '">' + esc(f.hva) + "</a>" : esc(f.hva);
      return '<li><span class="prikk" style="background:' + f.farge + '"></span><b>' + esc(f.navn) + "</b>" +
        '<span class="hva">' + hva + '</span><span class="eks">Eksamen ' + ukedag(f.eksamen).toLowerCase() + " " + kortDato(f.eksamen) + "</span></li>";
    }).join("") + "</ul>";
  }

  function dagRad(d, iDag) {
    var t = d.timer || {};
    var fag = Object.keys(t);
    var sum = fag.reduce(function (a, k) { return a + t[k]; }, 0);
    var klasser = ["dag"];
    if (d.dato === iDag) klasser.push("idag");
    if (d.dato < iDag) klasser.push("forbi");
    var chips = "";
    if (d.eksamen) {
      var e = P.fag[d.eksamen];
      chips += '<span class="chip eksamen">Eksamen ' + esc(e.navn) + (e.tid ? " " + esc(e.tid) : "") + "</span>";
    }
    chips += fag.map(function (k) {
      return '<span class="chip" style="background:' + P.fag[k].farge + '">' + esc(P.fag[k].navn) + " " + timer(t[k]) + "</span>";
    }).join("");
    if (d.merk) chips += '<span class="merk">' + esc(d.merk) + "</span>";
    return '<li class="' + klasser.join(" ") + '"' + (d.dato === iDag ? ' id="idag"' : "") + ">" +
      '<div class="dato"><b>' + ukedag(d.dato) + "</b>" + kortDato(d.dato) + "</div>" +
      '<div class="chips">' + chips + "</div>" +
      '<div class="sum">' + (sum ? timer(sum) : "") + "</div></li>";
  }

  function render() {
    var iDag = iso(new Date());
    var html = fagListe();
    P.uker.forEach(function (u) {
      var dager = P.dager.filter(function (d) { return d.dato >= u.fra && d.dato <= u.til; });
      html += "<h2>" + esc(u.navn) + '</h2><ol class="dager">' + dager.map(function (d) { return dagRad(d, iDag); }).join("") + "</ol>";
    });
    document.getElementById("plan").innerHTML = html;
    var idag = document.getElementById("idag");
    if (idag) idag.scrollIntoView({ block: "center" });
  }

  render();
})();
