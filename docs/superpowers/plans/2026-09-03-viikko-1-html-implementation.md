# Viikko 1 HTML Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Toteuttaa Sääennuste 2.0 -projektin Viikko 1 -versio, joka täyttää kaikki DJ00BP24 Viikkotehtävä 1:n a–e-vaatimukset pelkällä semanttisella HTML:llä ja paikallisella kuvalla.

**Architecture:** Sovellus on tässä vaiheessa täysin staattinen kaksisivuinen HTML-sivusto. `index.html` sisältää sääpalvelun etusivun ja staattisen esimerkkisään, `about.html` kuvaa projektia ja sen vaiheittaista kehitystä, ja paikallinen kuva sijaitsee `assets/images/`-hakemistossa. CSS:ää, JavaScriptiä, API-kutsuja tai toimivaa säähakua ei lisätä Viikko 1:llä.

**Tech Stack:** HTML5, Git, GitHub. Ei CSS- tai JavaScript-toteutusta Viikko 1:llä.

**Spec:** `docs/superpowers/specs/2026-09-03-viikko-1-html-design.md`

## Global Constraints

- Viikko 1 sisältää vain HTML:n ja paikallisen kuvan.
- Ei CSS-tyylittelyä.
- Ei JavaScript-logiikkaa.
- Ei toimivaa kaupunkihakua.
- Ei Open-Meteo- tai muuta API-integraatiota.
- `index.html` sisältää vähintään `<header>`, `<nav>`, `<main>`, `<section>` ja `<footer>`.
- Toteutuksen tulee kattaa Viikkotehtävä 1:n kohdat a, b, c, d ja e.
- Koodin pitää olla opiskelijan ymmärrettävissä ja AI:n käyttö dokumentoidaan myöhemmin loppuraportissa.

---

### Task 1: Etusivun semanttinen HTML-runko

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: Ei aikaisempia sovellustiedostoja.
- Produces: Staattinen etusivu, johon `about.html` ja paikallinen kuva linkittyvät myöhemmissä tehtävissä.

- [ ] **Step 1: Luo HTML5-perusrakenne**

Luo `index.html`, jossa on `<!DOCTYPE html>`, `<html lang="fi">`, UTF-8-merkistö, viewport-meta ja kuvaava `<title>`.

- [ ] **Step 2: Lisää semanttinen sivurakenne**

Lisää seuraavat rakenteet tässä järjestyksessä:

```html
<header>...</header>
<nav>...</nav>
<main>
  <section>...</section>
  <section>...</section>
</main>
<footer>...</footer>
```

- [ ] **Step 3: Lisää arviointikriteerien vaatima sisältö**

Etusivulla tulee olla vähintään:

```html
<h1>Sääennuste 2.0</h1>
<h2>...</h2>
<p>...</p>
<a href="https://open-meteo.com/">Open-Meteo</a>
```

Ulkoinen linkki saa tässä vaiheessa kertoa tulevasta datalähteestä, mutta API:a ei vielä käytetä.

- [ ] **Step 4: Lisää staattinen esimerkkisää**

Lisää selkeä osio, jossa näkyy esimerkiksi:

```text
Vantaa
Lämpötila: 15 °C
Säätila: Puolipilvistä
Tuuli: 4 m/s
Ilmankosteus: 70 %
```

Merkitse sisällössä ymmärrettävästi, että kyse on esimerkkidatasta eikä reaaliaikaisesta säästä.

- [ ] **Step 5: Lisää luettelo tulevista ominaisuuksista**

Käytä `<ul>`- ja `<li>`-elementtejä esimerkiksi näin:

```html
<ul>
  <li>Ajankohtainen sää</li>
  <li>Päivän ennuste</li>
  <li>Tulevien päivien ennuste</li>
</ul>
```

- [ ] **Step 6: Tarkista rakenne paikallisesti**

PowerShellissa:

```powershell
Select-String -Path .\index.html -Pattern '<h1','<h2','<p','<a ','<ul','<li','<header','<nav','<main','<section','<footer'
```

Expected: jokaisesta vaaditusta HTML-rakenteesta löytyy vähintään yksi osuma.

---

### Task 2: Paikallinen kuva ja Tietoa-sivu

**Files:**
- Create: `about.html`
- Create: `assets/images/weather.jpg` tai `assets/images/weather.png`
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 1:n `index.html`.
- Produces: Toimiva kaksisivuinen navigaatio ja paikallinen kuva suhteellisella polulla.

- [ ] **Step 1: Lisää paikallinen sääaiheinen kuva**

Tallenna yksi käyttöoikeuksiltaan sopiva sääaiheinen kuva hakemistoon `assets/images/`.

- [ ] **Step 2: Liitä kuva etusivulle suhteellisella polulla**

Käytä rakennetta:

```html
<img src="assets/images/weather.jpg" alt="Kuvaava sääaiheinen vaihtoehtoinen teksti">
```

