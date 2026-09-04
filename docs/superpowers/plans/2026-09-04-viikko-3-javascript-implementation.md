# Viikko 3 JavaScript Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lisätä Sääennuste 2.0 -sovellukseen paikallinen JavaScript-demo, jossa käyttäjä voi vaihtaa esimerkkisäätilaa ja jossa Viikko 3:n arviointikriteerit a–e täyttyvät yhden yhtenäisen ominaisuuden kautta.

**Architecture:** Luo yksi ulkoinen `script.js`, joka sisältää demo-säätilat, palauttavan `getWeatherTheme(code)`-funktion, teema-arrayn, `forEach`-evidenssin sekä click-eventin. `index.html` saa vain JavaScriptin tarvitsemat hookit ja yhden painikkeen. `styles.css` saa vain rajatut button- ja theme-tyylit ilman Viikko 2:n designin uudelleenrakentamista.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Git, PowerShell/Node-validoinnit, selainpohjainen manuaalitestaus.

**Spec:** `docs/superpowers/specs/2026-09-04-viikko-3-javascript-design.md`

## Global Constraints

- Viikko 3 käyttää vain vanilla JavaScriptiä; ei frameworkeja tai ulkoisia JS-kirjastoja.
- Ei API-kutsuja: ei `fetch`, `axios`, `XMLHttpRequest` eikä geolokaatiota.
- Viikko 2:n Minimal Nordic + Soft Cyber -design säilytetään.
- Nykyinen `hero-partly-cloudy.png` säilyy toimivana fallback-hero-kuvana.
- Uusia sääasset-kuvia ei lisätä tässä toteutuksessa ilman erillistä hyväksyntää.
- `viikko-1`- ja `viikko-2`-tageja ei saa muuttaa.
- Älä mergeä `main`-haaraan tai luo `viikko-3`-tagia ennen erillistä reviewta.

---

## File Structure

- Create: `script.js` — Viikko 3:n muuttujat, `if/else`, palauttava funktio, array + loop, demo-state ja click-event.
- Modify: `index.html` — `defer`-script-linkitys, JavaScript-hookit ja `Vaihda esimerkkisäätä` -button.
- Modify: `styles.css` — buttonin sekä rajattujen `theme-*`-luokkien visuaaliset tilat.
- Modify: `README.md` — lyhyt Viikko 3 -kuvaus ja a–e-kattavuus.

---

### Task 1: Lisää JavaScript-tiedosto ja kurssin a–d-perusrakenne

**Files:**
- Create: `script.js`
- Modify: `index.html`

**Interfaces:**
- Produces: `getWeatherTheme(code) -> string`, `supportedThemes`, `demoWeatherStates`, `currentDemoIndex`.

- [ ] **Step 1: Varmista, ettei script.js vielä ole olemassa**

Run:

```powershell
Test-Path .\script.js
```

Expected before implementation: `False`.

- [ ] **Step 2: Linkitä script.js index.html:ään**

Lisää `<head>`-osaan CSS-linkin jälkeen:

```html
<script src="script.js" defer></script>
```

Älä lisää scriptiä `about.html`:ään, koska Viikko 3:n interaktiivinen demo on etusivulla.

- [ ] **Step 3: Luo tuettujen teemojen taulukko**

Lisää `script.js`:ään:

```js
const supportedThemes = [
  "clear",
  "partly-cloudy",
  "cloudy",
  "rain",
  "thunder",
  "snow",
  "fog"
];

supportedThemes.forEach((theme) => {
  console.log("Tuettu sääteema:", theme);
});
```

Tämä toimii suorana d-kohdan array + loop -evidenssinä.

- [ ] **Step 4: Luo palauttava if/else-funktio**

Lisää:

```js
function getWeatherTheme(code) {
  if (code === 0) {
    return "clear";
  } else if (code >= 1 && code <= 3) {
    return "partly-cloudy";
  } else if (code === 45 || code === 48) {
    return "fog";
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return "rain";
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return "snow";
  } else if (code >= 95) {
    return "thunder";
  } else {
    return "cloudy";
  }
}
```

Tämä täyttää b- ja c-kohdat.

- [ ] **Step 5: Lisää demodatan taulukko ja muuttuja**

