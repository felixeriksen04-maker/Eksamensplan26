// Ukeplan mot JUUL: timer per fag per dag. Endre planen her.
window.PLAN = {
  fag: {
    mbf: { navn: "MBF", farge: "#1F4E79", hva: "MBF-appen", lenke: "https://felixeriksen04-maker.github.io/MBF/", eksamen: "2026-12-07" },
    kjemi: { navn: "Kjemi", farge: "#2F7D5B", hva: "Oppgaver i kompendiet", eksamen: "2026-12-09" },
    fysikk: { navn: "Fysikk", farge: "#B4541A", hva: "Oppgaver fra faglærer", eksamen: "2026-12-14", tid: "09:00" }
  },
  uker: [
    { navn: "Uke 1 · 29. nov.–6. des.", fra: "2026-11-29", til: "2026-12-06" },
    { navn: "Uke 2 · 7.–14. des.", fra: "2026-12-07", til: "2026-12-14" }
  ],
  dager: [
    { dato: "2026-11-29", timer: { mbf: 4, kjemi: 3 } },
    { dato: "2026-11-30", timer: { mbf: 3 }, merk: "MPN 1" },
    { dato: "2026-12-01", timer: { mbf: 1, kjemi: 1 }, merk: "Presentasjon i MBF 08:00–11:30 · MPN 1" },
    { dato: "2026-12-02", timer: { mbf: 2, kjemi: 1 } },
    { dato: "2026-12-03", timer: { mbf: 1, kjemi: 1, fysikk: 1 } },
    { dato: "2026-12-04", timer: { kjemi: 4 } },
    { dato: "2026-12-05", timer: { mbf: 7 } },
    { dato: "2026-12-06", timer: { mbf: 7 } },
    { dato: "2026-12-07", eksamen: "mbf" },
    { dato: "2026-12-08", timer: { kjemi: 7.5 } },
    { dato: "2026-12-09", eksamen: "kjemi", timer: { fysikk: 1 } },
    { dato: "2026-12-10", timer: { fysikk: 1.5 } },
    { dato: "2026-12-11", timer: { fysikk: 1.5 } },
    { dato: "2026-12-12", timer: { fysikk: 2 } },
    { dato: "2026-12-13", timer: { fysikk: 0.5 } },
    { dato: "2026-12-14", eksamen: "fysikk" }
  ]
};
