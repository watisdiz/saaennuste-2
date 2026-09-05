# Viikko 4 Open-Meteo API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Muuttaa Sääennuste 2.0:n Viikko 3:n paikallinen säädemo oikeaa Open-Meteo-dataa käyttäväksi sääsovellukseksi, jossa on Helsinki oletuksena, manuaalinen kaupunkivalinta, vapaaehtoinen selaimen geolocation ja seitsemän oikeasti vaihtuvaa hero-kuvaa.

**Architecture:** Yksi yhteinen `fetchWeather(latitude, longitude, locationLabel)` hakee nykyiset sääarvot Open-Meteosta. Manuaalinen kaupunkivalinta ja geolocation syöttävät koordinaatit samaan hakupolkuun. Viikko 3:n `getWeatherTheme(code)` säilyy teemaluokituksen ytimenä, ja API:n `weather_code` ohjaa sekä suomenkielistä säätekstiä että yhden seitsemästä hero-kuvasta.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Fetch API, Browser Geolocation API, Open-Meteo Weather Forecast API, Git/GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-05-viikko-4-open-meteo-design.md`

## Global Constraints

- Oletuskaupunki on **Helsinki**.
- Sijaintia ei pyydetä automaattisesti sivun latauksessa.
- Geolocation-tilassa otsikko on **NYKYINEN SIJAINTI**; reverse geocodingia tai lähimmän kaupungin laskentaa ei tehdä.
- Manuaalinen kaupunkivalinta toimii aina ilman sijaintilupaa.
- Käytetään vain Open-Meteon `current`-kenttiä `temperature_2m`, `relative_humidity_2m`, `weather_code`, `wind_speed_10m` ja `wind_speed_unit=ms`.
- API-avainta, backendia, frameworkia tai uutta build-vaihetta ei lisätä.
- Kaikilla seitsemällä teemalla (`clear`, `partly-cloudy`, `cloudy`, `rain`, `thunder`, `snow`, `fog`) on oma hero-kuva.
- Sama kuva + CSS-filtteri ei korvaa teemakuvaa.
- Viikko 3:n demodata ja `Vaihda esimerkkisäätä` poistetaan tuotantokäytöstä.
- Open-Meteon attribuutiolinkki näkyy käyttöliittymässä.
- Mobile-first-rakenne säilyy ja 375 px näkymä ei saa aiheuttaa vaakasuuntaista overflowta.
- `viikko-1`, `viikko-2` ja `viikko-3` -tageihin ei kosketa.
- `main`-haaraan ei yhdistetä eikä `viikko-4`-tagia luoda ennen reviewta.
- Projektiin ei lisätä testikirjastoa. Käytä `node --check`, DOM-/source-tarkistuksia ja selaimen manuaalisia smoke-testejä.

## File Structure

- Modify: `index.html` — säädatan DOM-kohteet, kaupunkivalinta, geolocation-painike, loading/error-status, attribuutio.
- Modify: `styles.css` — kontrollien, statusviestien ja loading/error-tilojen responsiivinen ulkoasu.
- Modify: `script.js` — kaupunkidata, Open-Meteo-haku, WMO-mapping, renderöinti, geolocation ja eventit.
- Modify: `README.md` — Viikko 4:n toteutuksen ja Open-Meteo-käytön dokumentointi.
- Add to Git from existing local files: `assets/images/hero-clear.png`, `hero-cloudy.png`, `hero-rain.png`, `hero-thunder.png`, `hero-snow.png`, `hero-fog.png`.
- Keep: `assets/images/hero-partly-cloudy.png` — Viikko 2/3:n nykyinen kuva, joka toimii `partly-cloudy`-teemana.

---

### Task 1: Lisää seitsemän hero-assetin 1:1 mapping Git-seurantaan

**Files:**
- Add: `assets/images/hero-clear.png`
- Keep: `assets/images/hero-partly-cloudy.png`
- Add: `assets/images/hero-cloudy.png`
- Add: `assets/images/hero-rain.png`
- Add: `assets/images/hero-thunder.png`
- Add: `assets/images/hero-snow.png`
- Add: `assets/images/hero-fog.png`

**Interfaces:**
- Consumes: käyttäjän paikallisesti kansioon `assets/images/` lisäämät kuvat.
- Produces: täsmälleen seitsemän polkua, joita `script.js` käyttää myöhemmin `heroImages`-mappingissa.

- [ ] **Step 1: Varmista paikalliset assetit ennen muutoksia**

Run:

```bash
ls assets/images/hero-*.png
```

Windows PowerShell vaihtoehto:

```powershell
Get-ChildItem assets/images/hero-*.png | Select-Object Name, Length
```

Expected: listassa ovat `hero-clear.png`, `hero-partly-cloudy.png`, `hero-cloudy.png`, `hero-rain.png`, `hero-thunder.png`, `hero-snow.png`, `hero-fog.png`; jokaisen tiedostokoko on yli 0 tavua.

- [ ] **Step 2: Tarkista ettei uusia kuvia ole vahingossa nimetty väärin**

Run:

```powershell
$expected = @('hero-clear.png','hero-partly-cloudy.png','hero-cloudy.png','hero-rain.png','hero-thunder.png','hero-snow.png','hero-fog.png')
$actual = Get-ChildItem assets/images/hero-*.png | ForEach-Object Name
Compare-Object $expected $actual
```

Expected: ei outputia.

- [ ] **Step 3: Lisää kuvat Git-seurantaan**

```bash
git add assets/images/hero-clear.png assets/images/hero-cloudy.png assets/images/hero-rain.png assets/images/hero-thunder.png assets/images/hero-snow.png assets/images/hero-fog.png
```

Do not modify or re-add `hero-partly-cloudy.png` unless Git reports it changed locally.

- [ ] **Step 4: Tarkista staged-lista**

```bash
git diff --cached --name-status
```

Expected: kuusi uutta hero-kuvaa näkyy `A`-tilassa eikä vanhoja tageja tai muita tiedostoja ole muuttunut.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add weather hero themes"
```