Käytä esimerkiksi:

```js
const demoWeatherStates = [
  { code: 2, label: "Puolipilvistä" },
  { code: 0, label: "Selkeää" },
  { code: 61, label: "Sadetta" },
  { code: 71, label: "Lumisadetta" }
];

let currentDemoIndex = 0;
const initialTheme = getWeatherTheme(demoWeatherStates[currentDemoIndex].code);
console.log("Nykyinen sääteema:", initialTheme);
```

Tämä tekee a-kohdan `let`/`const` + `console.log`-evidenssin näkyväksi.

- [ ] **Step 6: Suorita staattinen a–d-validointi**

Run:

```powershell
Test-Path .\script.js
Select-String -Path .\index.html -Pattern 'script.js'
Select-String -Path .\script.js -Pattern '\b(const|let)\b'
Select-String -Path .\script.js -Pattern 'console\.log'
Select-String -Path .\script.js -Pattern '\bif\s*\('
Select-String -Path .\script.js -Pattern '\belse\b'
Select-String -Path .\script.js -Pattern 'function\s+getWeatherTheme'
Select-String -Path .\script.js -Pattern '\breturn\b'
Select-String -Path .\script.js -Pattern 'supportedThemes'
Select-String -Path .\script.js -Pattern 'forEach\s*\('
```

Expected: kaikki osumat löytyvät.

---

### Task 2: Lisää painike ja DOM-päivitys

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: Task 1:n `demoWeatherStates`, `currentDemoIndex`, `getWeatherTheme(code)`.
- Produces: `renderDemoWeather(state)` ja click-event käyttäjän demovaihtoon.

- [ ] **Step 1: Lisää selkeät DOM-hookit nykyisiin elementteihin**

Pidä nykyinen semanttinen rakenne. Lisää tarvittaessa ID:t:

```html
<section id="weatherHero" class="weather-hero theme-partly-cloudy" ...>
...
<p id="weatherStatus" class="weather-status">Puolipilvistä</p>
```

Nykyistä näkyvää tekstiä ei tarvitse muuttaa tässä vaiheessa.

- [ ] **Step 2: Lisää oikea button-elementti**

Lisää hero-summaryyn tai hero-alueen loppuun ennen metriikoita:

```html
<button id="changeWeatherButton" class="weather-demo-button" type="button">
  Vaihda esimerkkisäätä
</button>
```

Painikkeen tulee olla saavutettava ilman JavaScriptillä rakennettua custom-buttonia.

- [ ] **Step 3: Toteuta renderDemoWeather(state)**

Lisää `script.js`:ään:

```js
function renderDemoWeather(state) {
  const hero = document.querySelector("#weatherHero");
  const status = document.querySelector("#weatherStatus");
  const theme = getWeatherTheme(state.code);

  supportedThemes.forEach((supportedTheme) => {
    hero.classList.remove(`theme-${supportedTheme}`);
  });

  hero.classList.add(`theme-${theme}`);
  status.textContent = state.label;

  console.log("Valittu demo:", state.label, "Teema:", theme);
}
```

Tarkoitus on pitää DOM-päivitys suorana ja helposti selitettävänä.

- [ ] **Step 4: Lisää click-event listener**

Lisää:

```js
const changeWeatherButton = document.querySelector("#changeWeatherButton");

changeWeatherButton.addEventListener("click", () => {
  currentDemoIndex = (currentDemoIndex + 1) % demoWeatherStates.length;
  renderDemoWeather(demoWeatherStates[currentDemoIndex]);
});
```

Tämä on e-kohdan suora evidenssi.

- [ ] **Step 5: Tyylittele painike nykyiseen designiin**

Lisää `styles.css`:ään hillitty Minimal Nordic + Soft Cyber -button:

- läpikuultava tumma pinta
- cyan border/tekstikorostus
- nykyisen `:hover` ja `:focus-visible` -kielen kanssa yhtenäinen
- riittävä touch target
- ei neon-glow-överiä

Esimerkiksi suunnaksi:

```css
.weather-demo-button {
  width: fit-content;
  min-height: 2.75rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid rgba(0, 240, 255, 0.45);
  border-radius: 999px;
  background: rgba(18, 24, 36, 0.5);
  color: var(--text);
  font: inherit;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease;
}
```