Jos tiedoston pääte on `.png`, käytä vastaavaa polkua. `alt`-tekstin tulee kuvata kuvan sisältöä, ei olla esimerkiksi `"kuva"`.

- [ ] **Step 3: Luo `about.html`**

Sivulla tulee olla HTML5-perusrakenne ja semanttiset elementit. Sisällössä kuvataan lyhyesti:

```text
- mikä Sääennuste 2.0 on
- että projekti kehittyy viikko viikolta
- että Viikko 1 keskittyy HTML-rakenteeseen
```

- [ ] **Step 4: Tee navigoinnista kaksisuuntainen**

`index.html`:

```html
<a href="index.html">Etusivu</a>
<a href="about.html">Tietoa</a>
```

`about.html` sisältää vähintään linkin takaisin `index.html`:ään.

- [ ] **Step 5: Tarkista tiedostot ja linkit**

PowerShellissa:

```powershell
Test-Path .\index.html
Test-Path .\about.html
Get-ChildItem .\assets\images\
Select-String -Path .\index.html -Pattern 'about.html','assets/images/','alt='
Select-String -Path .\about.html -Pattern 'index.html'
```

Expected: molemmat HTML-tiedostot ja kuva löytyvät, ja linkit/polut näkyvät tulosteessa.

---

### Task 3: README ja Viikko 1:n laadullinen tarkistus

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Valmis `index.html`, `about.html` ja kuva.
- Produces: Lyhyt projektikuvaus sekä tarkistettu Viikko 1 a–e -kokonaisuus.

- [ ] **Step 1: Päivitä README**

README:ssa tulee kuvata ainakin:

```markdown
# Sääennuste 2.0

Sääennuste 2.0 on VAMKin Johdatus sovelluskehitykseen -opintojakson aikana vaiheittain kehitettävä web-sovellus.

## Viikko 1

Ensimmäinen versio keskittyy semanttiseen HTML-rakenteeseen. CSS, JavaScript ja sää-API lisätään myöhemmissä viikkotehtävissä.
```

Älä väitä Viikko 1 -versiossa olevan ominaisuuksia, joita ei ole vielä toteutettu.

- [ ] **Step 2: Avaa `index.html` selaimessa**

Tarkista manuaalisesti:

```text
- sivu avautuu ilman rikkinäistä rakennetta
- kuva näkyy
- Tietoa-linkki avaa about.html:n
- about.html:stä pääsee takaisin etusivulle
- ulkoinen linkki toimii
- ääkköset näkyvät oikein
```

- [ ] **Step 3: Tarkista Viikkotehtävä 1 a–e**

```text
a) index.html + h1 + h2 + p + ulkoinen linkki
b) paikallinen img + suhteellinen polku + kuvaava alt
c) ul/ol + li
d) header + nav + main + section + footer
e) about.html + AI/dokumentaation hyödyntäminen
```

Expected: kaikki viisi kohtaa ovat todennettavissa suoraan reposta.

- [ ] **Step 4: Tarkista ettei tulevien viikkojen toteutuksia ole lisätty**

PowerShellissa:

```powershell
Get-ChildItem -Recurse -File | Select-Object FullName
```

Expected: Viikko 1 -sovelluksessa ei ole `style.css`:ää, `script.js`:ää eikä API-toteutusta.

---

### Task 4: Commit, push ja Viikko 1 -snapshot

**Files:**
- No new application files.

**Interfaces:**
- Consumes: Tarkistettu Viikko 1 a–e -toteutus.
- Produces: GitHubissa säilyvä Viikko 1 -versio, jonka voi myöhemmin palauttaa ja verrata seuraaviin viikkoihin.

- [ ] **Step 1: Tarkista Git-diff**

```powershell
git status
git diff -- index.html about.html README.md
```

Tarkista, ettei commitissa ole ylimääräisiä tai tuleville viikoille kuuluvia muutoksia.

- [ ] **Step 2: Commitoi Viikko 1**

```powershell
git add index.html about.html README.md assets
git commit -m "feat: complete week 1 HTML structure"
```

- [ ] **Step 3: Pushaa `main` GitHubiin**

```powershell
git push origin main
```

- [ ] **Step 4: Luo Viikko 1 -tagi**

```powershell
git tag -a viikko-1 -m "Viikko 1: HTML a-e"
git push origin viikko-1
```

- [ ] **Step 5: Valmistele Moodle-palautuksen tieto**

Palautustiedoston nimeksi:

```text
JSK2026_viikko1_abcde.txt
```

Sen vähimmäissisältö:

```text
GitHub repository:
https://github.com/watisdiz/saaennuste-2

Viikko 1 tag:
https://github.com/watisdiz/saaennuste-2/tree/viikko-1
```

Sovelluksen live-URL voidaan lisätä myöhemmin, jos GitHub Pages otetaan käyttöön ennen varsinaista Viikko 5 -tehtävää.
