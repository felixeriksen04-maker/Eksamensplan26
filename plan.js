// Ukeplan mot JUUL: plan, økter og temaer.
// Emnenivå: ingen øvingsoppgaver og ingen innhold fra øvingsark. Revideres ut fra loggen.
(function () {
  var brovakt = [
    { id: "b-sjoveis-a", fag: "brovakt", navn: "Sjøveisreglene del A" },
    { id: "b-sjoveis-b", fag: "brovakt", navn: "Sjøveisreglene del B" },
    { id: "b-krefter", fag: "brovakt", navn: "Krefter og manøvrering" },
    { id: "b-vts", fag: "brovakt", navn: "VTS og sjøtrafikkforskriften" },
    { id: "b-ankring", fag: "brovakt", navn: "Ankring" },
    { id: "b-fortoyning", fag: "brovakt", navn: "Fortøyning" },
    { id: "b-iala", fag: "brovakt", navn: "IALA og tidevann" },
    { id: "b-brovaktforskrift", fag: "brovakt", navn: "Brovaktforskriften og ulykkesrapportering" },
    { id: "b-smcp", fag: "brovakt", navn: "SMCP" }
  ];
  var kjemi = [];
  for (var i = 0; i <= 13; i++) {
    kjemi.push({ id: "k-wp" + i, fag: "kjemi", navn: "WP" + i });
  }
  var fysikk = [
    { id: "f-43", fag: "fysikk", navn: "Uke 43: Bevegelse" },
    { id: "f-44", fag: "fysikk", navn: "Uke 44: Krefter og Newtons lover" },
    { id: "f-45", fag: "fysikk", navn: "Uke 45: Krefter og bevegelse" },
    { id: "f-46", fag: "fysikk", navn: "Uke 46: Energi og arbeid" },
    { id: "f-47", fag: "fysikk", navn: "Uke 47: Hydrodynamikk" },
    { id: "f-48", fag: "fysikk", navn: "Uke 48: Rotasjonsdynamikk" },
    { id: "f-49", fag: "fysikk", navn: "Uke 49: Statikk og stabilitet" }
  ];

  window.PLAN = {
    versjon: 1,
    revidert: "2026-11-27",
    startdato: "2026-11-29",
    sluttdato: "2026-12-14",
    eksamener: [
      { fag: "brovakt", navn: "Brovakt og fartøyskontroll", kode: "NAV2301", dato: "2026-12-07", tid: "tid ikke oppgitt" },
      { fag: "kjemi", navn: "Kjemi", kode: "ING2324", dato: "2026-12-09", tid: "tid ikke oppgitt" },
      { fag: "fysikk", navn: "Fysikk", kode: "ING2321", dato: "2026-12-14", tid: "09:00–14:00, Idrettshallen" }
    ],
    fag: {
      brovakt: { navn: "Brovakt", farge: "#1F4E79" },
      kjemi: { navn: "Kjemi", farge: "#2F7D5B" },
      fysikk: { navn: "Fysikk", farge: "#B4541A" }
    },
    temaer: brovakt.concat(kjemi, fysikk),
    faste: [
      { dato: "2026-11-30", tid: "12:30–15:40", fag: "fysikk", tekst: "Statikk og stabilitet" },
      { dato: "2026-11-30", tid: "tid ikke oppgitt", fag: null, tekst: "MPN 1 (første dag)" },
      { dato: "2026-12-01", tid: "tid ikke oppgitt", fag: null, tekst: "MPN 1 (andre dag)" },
      { dato: "2026-12-01", tid: "08:00–11:30", fag: "brovakt", tekst: "Presentasjon med sensor" },
      { dato: "2026-12-02", tid: "08:00–11:00", fag: "fysikk", tekst: "Statikk og stabilitet" },
      { dato: "2026-12-02", tid: "12:00–15:30", fag: "brovakt", tekst: "Brovakt-repetisjon" },
      { dato: "2026-12-03", tid: "09:35–14:00", fag: "fysikk", tekst: "Oppgaveregning og ukesoppgave (lunsj 11:00–12:30)" },
      { dato: "2026-12-04", tid: "08:00–11:30", fag: "brovakt", tekst: "Brovakt-repetisjon" },
      { dato: "2026-12-10", tid: "tid ikke oppgitt", fag: "fysikk", tekst: "Repetisjon før eksamen" }
    ],
    sesjoner: [
      { id: "s01", dato: "2026-11-29", fag: "brovakt", navn: "Presentasjon", temaer: ["b-brovaktforskrift"], min: 180, type: "studie" },
      { id: "s02", dato: "2026-11-29", fag: "brovakt", navn: "Krefter og manøvrering", temaer: ["b-krefter"], min: 60, type: "studie" },
      { id: "s03", dato: "2026-11-30", fag: "brovakt", navn: "Ferdig presentasjon", temaer: ["b-brovaktforskrift"], min: 60, type: "studie" },
      { id: "s04", dato: "2026-11-30", fag: "brovakt", navn: "Sjøveisreglene del A", temaer: ["b-sjoveis-a"], min: 120, type: "studie" },
      { id: "s05", dato: "2026-12-01", fag: "brovakt", navn: "Kveld: SMCP og notater", temaer: ["b-smcp"], min: 60, type: "studie" },
      { id: "s06", dato: "2026-12-02", fag: "brovakt", navn: "Sjøveisreglene del B", temaer: ["b-sjoveis-b"], min: 120, type: "studie" },
      { id: "s07", dato: "2026-12-03", fag: "brovakt", navn: "VTS og sjøtrafikkforskriften", temaer: ["b-vts"], min: 60, type: "studie" },
      { id: "s08", dato: "2026-12-05", fag: "brovakt", navn: "Krefter og manøvrering", temaer: ["b-krefter"], min: 120, type: "studie" },
      { id: "s09", dato: "2026-12-05", fag: "brovakt", navn: "Ankring", temaer: ["b-ankring"], min: 60, type: "studie" },
      { id: "s10", dato: "2026-12-05", fag: "brovakt", navn: "Fortøyning", temaer: ["b-fortoyning"], min: 60, type: "studie" },
      { id: "s11", dato: "2026-12-05", fag: "brovakt", navn: "IALA og tidevann", temaer: ["b-iala"], min: 60, type: "studie" },
      { id: "s12", dato: "2026-12-05", fag: "brovakt", navn: "Prøveeksamen på tid", temaer: [], min: 120, type: "prove" },
      { id: "s13", dato: "2026-12-06", fag: "brovakt", navn: "Gjennomgang av prøveeksamen", temaer: [], min: 120, type: "repetisjon" },
      { id: "s14", dato: "2026-12-06", fag: "brovakt", navn: "Svake punkter og feillogg", temaer: [], min: 180, type: "repetisjon" },
      { id: "s15", dato: "2026-12-06", fag: "brovakt", navn: "SMCP og repetisjon av brovaktforskrift og gruntvann", temaer: ["b-smcp", "b-brovaktforskrift", "b-krefter"], min: 120, type: "repetisjon" },
      { id: "s16", dato: "2026-11-29", fag: "kjemi", navn: "Kjemi WP0–WP2", temaer: ["k-wp0", "k-wp1", "k-wp2"], min: 180, type: "studie" },
      { id: "s17", dato: "2026-12-01", fag: "kjemi", navn: "Kjemi WP3", temaer: ["k-wp3"], min: 60, type: "studie" },
      { id: "s18", dato: "2026-12-02", fag: "kjemi", navn: "Kjemi WP4", temaer: ["k-wp4"], min: 60, type: "studie" },
      { id: "s19", dato: "2026-12-03", fag: "kjemi", navn: "Kjemi WP5", temaer: ["k-wp5"], min: 60, type: "studie" },
      { id: "s20", dato: "2026-12-04", fag: "kjemi", navn: "Kjemi WP6–WP9", temaer: ["k-wp6", "k-wp7", "k-wp8", "k-wp9"], min: 240, type: "studie" },
      { id: "s21", dato: "2026-12-08", fag: "kjemi", navn: "Kjemi WP10–WP13", temaer: ["k-wp10", "k-wp11", "k-wp12", "k-wp13"], min: 240, type: "studie" },
      { id: "s22", dato: "2026-12-08", fag: "kjemi", navn: "Generalprøve på tid", temaer: [], min: 120, type: "prove" },
      { id: "s23", dato: "2026-12-08", fag: "kjemi", navn: "Svake veipunkter og eksamensord", temaer: [], min: 90, type: "repetisjon" },
      { id: "s24", dato: "2026-12-03", fag: "fysikk", navn: "Ukesoppgave i statikk", temaer: ["f-49"], min: 60, type: "studie" },
      { id: "s25", dato: "2026-12-09", fag: "fysikk", navn: "Statikk etter eksamen", temaer: ["f-49"], min: 60, type: "studie" },
      { id: "s26", dato: "2026-12-10", fag: "fysikk", navn: "Formelsamlingen som oppslag og feillogg", temaer: [], min: 90, type: "repetisjon" },
      { id: "s27", dato: "2026-12-11", fag: "fysikk", navn: "Statikk og stabilitet kontrollert, feillogg", temaer: ["f-49"], min: 90, type: "studie" },
      { id: "s28", dato: "2026-12-12", fag: "fysikk", navn: "Kort prøveeksamen", temaer: [], min: 90, type: "prove" },
      { id: "s29", dato: "2026-12-12", fag: "fysikk", navn: "Gjennomgang av prøveeksamen", temaer: [], min: 30, type: "repetisjon" },
      { id: "s30", dato: "2026-12-13", fag: "fysikk", navn: "Lett formelrepetisjon", temaer: [], min: 30, type: "repetisjon" }
    ]
  };
})();
