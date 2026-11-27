# Ukeplan mot JUUL: logg og kontroll

Privat app for å logge hva du har gjort i ukeplanen, og hvor godt du kontrollerer hvert tema. Loggen brukes til å revidere planen.

Repoet er privat. Planen er på emnenivå. Innhold fra øvingsark (ugradert, skal ikke publiseres) skal ikke legges inn her.

## Bruk

1. Åpne `index.html` i nettleseren (dobbeltklikk). Hvis GitHub-synken ikke virker når filen åpnes direkte, kjør `python3 -m http.server` i mappen og gå til http://localhost:8000.
2. **Dager**: sett status, minutter og notat på hver økt, og trykk Lagre.
3. **Kontroll**: gi temaet et nivå fra 1 til 5 etter økter og prøver. Hver lagring blir en ny vurdering, så historikken bevares.
4. **Oversikt**: se gjort mot planlagt og svakeste temaer.
5. **GitHub**: lag et fint-granulert token (GitHub → Settings → Developer settings → Fine-grained tokens) med tilgang bare til dette repoet og Contents: lese og skrive. Lim inn bruker, repo og token, og trykk Synkroniser nå. Tokenet lagres bare i denne nettleseren.

Dataene er lagret i nettleseren hele tiden. GitHub-synken slår sammen data fra flere enheter etter id, så ingenting blir overskrevet.

## Hjemskjerm (appikon)

Bildet i `icons/` brukes som appikon (180, 192 og 512 px) og som lite profilbilde øverst i appen. Navnet i appen er «Felix · Ukeplan mot JUUL», og på hjemskjermen vises «Ukeplan».

- Telefonen kan bare legge appen på hjemskjermen fra en https-adresse. Åpnes `index.html` som fil eller på localhost, går det ikke.
- iPhone: åpne adressen i Safari, trykk Del, og velg «Legg til på Hjem-skjerm».
- Android: åpne adressen i Chrome, trykk ⋮, og velg «Installer app».
- Hosting er ikke satt opp. Hvis repoet legges ut offentlig, er alt i det offentlig: `data/`, `plan.js` og bildet i `icons/`. Da bør data først flyttes til et eget privat repo.

## Filer

- `index.html`, `app.js`, `sync.js`, `styles.css`, `manifest.webmanifest`: appen.
- `icons/`: ikoner og profilbilde.
- `plan.js`: planen (økter, temaer og faste timer). Endres ved revisjon.
- `data/logg.json`: alle loggede økter. Hver lagring er en ny post.
- `data/kontroll.json`: alle kontrollvurderinger over tid.
- `revisjoner.md`: hva som er endret i planen etter hver revisjon, og hvorfor.

## Revisjon

Når du sier «revider», leser Claude `data/logg.json` og `data/kontroll.json` og endrer `plan.js` og `revisjoner.md`. Forslag til regler:

- Tema med nivå 1–2 og færre enn 3 dager til eksamen: legg til 60 min, og ta tiden fra et tema med nivå 4–5.
- Økt hoppet over: flytt den til neste ledige time. Kutt ikke søvn for å ta den igjen.
- Tema med nivå 5 to ganger på rad: ta det ut av planen.
- Lørdag og søndag 5.–6. des. er bare Brovakt. Tirsdag 8. des. er bare kjemi.

Endringer committes med meldingen «Revisjon: …», og begrunnelsen står i `revisjoner.md`.
