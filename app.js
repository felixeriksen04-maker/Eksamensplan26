// Ukeplan mot JUUL: logg, kontroll og oversikt. Lagres lokalt og kan synkes til GitHub (sync.js).
(function () {
  "use strict";
  var P = window.PLAN;
  var LAGRING = "ukeplan-juul-data";
  var SKALA = { 1: "Ikke begynt", 2: "Har sett på det", 3: "Forstår hovedpoenget", 4: "Kan det meste", 5: "Sikker" };
  var STATUS = { ikke: "Ikke startet", gjort: "Gjort", delvis: "Delvis", hoppet: "Hoppet over" };
  var state = lastLokal();

  function lastLokal() {
    try {
      var d = JSON.parse(localStorage.getItem(LAGRING));
      return d && Array.isArray(d.logg) && Array.isArray(d.kontroll) ? d : { logg: [], kontroll: [] };
    } catch (e) {
      return { logg: [], kontroll: [] };
    }
  }
  function lagre() {
    localStorage.setItem(LAGRING, JSON.stringify(state));
  }
  function nyId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function to(n) {
    return (n < 10 ? "0" : "") + n;
  }
  function iso(d) {
    return d.getFullYear() + "-" + to(d.getMonth() + 1) + "-" + to(d.getDate());
  }
  function iDag() {
    return iso(new Date());
  }
  function leggTil(dato, n) {
    var d = new Date(dato + "T12:00:00");
    d.setDate(d.getDate() + n);
    return iso(d);
  }
  function dagerTil(dato) {
    var a = new Date(iDag() + "T12:00:00");
    var b = new Date(dato + "T12:00:00");
    return Math.round((b - a) / 86400000);
  }
  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function fmtDag(dato) {
    return cap(new Date(dato + "T12:00:00").toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" }));
  }
  function fmtKort(dato) {
    return new Date(dato + "T12:00:00").toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
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
  function tema(id) {
    for (var i = 0; i < P.temaer.length; i++) {
      if (P.temaer[i].id === id) return P.temaer[i];
    }
    return null;
  }
  // Nyeste post der felt === verdi. Poster har ISO-tid, så tekstsammenligning holder.
  function nyeste(liste, felt, verdi) {
    var best = null;
    liste.forEach(function (e) {
      if (e[felt] === verdi && (!best || e.tid > best.tid)) best = e;
    });
    return best;
  }
  function senesteLogg(sesjon) {
    return nyeste(state.logg, "sesjon", sesjon);
  }
  function senesteKontroll(temaId) {
    return nyeste(state.kontroll, "tema", temaId);
  }
  function planlagtMin(ses) {
    return ses.reduce(function (s, x) { return s + x.min; }, 0);
  }
  function loggetMin(ses) {
    return ses.reduce(function (s, x) {
      var e = senesteLogg(x.id);
      return s + (e && (e.status === "gjort" || e.status === "delvis") ? e.minutter || 0 : 0);
    }, 0);
  }

  function sesjonKort(s) {
    var f = P.fag[s.fag];
    var e = senesteLogg(s.id);
    var status = e ? e.status : "ikke";
    var min = e ? e.minutter : s.min;
    var temaNavn = s.temaer.map(function (id) { var t = tema(id); return t ? t.navn : ""; })
      .filter(Boolean).join(", ");
    var type = s.type === "prove" ? "Prøve" : s.type === "repetisjon" ? "Repetisjon" : "";
    var sub = [f.navn, type, temaNavn].filter(Boolean).join(" · ");
    var valg = Object.keys(STATUS).map(function (k) {
      return '<option value="' + k + '"' + (k === status ? " selected" : "") + ">" + STATUS[k] + "</option>";
    }).join("");
    return '<article class="kort" style="border-left-color:' + f.farge + '">' +
      '<div class="kortrad"><strong>' + esc(s.navn) + '</strong><span class="planlagt">' + fmtMin(s.min) + " planlagt</span></div>" +
      '<div class="sub">' + esc(sub) + "</div>" +
      '<form class="logg" data-sesjon="' + s.id + '">' +
      '<select name="status">' + valg + "</select>" +
      '<input name="minutter" type="number" min="0" step="5" value="' + min + '" aria-label="Minutter">' +
      '<input name="notat" type="text" placeholder="Notat" value="' + esc(e ? e.notat : "") + '">' +
      '<button type="submit">Lagre</button>' +
      "</form></article>";
  }

  function renderDager() {
    var teller = P.eksamener.map(function (e) {
      var n = dagerTil(e.dato);
      var tekst = n > 0 ? "om " + n + (n === 1 ? " dag" : " dager") : n === 0 ? "i dag" : "avholdt";
      return '<span class="pille" style="background:' + P.fag[e.fag].farge + '">' + esc(P.fag[e.fag].navn) + " " + tekst + "</span>";
    }).join("");
    var html = '<div class="teller">' + teller + "</div>";
    for (var d = P.startdato; d <= P.sluttdato; d = leggTil(d, 1)) {
      var dato = d;
      var ses = P.sesjoner.filter(function (s) { return s.dato === dato; });
      var eks = P.eksamener.filter(function (e) { return e.dato === dato; });
      var fast = P.faste.filter(function (f) { return f.dato === dato; });
      html += '<div class="dag"><div class="dagtittel"><h2>' + esc(fmtDag(dato)) + '</h2><span class="sum">' +
        fmtMin(planlagtMin(ses)) + " planlagt · " + fmtMin(loggetMin(ses)) + " logget</span></div>";
      eks.forEach(function (e) {
        html += '<div class="fast eksamen">Eksamen: ' + esc(e.navn) + " (" + esc(e.kode) + ") · " + esc(e.tid) + "</div>";
      });
      fast.forEach(function (f) {
        html += '<div class="fast">' + esc(f.tid) + " · " + esc(f.tekst) + "</div>";
      });
      html += ses.map(sesjonKort).join("");
      html += "</div>";
    }
    document.getElementById("dager").innerHTML = html;
  }

  function renderKontroll() {
    var skala = [1, 2, 3, 4, 5].map(function (k) { return k + " " + SKALA[k]; }).join(" · ");
    var html = '<p class="hint">Skala: ' + esc(skala) + ". Lagre en ny vurdering etter økter og prøver. Tidligere vurderinger beholdes.</p>";
    Object.keys(P.fag).forEach(function (fagId) {
      var f = P.fag[fagId];
      html += '<h2 class="fagtittel" style="color:' + f.farge + '">' + esc(f.navn) + "</h2>";
      P.temaer.filter(function (t) { return t.fag === fagId; }).forEach(function (t) {
        var e = senesteKontroll(t.id);
        var nivaa = e ? e.nivaa : 0;
        var valg = '<option value="0"' + (nivaa === 0 ? " selected" : "") + ">Ikke vurdert</option>" +
          [1, 2, 3, 4, 5].map(function (k) {
            return '<option value="' + k + '"' + (k === nivaa ? " selected" : "") + ">" + k + " · " + SKALA[k] + "</option>";
          }).join("");
        html += '<form class="kontroll" data-tema="' + t.id + '">' +
          '<span class="tnavn">' + esc(t.navn) +
          (e ? '<span class="sist">sist ' + esc(fmtKort(e.dato)) + "</span>" : "") + "</span>" +
          '<span class="nivaa n' + nivaa + '">' + (nivaa || "–") + "</span>" +
          '<select name="nivaa">' + valg + "</select>" +
          '<input name="notat" type="text" placeholder="Notat" value="' + esc(e ? e.notat : "") + '">' +
          '<button type="submit">Lagre</button></form>';
      });
    });
    document.getElementById("kontroll").innerHTML = html;
  }

  function renderOversikt() {
    var html = "";
    Object.keys(P.fag).forEach(function (fagId) {
      var f = P.fag[fagId];
      var ses = P.sesjoner.filter(function (s) { return s.fag === fagId; });
      var gjort = ses.filter(function (s) { var e = senesteLogg(s.id); return e && e.status === "gjort"; }).length;
      var temaer = P.temaer.filter(function (t) { return t.fag === fagId; });
      var vurdert = temaer.map(function (t) { return senesteKontroll(t.id); }).filter(Boolean);
      var snitt = vurdert.length
        ? (vurdert.reduce(function (a, e) { return a + e.nivaa; }, 0) / vurdert.length).toFixed(1).replace(".", ",")
        : "–";
      html += '<section class="fagkort" style="border-top-color:' + f.farge + '"><h2>' + esc(f.navn) + "</h2>" +
        "<p>" + gjort + " av " + ses.length + " økter gjort</p>" +
        "<p>" + fmtMin(loggetMin(ses)) + " logget av " + fmtMin(planlagtMin(ses)) + " planlagt</p>" +
        "<p>Snitt kontroll " + snitt + " · " + vurdert.length + " av " + temaer.length + " temaer vurdert</p></section>";
    });
    var svakest = P.temaer.map(function (t) { return { t: t, e: senesteKontroll(t.id) }; })
      .filter(function (x) { return x.e; })
      .sort(function (a, b) { return a.e.nivaa - b.e.nivaa; })
      .slice(0, 6);
    html += "<h2>Svakest nå</h2>";
    html += svakest.length
      ? "<ol>" + svakest.map(function (x) { return "<li>" + esc(x.t.navn) + " · nivå " + x.e.nivaa + "</li>"; }).join("") + "</ol>"
      : '<p class="hint">Ingen vurderinger ennå.</p>';
    document.getElementById("oversikt").innerHTML = html;
  }

  function renderAlt() {
    renderDager();
    renderKontroll();
    renderOversikt();
  }

  function vis(navn) {
    document.querySelectorAll("main > section").forEach(function (s) {
      s.hidden = s.id !== navn;
    });
    document.querySelectorAll("nav button").forEach(function (b) {
      b.classList.toggle("aktiv", b.dataset.tab === navn);
    });
  }

  document.querySelector("nav").addEventListener("click", function (ev) {
    var b = ev.target.closest("button[data-tab]");
    if (b) vis(b.dataset.tab);
  });

  document.querySelector("main").addEventListener("submit", function (ev) {
    var form = ev.target;
    if (!form.matches("form.logg, form.kontroll")) return;
    ev.preventDefault();
    var fd = new FormData(form);
    if (form.matches("form.logg")) {
      state.logg.push({
        id: nyId(),
        tid: new Date().toISOString(),
        sesjon: form.dataset.sesjon,
        status: String(fd.get("status")),
        minutter: Number(fd.get("minutter")) || 0,
        notat: String(fd.get("notat") || "").trim()
      });
    } else {
      var nivaa = Number(fd.get("nivaa"));
      if (nivaa >= 1 && nivaa <= 5) {
        state.kontroll.push({
          id: nyId(),
          tid: new Date().toISOString(),
          dato: iDag(),
          tema: form.dataset.tema,
          nivaa: nivaa,
          notat: String(fd.get("notat") || "").trim()
        });
      }
    }
    lagre();
    renderAlt();
  });

  // Brukes av sync.js
  window.UkeplanApp = {
    data: function () { return state; },
    erstatt: function (nytt) { state = nytt; lagre(); renderAlt(); },
    vis: vis
  };

  renderAlt();
  vis("dager");
})();