Lisää hover ja focus-visible ilman designin muuttamista.

- [ ] **Step 6: Suorita e-kohdan staattinen validointi**

Run:

```powershell
Select-String -Path .\index.html -Pattern '<button[^>]+changeWeatherButton'
Select-String -Path .\script.js -Pattern 'addEventListener\("click"'
Select-String -Path .\script.js -Pattern 'renderDemoWeather'
```

Expected: kaikki löytyvät.

---

### Task 3: Lisää seitsemän theme-luokan rajattu CSS-valmius

**Files:**
- Modify: `styles.css`

**Interfaces:**
- Consumes: `theme-*`-luokka hero-elementillä.
- Produces: seitsemän turvallista visuaalista tilaa ilman uusia assetteja tai API:a.

- [ ] **Step 1: Säilytä partly-cloudy oletustilana**

Nykyinen hero-kuva pysyy muuttumattomana fallback-kuvana. Älä lisää uutta `img`-asset-logiikkaa tässä taskissa.

- [ ] **Step 2: Lisää hillityt theme-luokat**

Lisää `styles.css`:ään yksi selkeä tapa erottaa teemat, esimerkiksi CSS custom property overlay-sävylle:

```css
.weather-hero {
  --theme-overlay: rgba(8, 15, 20, 0.25);
}

.theme-clear {
  --theme-overlay: rgba(17, 48, 66, 0.2);
}

.theme-partly-cloudy {
  --theme-overlay: rgba(8, 15, 20, 0.25);
}

.theme-cloudy {
  --theme-overlay: rgba(15, 23, 34, 0.4);
}

.theme-rain {
  --theme-overlay: rgba(8, 29, 42, 0.48);
}

.theme-thunder {
  --theme-overlay: rgba(10, 12, 26, 0.58);
}

.theme-snow {
  --theme-overlay: rgba(72, 95, 113, 0.28);
}

.theme-fog {
  --theme-overlay: rgba(93, 109, 121, 0.32);
}
```

Kytke overlay käyttämään muuttujaa ilman että nykyinen luettavuus heikkenee.

- [ ] **Step 3: Varmista, että kaikki seitsemän teemaa löytyvät CSS:stä**

Run:

```powershell
$themes = 'clear','partly-cloudy','cloudy','rain','thunder','snow','fog'
$themes | ForEach-Object {
  Select-String -Path .\styles.css -Pattern "\.theme-$($_)"
}
```

Expected: seitsemän osumaa.

- [ ] **Step 4: Tarkista ettei CSS-ratkaisu riko Viikko 2:n responsiivisuutta**

Tarkista lähdekoodista, että:

```powershell
Select-String -Path .\styles.css -Pattern '@media\s*\(min-width:\s*760px\)'
Select-String -Path .\styles.css -Pattern 'grid-template-columns:\s*1fr'
Select-String -Path .\styles.css -Pattern 'repeat\(3,\s*minmax\(0,\s*1fr\)\)'
```

Kaikkien tulee edelleen löytyä.

---

### Task 4: Selainkäyttäytyminen ja kurssikriteerien end-to-end review

**Files:**
- No new files.

**Interfaces:**
- Consumes: valmis HTML/CSS/JS-toteutus.
- Produces: review-evidenssi ennen dokumentointia ja committia.

- [ ] **Step 1: Avaa index.html paikallisessa selaimessa**

Varmista aloitustila:

- VANTAA näkyy
- 15° näkyy
- Puolipilvistä näkyy
- `Vaihda esimerkkisäätä` näkyy
- konsolissa näkyy tuetut teemat ja nykyinen teema

- [ ] **Step 2: Klikkaa painiketta useita kertoja**

Varmista järjestyksessä ainakin:

```text
Puolipilvistä -> Selkeää -> Sadetta -> Lumisadetta -> Puolipilvistä
```

Jokaisella painalluksella:

- näkyvä säätilateksti vaihtuu
- hero saa odotetun `theme-*`-luokan
- konsoliin tulostuu valittu demo ja teema
- sivu ei reloadaa

