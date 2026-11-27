// Ukeplan mot JUUL: viser planen dag for dag. Ingen logg eller kontroll.
(function () {
  "use strict";
  var P = window.PLAN;

  function to(n) {
    return (n < 10 ? "0" : "") + n;
  }
  function iso(d) {
    return d.getFullYear() + "-" + to(d.getMonth() + 1) + "-" + to(d.getDate());
  }
  function leggTil(dato, n) {
    var d = new Date(dato + "T12:00:00");
    d.setDate(d.getDate() + n);
    return iso(d);
  }
  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function fmtDag(dato) {
    return cap(new Date(dato + "T12:00:00").toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" }));
  }
  function fmtMin(min) {
    if (!min) return "0 min";
    var t = Math.floor(min / 60), m = min % 60;
    return (t ? t + " t" : "") + (t && m ? " " : "") + (m ? m + " min" : "");
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function temaNavn(id) {
    for (var i = 0; i < P.temaer.length; i++) {
      if (P.temaer[i].id === id) return P.temaer[i].navn;
    }
    return "";
  }

  function okt(s) {
    var f = P.fag[s.fag];
    var type = s.type === "prove" ? "Prøve" : s.type === "repetisjon" ? "Repetisjon" : "";
    var temaer = s.temaer.map(temaNavn).filter(Boolean).join(", ");
    var sub = [f.navn, type, temaer].filter(Boolean).join(" · ");
    return '<article class="kort" style="border-left-color:' + f.farge + '">' +
      '<div class="kortrad"><strong>' + esc(s.navn) + '</strong><span class="planlagt">' + fmtMin(s.min) + "</span></div>" +
      '<div class="sub">' + esc(sub) + "</div></article>";
  }

  function render() {
    var teller = P.eksamener.map(function (e) {
      return '<span class="pille" style="background:' + P.fag[e.fag].farge + '">' + esc(e.navn) + " " + esc(e.dato.slice(8) + "." + e.dato.slice(5, 7) + ".") + "</span>";
    }).join("");
    var html = '<div class="teller">' + teller + "</div>";
    for (var d = P.startdato; d <= P.sluttdato; d = leggTil(d, 1)) {
      (function (dato) {
        var ses = P.sesjoner.filter(function (s) { return s.dato === dato; });
        var eks = P.eksamener.filter(function (e) { return e.dato === dato; });
        var fast = P.faste.filter(function (f) { return f.dato === dato; });
        var sum = ses.reduce(function (s, x) { return s + x.min; }, 0);
        html += '<div class="dag"><div class="dagtittel"><h2>' + esc(fmtDag(dato)) + '</h2><span class="sum">' +
          fmtMin(sum) + " planlagt</span></div>";
        eks.forEach(function (e) {
          html += '<div class="fast eksamen">Eksamen: ' + esc(e.navn) + " (" + esc(e.kode) + ") · " + esc(e.tid) + "</div>";
        });
        fast.forEach(function (f) {
          html += '<div class="fast">' + esc(f.tid) + " · " + esc(f.tekst) + "</div>";
        });
        html += ses.map(okt).join("");
        html += "</div>";
      })(d);
    }
    document.getElementById("dager").innerHTML = html;
  }

  render();
})();
