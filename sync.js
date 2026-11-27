// GitHub-synk for Ukeplan mot JUUL. Bruker GitHub Contents-API og et fint-granulert token.
// Tokenet lagres bare i denne nettleseren (localStorage), aldri i repoet.
(function () {
  "use strict";
  var INNST = "ukeplan-juul-github";
  var API = "https://api.github.com";
  var FILER = { logg: "data/logg.json", kontroll: "data/kontroll.json" };

  function innst() {
    try {
      return JSON.parse(localStorage.getItem(INNST)) || {};
    } catch (e) {
      return {};
    }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function b64enc(tekst) {
    var bytes = new TextEncoder().encode(tekst);
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64dec(b64) {
    var bin = atob(b64.replace(/\s/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function url(s, sti) {
    return API + "/repos/" + encodeURIComponent(s.owner) + "/" + encodeURIComponent(s.repo) + "/contents/" + sti;
  }
  function hode(token, medBody) {
    var h = {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28"
    };
    if (medBody) h["Content-Type"] = "application/json";
    return h;
  }
  async function hent(s, sti) {
    var r = await fetch(url(s, sti), { headers: hode(s.token) });
    if (r.status === 404) return { sha: null, data: null };
    if (!r.ok) throw new Error("Henting av " + sti + " feilet (" + r.status + ").");
    var j = await r.json();
    return { sha: j.sha, data: JSON.parse(b64dec(j.content)) };
  }
  async function skriv(s, sti, data, sha, melding) {
    var body = { message: melding, content: b64enc(JSON.stringify(data, null, 2) + "\n") };
    if (sha) body.sha = sha;
    var r = await fetch(url(s, sti), { method: "PUT", headers: hode(s.token, true), body: JSON.stringify(body) });
    if (r.status === 409 || r.status === 422) throw new Error("Konflikt på " + sti + ". Synk på nytt.");
    if (!r.ok) throw new Error("Skriving av " + sti + " feilet (" + r.status + ").");
  }
  // Slår sammen to lister etter id. Poster er uforanderlige, så første forekomst holder.
  function slaSammen(a, b) {
    var kart = {};
    a.concat(b).forEach(function (e) {
      if (!kart[e.id]) kart[e.id] = e;
    });
    return Object.keys(kart).map(function (k) { return kart[k]; }).sort(function (x, y) {
      return x.tid < y.tid ? -1 : x.tid > y.tid ? 1 : 0;
    });
  }
  async function synk() {
    var s = innst();
    if (!s.owner || !s.repo || !s.token) throw new Error("Fyll inn bruker, repo og token først.");
    var lokal = UkeplanApp.data();
    var fL = await hent(s, FILER.logg);
    var fK = await hent(s, FILER.kontroll);
    var rL = fL.data && fL.data.logg ? fL.data.logg : [];
    var rK = fK.data && fK.data.kontroll ? fK.data.kontroll : [];
    var logg = slaSammen(rL, lokal.logg);
    var kontroll = slaSammen(rK, lokal.kontroll);
    UkeplanApp.erstatt({ logg: logg, kontroll: kontroll });
    var stempel = new Date().toISOString().slice(0, 16).replace("T", " ");
    var skrevet = 0;
    if (logg.length !== rL.length) {
      await skriv(s, FILER.logg, { versjon: 1, logg: logg }, fL.sha, "Logg: synk " + stempel);
      skrevet++;
    }
    if (kontroll.length !== rK.length) {
      await skriv(s, FILER.kontroll, { versjon: 1, kontroll: kontroll }, fK.sha, "Kontroll: synk " + stempel);
      skrevet++;
    }
    return { logg: logg.length, kontroll: kontroll.length, skrevet: skrevet };
  }

  function status(tekst) {
    var el = document.getElementById("status");
    if (el) el.textContent = tekst;
  }
  async function kjorSynk() {
    status("Synkroniserer …");
    try {
      var r = await synk();
      status("Synkronisert: " + r.logg + " økter og " + r.kontroll + " vurderinger. " +
        (r.skrevet ? "Endringer er lagret på GitHub." : "Ingen nye endringer å lagre."));
    } catch (e) {
      status(e.message || String(e));
    }
  }
  function eksporter() {
    var d = UkeplanApp.data();
    var tekst = JSON.stringify({ versjon: 1, logg: d.logg, kontroll: d.kontroll }, null, 2);
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([tekst], { type: "application/json" }));
    a.download = "ukeplan-logg-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function importer(fil) {
    var leser = new FileReader();
    leser.onload = function () {
      try {
        var j = JSON.parse(leser.result);
        var d = UkeplanApp.data();
        UkeplanApp.erstatt({
          logg: slaSammen(d.logg, j.logg || []),
          kontroll: slaSammen(d.kontroll, j.kontroll || [])
        });
        status("Importert. Synk til GitHub når du er klar.");
      } catch (e) {
        status("Kunne ikke lese filen: " + e.message);
      }
    };
    leser.readAsText(fil);
  }

  function renderSynk() {
    var s = innst();
    document.getElementById("synk").innerHTML =
      "<h2>GitHub-synk</h2>" +
      '<p class="hint">Dataene lagres i data/logg.json og data/kontroll.json i repoet. Tokenet lagres bare i denne nettleseren. ' +
      "Bruk et fint-granulert token med tilgang til dette repoet og Contents: lese og skrive.</p>" +
      '<form id="innst" class="innst">' +
      '<label>GitHub-bruker<input name="owner" value="' + esc(s.owner) + '" autocomplete="off"></label>' +
      '<label>Repo<input name="repo" value="' + esc(s.repo || "ukeplan-juul") + '" autocomplete="off"></label>' +
      '<label>Token<input name="token" type="password" value="' + esc(s.token) + '" autocomplete="off"></label>' +
      '<button type="submit">Lagre innstillinger</button></form>' +
      '<div class="rad"><button id="synkknapp" type="button">Synkroniser nå</button>' +
      '<button id="eksportknapp" type="button">Eksporter JSON</button>' +
      '<label class="knapp">Importer JSON<input id="importfelt" type="file" accept="application/json" hidden></label></div>' +
      '<p id="status" class="hint" aria-live="polite"></p>';

    document.getElementById("innst").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = new FormData(ev.target);
      localStorage.setItem(INNST, JSON.stringify({
        owner: String(f.get("owner")).trim(),
        repo: String(f.get("repo")).trim(),
        token: String(f.get("token")).trim()
      }));
      status("Innstillinger lagret.");
    });
    document.getElementById("synkknapp").addEventListener("click", kjorSynk);
    document.getElementById("eksportknapp").addEventListener("click", eksporter);
    document.getElementById("importfelt").addEventListener("change", function (ev) {
      if (ev.target.files[0]) importer(ev.target.files[0]);
    });
  }

  renderSynk();
  var lagret = innst();
  if (lagret.token && lagret.owner && lagret.repo) {
    kjorSynk();
  }
})();