---

### Task 2: Korvaa demokontrollit oikean säädatan HTML-rakenteella

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: nykyiset `#weatherHero`, `#weatherStatus`, `#weatherMetricStatus` DOM-hookit.
- Produces: `#locationName`, `#dataBadge`, `#temperatureValue`, `#weatherStatus`, `#windValue`, `#humidityValue`, `#weatherMetricStatus`, `#weatherImage`, `#weatherFigureCaption`, `#citySelect`, `#useLocationButton`, `#weatherFeedback`.

- [ ] **Step 1: Kirjaa nykyinen baseline ennen HTML-muutosta**

Run:

```bash
git grep -n "Vaihda esimerkkisäätä\|ESIMERKKIDATA\|staattinen esimerkkidata" -- index.html
```

Expected: nykyiset Viikko 3:n demotekstit löytyvät.

- [ ] **Step 2: Tee hero-sisällöstä API-renderöinnille osoitettava**

Muuta hero-summaryn ydinelementit tähän muotoon:

```html
<p id="locationName" class="location">HELSINKI</p>
<p id="dataBadge" class="sample-badge">
  <span class="status-dot" aria-hidden="true"></span>AJANTASAINEN SÄÄ
</p>
<h2 id="temperatureValue" class="temperature">--°</h2>
<p id="weatherStatus" class="weather-status">Haetaan säätietoja...</p>
<p class="weather-note">
  Säädata: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
</p>
```

Poista `#changeWeatherButton` kokonaan.

- [ ] **Step 3: Lisää sääkontrollit semanttisena ryhmänä**

Lisää hero-summaryyn säätekstien jälkeen:

```html
<div class="weather-controls" aria-label="Sijainnin valinta">
  <div class="city-control">
    <label for="citySelect">Valitse kaupunki</label>
    <select id="citySelect">
      <option value="helsinki" selected>Helsinki</option>
      <option value="vantaa">Vantaa</option>
      <option value="tampere">Tampere</option>
      <option value="turku">Turku</option>
      <option value="oulu">Oulu</option>
      <option value="rovaniemi">Rovaniemi</option>
      <option value="kuopio">Kuopio</option>
      <option value="jyvaskyla">Jyväskylä</option>
      <option value="vaasa">Vaasa</option>
      <option value="lappeenranta">Lappeenranta</option>
    </select>
  </div>
  <button id="useLocationButton" class="weather-action-button weather-action-button-secondary" type="button">
    Käytä nykyistä sijaintiani
  </button>
</div>
<p id="weatherFeedback" class="weather-feedback" role="status" aria-live="polite">Haetaan Helsingin säätietoja...</p>
```

- [ ] **Step 4: Lisää metriikoille ja hero-kuvalle DOM-id:t**