- [ ] **Step 3: Tarkista mobiili noin 375 px**

Varmista:

- painike mahtuu hero-alueelle
- metriikkakortit pysyvät pinottuina
- säätilateksti ei leikkaannu
- ei vaakasuuntaista overflowta

- [ ] **Step 4: Tarkista desktop noin 1280–1440 px**

Varmista:

- kolme metriikkaa ovat edelleen samalla rivillä
- painike ei hallitse visuaalista hierarkiaa
- hero säilyy C-designin mukaisena

- [ ] **Step 5: Tarkista selaimen konsoli**

Expected:

- ei JavaScript runtime -virheitä
- `console.log`-evidenssi näkyy

---

### Task 5: README, lopullinen validointi ja review-gate

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: valmis Viikko 3 -toteutus.
- Produces: review-valmis feature branch.

- [ ] **Step 1: Lisää README:hen lyhyt Viikko 3 -osio**

Dokumentoi tiiviisti:

- uusi `script.js`
- paikallinen demo-säänvaihto
- `if/else`-teemanvalinta
- palauttava funktio
- array + `forEach`
- button + click-event
- ei vielä API:a; oikea data tulee Viikko 4:ssa

- [ ] **Step 2: Aja lopullinen a–e-validointi**

Run:

```powershell
$checks = @(
  (Test-Path .\script.js),
  ((Select-String .\index.html 'script.js').Count -ge 1),
  ((Select-String .\script.js '\b(const|let)\b').Count -ge 1),
  ((Select-String .\script.js 'console\.log').Count -ge 1),
  ((Select-String .\script.js '\bif\s*\(').Count -ge 1),
  ((Select-String .\script.js '\belse\b').Count -ge 1),
  ((Select-String .\script.js 'function\s+getWeatherTheme').Count -ge 1),
  ((Select-String .\script.js '\breturn\b').Count -ge 1),
  ((Select-String .\script.js 'supportedThemes').Count -ge 1),
  ((Select-String .\script.js 'forEach\s*\(').Count -ge 1),
  ((Select-String .\index.html '<button').Count -ge 1),
  ((Select-String .\script.js 'addEventListener\("click"').Count -ge 1)
)
$checks
$checks -notcontains $false
```

Expected final line: `True`.

- [ ] **Step 3: Varmista API-rajaus**

Run:

```powershell
Select-String -Path .\script.js,.\index.html -Pattern 'fetch\(|axios|XMLHttpRequest|geolocation' -ErrorAction SilentlyContinue
```

Expected: ei osumia.

- [ ] **Step 4: Tarkista git-diff**

Run:

```powershell
git diff --check
git status
git diff --stat
git diff -- index.html styles.css script.js README.md
```

Review että diffissä on vain Viikko 3:n JS-demoa tukevia muutoksia.

- [ ] **Step 5: Varmista frozen history**

Tarkista:

- `CNAME` ei muuttunut
- `assets/images/weather.jpg` ei muuttunut
- `assets/images/hero-partly-cloudy.png` ei muuttunut
- `viikko-1` ja `viikko-2` pysyvät samoissa commiteissa

- [ ] **Step 6: STOP ennen committia**

Älä commitoi tai pushaa ennen ihmisen selainreviewta.

Raportoi:

1. muutetut tiedostot
2. a–e-evidenssi
3. `getWeatherTheme`-mapping
4. demo-säätilojen kierto
5. validation tulokset
6. selain- ja konsolitarkistukset
7. mobiili/desktop-regressiotarkistus
8. mahdolliset poikkeamat specistä
9. git status ja diff-stat
10. vahvistus ettei API:a lisätty

---

## Review Gate

Kun yllä oleva toteutus on valmis, ihmisen tulee tarkistaa selaimessa vähintään:

- painike näyttää designiin sopivalta
- neljän demo-säätilan kierto toimii
- säätilateksti todella vaihtuu
- hero-teeman visuaalinen muutos on hillitty mutta havaittava
- mobiili ei regressioidu
- konsolissa ei ole virheitä

Vasta hyväksynnän jälkeen suoritetaan erillinen commit/push-vaihe. Suositeltu commit-viesti myöhemmin:

```text
feat: complete week 3 JavaScript interactions
```