Tuuli:

```html
<strong id="windValue">-- m/s</strong>
```

Kosteus:

```html
<strong id="humidityValue">-- %</strong>
```

Säätila säilyy:

```html
<strong id="weatherMetricStatus">Haetaan...</strong>
```

Hero-kuva:

```html
<img id="weatherImage" src="assets/images/hero-partly-cloudy.png" alt="Puolipilvinen sää">
<figcaption id="weatherFigureCaption">Puolipilvinen säämaisema.</figcaption>
```

- [ ] **Step 5: Päivitä tulevien ominaisuuksien teksti**

Poista väite, että ajankohtainen sää tai Open-Meteo tulee vasta myöhemmin. Jätä tuleviksi ominaisuuksiksi esimerkiksi päivän ennuste ja tulevien päivien ennuste. Nykyisen sään pitää näyttäytyä jo toteutettuna ominaisuutena.

- [ ] **Step 6: Tarkista HTML:n hookit**

Run:

```bash
git grep -n "locationName\|citySelect\|useLocationButton\|weatherFeedback\|weatherImage\|windValue\|humidityValue" -- index.html
```

Expected: kaikki kahdeksan hookia löytyvät.

Run:

```bash
git grep -n "Vaihda esimerkkisäätä\|staattinen esimerkkidata" -- index.html
```

Expected: ei outputia.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: add weather location controls"
```

---

### Task 3: Lisää Open-Meteo-data- ja weather-code-logiikka

**Files:**
- Modify: `script.js`

**Interfaces:**
- Consumes: Task 2:n DOM-id:t ja olemassa oleva `getWeatherTheme(code)`, jossa Open-Meteon WMO-koodit `1`–`2` mapataan `partly-cloudy`-teemaan ja koodi `3` `cloudy`-teemaan.
- Produces: `cities`, `heroImages`, `getWeatherLabel(code)`, `setLoading(isLoading, message)`, `showFeedback(message, type)`, `renderWeather(data, locationLabel)`, `fetchWeather(latitude, longitude, locationLabel)`.

- [ ] **Step 1: Poista Viikko 3:n demostate ja click-handler sekä korjaa pilvisyksen WMO-teemamapping**

Poista kokonaan:

```javascript
const demoWeatherStates = [/* ... */];
let currentDemoIndex = 0;
const initialTheme = /* ... */;
function renderDemoWeather(state) { /* ... */ }
const changeWeatherButton = /* ... */;
changeWeatherButton.addEventListener(/* ... */);
```

Säilytä `supportedThemes` ja `getWeatherTheme(code)`.

Korjaa `getWeatherTheme(code)` niin, että `code >= 1 && code <= 2` palauttaa `"partly-cloudy"` ja `code === 3` palauttaa `"cloudy"`. Tämä varmistaa, että kaikki seitsemän hero-teemaa ovat saavutettavia validista Open-Meteo WMO-datasta.

- [ ] **Step 2: Lisää kiinteät kaupunkikoordinaatit**

```javascript
const cities = {
  helsinki: { label: "HELSINKI", latitude: 60.1699, longitude: 24.9384 },
  vantaa: { label: "VANTAA", latitude: 60.2934, longitude: 25.0378 },
  tampere: { label: "TAMPERE", latitude: 61.4978, longitude: 23.7610 },
  turku: { label: "TURKU", latitude: 60.4518, longitude: 22.2666 },
  oulu: { label: "OULU", latitude: 65.0121, longitude: 25.4651 },
  rovaniemi: { label: "ROVANIEMI", latitude: 66.5039, longitude: 25.7294 },
  kuopio: { label: "KUOPIO", latitude: 62.8924, longitude: 27.6770 },
  jyvaskyla: { label: "JYVÄSKYLÄ", latitude: 62.2426, longitude: 25.7473 },
  vaasa: { label: "VAASA", latitude: 63.0951, longitude: 21.6165 },
  lappeenranta: { label: "LAPPEENRANTA", latitude: 61.0587, longitude: 28.1887 }
};
```

- [ ] **Step 3: Lisää seitsemän hero-kuvan mapping**

```javascript
const heroImages = {
  clear: "assets/images/hero-clear.png",
  "partly-cloudy": "assets/images/hero-partly-cloudy.png",
  cloudy: "assets/images/hero-cloudy.png",
  rain: "assets/images/hero-rain.png",
  thunder: "assets/images/hero-thunder.png",
  snow: "assets/images/hero-snow.png",
  fog: "assets/images/hero-fog.png"
};
```

- [ ] **Step 4: Lisää suomenkielinen WMO-label-funktio**

```javascript
function getWeatherLabel(code) {
  if (code === 0) {
    return "Selkeää";
  } else if (code >= 1 && code <= 2) {
    return "Puolipilvistä";
  } else if (code === 3) {
    return "Pilvistä";
  } else if (code === 45 || code === 48) {
    return "Sumua";
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return "Sadetta";
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return "Lumisadetta";
  } else if (code >= 95 && code <= 99) {
    return "Ukkosta";
  }

  return "Pilvistä";
}
```

- [ ] **Step 5: Cacheta DOM-elementit kerran**

```javascript
const hero = document.querySelector("#weatherHero");
const locationName = document.querySelector("#locationName");
const dataBadge = document.querySelector("#dataBadge");
const temperatureValue = document.querySelector("#temperatureValue");
const weatherStatus = document.querySelector("#weatherStatus");
const windValue = document.querySelector("#windValue");
const humidityValue = document.querySelector("#humidityValue");
const weatherMetricStatus = document.querySelector("#weatherMetricStatus");
const weatherImage = document.querySelector("#weatherImage");
const weatherFigureCaption = document.querySelector("#weatherFigureCaption");
const citySelect = document.querySelector("#citySelect");
const useLocationButton = document.querySelector("#useLocationButton");
const weatherFeedback = document.querySelector("#weatherFeedback");
```

- [ ] **Step 6: Lisää loading- ja feedback-funktiot**

```javascript
function setLoading(isLoading, message = "") {
  useLocationButton.disabled = isLoading;
  citySelect.disabled = isLoading;
  hero.classList.toggle("is-loading", isLoading);

  if (message) {
    showFeedback(message, "loading");
  }
}

function showFeedback(message, type = "info") {
  weatherFeedback.textContent = message;
  weatherFeedback.dataset.state = type;
}
```

- [ ] **Step 7: Lisää yksi renderöintifunktio API-datalle**

```javascript
function renderWeather(data, locationLabel) {
  const current = data.current;
  const theme = getWeatherTheme(current.weather_code);
  const label = getWeatherLabel(current.weather_code);

  supportedThemes.forEach((supportedTheme) => {
    hero.classList.remove(`theme-${supportedTheme}`);
  });

  hero.classList.add(`theme-${theme}`);
  locationName.textContent = locationLabel;
  temperatureValue.textContent = `${Math.round(current.temperature_2m)}°`;
  weatherStatus.textContent = label;
  windValue.textContent = `${current.wind_speed_10m.toFixed(1)} m/s`;
  humidityValue.textContent = `${Math.round(current.relative_humidity_2m)} %`;
  weatherMetricStatus.textContent = label;
  weatherImage.src = heroImages[theme];
  weatherImage.alt = `${label}, säämaisema`;
  weatherFigureCaption.textContent = `${label}, sääteema.`;
  dataBadge.lastChild.textContent = "AJANTASAINEN SÄÄ";
}
```

Jos `dataBadge.lastChild` osoittautuu whitespace-text-nodeksi DOM:ssa, vaihda HTML:ään erillinen `<span id="dataBadgeText">AJANTASAINEN SÄÄ</span>` ja päivitä sitä suoraan. Älä jätä hauraan text-node-rakenteen varaan.

- [ ] **Step 8: Lisää yhteinen Open-Meteo fetch**

```javascript
async function fetchWeather(latitude, longitude, locationLabel) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
    wind_speed_unit: "ms"
  });

  setLoading(true, "Haetaan säätietoja...");

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

    if (!response.ok) {
      throw new Error(`Open-Meteo vastasi HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Open-Meteo vastaus:", data);

    if (!data.current) {
      throw new Error("Open-Meteo-vastauksesta puuttuu current-data");
    }

    renderWeather(data, locationLabel);
    showFeedback(`Säätiedot päivitetty: ${locationLabel}`, "success");
  } catch (error) {
    console.error("Säätietojen haku epäonnistui:", error);
    showFeedback("Säätietojen hakeminen epäonnistui. Yritä uudelleen.", "error");
  } finally {
    setLoading(false);
  }
}
```

- [ ] **Step 9: Tarkista JavaScript-syntaksi**

Run:

```bash
node --check script.js
```

Expected: exit code 0, ei syntax error -outputia.

- [ ] **Step 10: Commit**

```bash
git add script.js
git commit -m "feat: fetch and render Open-Meteo weather"
```

---

### Task 4: Kytke kaupunkivalinta, geolocation ja Helsinki-oletushaku

**Files:**
- Modify: `script.js`

**Interfaces:**
- Consumes: Task 3:n `cities` ja `fetchWeather(latitude, longitude, locationLabel)`.
- Produces: `fetchSelectedCity()`, `useCurrentLocation()` sekä sivun latauksen Helsinki-haku.

- [ ] **Step 1: Lisää manuaalisen kaupungin hakufunktio**

```javascript
function fetchSelectedCity() {
  const city = cities[citySelect.value];
  fetchWeather(city.latitude, city.longitude, city.label);
}
```

- [ ] **Step 2: Lisää geolocation vain käyttäjän painalluksesta**

```javascript
function useCurrentLocation() {
  if (!navigator.geolocation) {
    showFeedback("Selain ei tue sijaintipalvelua. Valitse kaupunki listasta.", "error");
    return;
  }

  setLoading(true, "Haetaan nykyistä sijaintia...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude, "NYKYINEN SIJAINTI");
    },
    (error) => {
      console.warn("Sijainnin hakeminen epäonnistui:", error);
      setLoading(false);
      showFeedback("Sijaintia ei käytetty. Voit valita kaupungin listasta.", "error");
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}
```

- [ ] **Step 3: Kytke event listenerit**

```javascript
citySelect.addEventListener("change", fetchSelectedCity);
useLocationButton.addEventListener("click", useCurrentLocation);
```

Älä kytke geolocationia `DOMContentLoaded`-eventtiin tai automaattiseksi sivulatauksessa.

- [ ] **Step 4: Hae Helsinki automaattisesti sivun latauksessa**

```javascript
const defaultCity = cities.helsinki;
fetchWeather(defaultCity.latitude, defaultCity.longitude, defaultCity.label);
```

Tämän pitää olla ainoa automaattinen sijaintiin liittyvä haku. Se ei käytä selaimen sijaintia.

- [ ] **Step 5: Tarkista, ettei automaattista geolocation-kutsua ole**

Run:

```bash
git grep -n "getCurrentPosition" -- script.js
```

Expected: kutsu esiintyy vain `useCurrentLocation()`-funktion sisällä.

- [ ] **Step 6: Tarkista syntaksi**

```bash
node --check script.js
```

Expected: exit code 0.

- [ ] **Step 7: Commit**

```bash
git add script.js
git commit -m "feat: add city and geolocation weather lookup"
```

---

### Task 5: Viimeistele kontrollien, loadingin ja virhetilojen CSS

**Files:**
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.weather-controls`, `.city-control`, `.weather-action-button`, `.weather-feedback`, `[data-state]`, `.is-loading` Task 2/3:sta.
- Produces: mobile-first käyttöliittymä, joka säilyttää nykyisen Minimal Nordic + Soft Cyber -ilmeen.

- [ ] **Step 1: Korvaa vanhan demo-painikkeen tyylit yhteisillä action-button-tyyleillä**

Poista `.weather-demo-button`-säännöt ja lisää:

```css
.weather-controls {
  display: grid;
  gap: 0.75rem;
  max-width: 34rem;
  margin-top: 1.25rem;
}

.city-control {
  display: grid;
  gap: 0.35rem;
}

.city-control label {
  color: var(--muted);
  font-size: 0.8rem;
}

.city-control select,
.weather-action-button {
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid rgba(0, 240, 255, 0.45);
  border-radius: 0.8rem;
  background: rgba(18, 24, 36, 0.72);
  color: var(--text);
  font: inherit;
}

.city-control select {
  padding: 0.6rem 0.75rem;
}

.weather-action-button {
  padding: 0.65rem 0.9rem;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
}

.weather-action-button:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.city-control select:focus-visible,
.weather-action-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.weather-action-button:disabled,
.city-control select:disabled {
  cursor: wait;
  opacity: 0.58;
}
```

- [ ] **Step 2: Lisää näkyvät loading/error/success-tilat ilman väririippuvuutta**

```css
.weather-feedback {
  min-height: 1.5rem;
  margin: 0.75rem 0 0;
  color: var(--muted);
  font-size: 0.82rem;
}

.weather-feedback[data-state="loading"]::before {
  content: "↻ ";
}

.weather-feedback[data-state="success"]::before {
  content: "✓ ";
}

.weather-feedback[data-state="error"]::before {
  content: "! ";
}

.weather-feedback[data-state="error"] {
  color: var(--text);
  font-weight: 600;
}

.weather-hero.is-loading .weather-figure img {
  opacity: 0.82;
}
```

Älä piilota virhettä pelkällä punaisella värillä; viesti ja `!` välittävät tilan tekstuaalisesti.

- [ ] **Step 3: Lisää desktopissa kompakti kontrollirivi**

Nykyiseen `@media (min-width: 760px)` -lohkoon:

```css
.weather-controls {
  grid-template-columns: minmax(12rem, 1.2fr) auto auto;
  align-items: end;
}

.weather-action-button {
  width: auto;
}
```

Jos `Käytä nykyistä sijaintiani` ei mahdu 760 px kohdalla siististi, pidä grid kahdella sarakkeella 760–899 px ja siirrä kolmen sarakkeen sääntö erilliseen `@media (min-width: 900px)` -lohkoon. Älä hyväksy tekstin päällekkäisyyttä tai horizontal overflowta.

- [ ] **Step 4: Tarkista ettei vanhaa demo-button CSS:ää jää**

```bash
git grep -n "weather-demo-button" -- styles.css index.html script.js
```

Expected: ei outputia.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "style: add weather API controls and states"
```

---

### Task 6: Dokumentoi Viikko 4 ja tee kokonaisuuden verifiointi

**Files:**
- Modify: `README.md`
- Verify: `index.html`, `styles.css`, `script.js`, `assets/images/hero-*.png`

**Interfaces:**
- Consumes: Tasks 1–5:n valmis ominaisuus.
- Produces: review-valmis `week-4-api`-haara, ei mergeä eikä `viikko-4`-tagia.

- [ ] **Step 1: Lisää README:hen Viikko 4 -osio**

Lisää Viikko 3:n jälkeen:

```markdown
## Viikko 4

Viikko 4 korvaa paikallisen esimerkkisään Open-Meteon ajantasaisella säädatalla. Sovellus hakee oletuksena Helsingin sään, ja käyttäjä voi valita kaupungin manuaalisesti tai antaa erillisellä painikkeella luvan selaimen nykyisen sijainnin käyttöön. Sijaintia ei pyydetä automaattisesti.

API-vastauksesta käytetään lämpötilaa, suhteellista kosteutta, säätilakoodia ja tuulennopeutta. `weather_code` ohjaa seitsemää sääteemaa, joilla jokaisella on oma hero-kuva. Open-Meteo ei vaadi API-avainta.

Säädata: [Open-Meteo](https://open-meteo.com/)
```

Muuta myös vanha Viikko 2/3 -teksti, jos se edelleen väittää API:n tulevan vasta tulevaisuudessa. Säilytä historiallinen kuvaus niin, että Viikko 3:n kohdalla voidaan sanoa API:n tulleen Viikko 4:ssä.

- [ ] **Step 2: Tee source-level tarkistukset**

```bash
node --check script.js
git diff --check
git grep -n "fetch(" -- script.js
git grep -n "console.log" -- script.js
git grep -n "getCurrentPosition" -- script.js
git grep -n "Open-Meteo" -- index.html README.md script.js
```

Expected:
- `node --check`: exit 0
- `git diff --check`: exit 0
- `fetch(` löytyy yhteisestä API-funktiosta
- `console.log` sisältää API-vastauksen
- `getCurrentPosition` löytyy vain käyttäjäaloitteisesta funktiosta
- Open-Meteo näkyy käyttöliittymässä/dokumentaatiossa

- [ ] **Step 3: Varmista kaikki seitsemän hero-kuvaa Gitistä**

```bash
git ls-files "assets/images/hero-*.png"
```

Expected täsmälleen:

```text
assets/images/hero-clear.png
assets/images/hero-cloudy.png
assets/images/hero-fog.png
assets/images/hero-partly-cloudy.png
assets/images/hero-rain.png
assets/images/hero-snow.png
assets/images/hero-thunder.png
```

- [ ] **Step 4: Käynnistä paikallinen selainpalvelin**

Esimerkiksi Pythonilla projektin juuressa:

```bash
python -m http.server 8000
```

Avaa `http://localhost:8000/` Chromessa.

- [ ] **Step 5: Testaa Helsinki-oletuspolku**

Expected selaimen reloadin jälkeen:
- sijainti on `HELSINKI`
- loading-viesti näkyy hetkellisesti
- lämpötila, tuuli, kosteus ja säätila täyttyvät API-datasta
- `ESIMERKKIDATA` ei näy
- DevTools Networkissa Open-Meteo-pyyntö palauttaa onnistuneen vastauksen
- Consolessa näkyy `Open-Meteo vastaus:` eikä uncaught runtime erroria ole.

- [ ] **Step 6: Testaa manuaalinen kaupunkivalinta**

Valitse vähintään `Rovaniemi`.

Expected:
- sijainti vaihtuu `ROVANIEMI`
- uusi Open-Meteo-pyyntö lähtee Rovaniemen koordinaateilla
- arvot renderöityvät uudelleen
- hero vastaa palautettua weather code -teemaa.

Valitse sen jälkeen `Vantaa` ja varmista sama polku.

- [ ] **Step 7: Testaa hyväksytty geolocation**

Paina **Käytä nykyistä sijaintiani** ja hyväksy selaimen sijaintilupa.

Expected:
- otsikko vaihtuu `NYKYINEN SIJAINTI`
- API-pyyntö käyttää selaimen palauttamia koordinaatteja
- sovellus ei yritä nimetä koordinaatteja Vantaaksi tai muuksi kaupungiksi
- manuaalinen select jää edelleen käytettäväksi seuraavaan hakuun.

- [ ] **Step 8: Testaa evätty geolocation**

Nollaa sivuston location permission tai käytä DevToolsin permission overridea, paina painiketta ja estä lupa.

Expected:
- viesti `Sijaintia ei käytetty. Voit valita kaupungin listasta.`
- viimeisin onnistunut sää jää näkyviin
- kontrollit palautuvat aktiivisiksi
- manuaalinen kaupunkivalinta toimii edelleen.

- [ ] **Step 9: Testaa kaikki seitsemän hero-mappingia ilman API-sään odottamista**

Aja DevTools Consolessa yksi teema kerrallaan ja varmista tiedostopolku sekä kuvan latautuminen. Käytä esimerkiksi:

```javascript
Object.entries(heroImages).forEach(([theme, src]) => console.log(theme, src));
```

Expected: seitsemän uniikkia `assets/images/hero-*.png`-polkua. Tarkista lisäksi Network/Elementsista, ettei yksikään kuva anna 404:ää.

Koska todellinen sää ei välttämättä tarjoa testipäivänä kaikkia sääkoodeja, tämä mapping-tarkistus täydentää live-API-smoke-testin.

- [ ] **Step 10: Testaa responsiivisuus**

Chrome DevTools:
- width `375`, height `812`
- desktop vähintään `1280 × 800`

Expected 375 px:
- ei horizontal overflowta
- select ja painikkeet mahtuvat
- tekstit eivät mene päällekkäin
- metriikat ovat yhdessä sarakkeessa.

Expected desktop:
- metriikat ovat kolmessa sarakkeessa
- hero-kuva täyttää taustan
- kontrollit ovat selkeät eivätkä peitä sääsisältöä.

- [ ] **Step 11: Tee saavutettavuuden nopea smoke check**

Keyboard-only:
- Tab saavuttaa selectin, sijaintipainikkeen ja Open-Meteo-linkin
- focus-visible näkyy jokaisessa
- statusviesti ilmoitetaan `role="status" aria-live="polite"` -alueella.

- [ ] **Step 12: Päivitä README ja commit**

```bash
git add README.md
git commit -m "docs: document week 4 weather API"
```

- [ ] **Step 13: Final branch verification**

```bash
git status --short
git log --oneline --decorate -8
git diff main...HEAD --check
git diff --name-status main...HEAD
```

Expected:
- working tree clean
- branch on `week-4-api`
- diff sisältää specin, planin, kuusi uutta hero-kuvaa sekä `index.html`, `styles.css`, `script.js`, `README.md`
- `main` ei ole muuttunut tämän toteutuksen vuoksi
- `viikko-4`-tagia ei ole vielä luotu.

Stop here for human visual review. Do not merge to `main`, delete the feature branch or create/push the `viikko-4` tag before explicit approval.
