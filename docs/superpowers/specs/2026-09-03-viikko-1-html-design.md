# Viikko 1 HTML - design

## Tavoite

Rakennetaan Sääennuste 2.0 -projektin ensimmäinen versio tarkoituksella pelkkänä HTML-toteutuksena. Viikko 1:n version tarkoitus on osoittaa HTML-rakenteen, semanttisten elementtien ja sisällön jäsentämisen hallinta ennen CSS:n, JavaScriptin ja API-integraation lisäämistä myöhemmillä viikoilla.

## Rajaus

Viikko 1 sisältää vain HTML:n ja paikallisen kuvan. Tässä vaiheessa ei toteuteta:

- CSS-tyylittelyä
- JavaScript-logiikkaa
- toimivaa kaupunkihakua
- Open-Meteo- tai muuta API-integraatiota
- GitHub Pages -julkaisun laadunvarmistusta

Nämä lisätään myöhemmillä viikoilla kurssin etenemisen mukaisesti.

## Sivut ja tiedostot

Projektin Viikko 1 -versiossa on vähintään:

- `index.html`
- `about.html`
- `assets/images/` ja yksi paikallinen sääaiheinen kuva
- `README.md`

CSS- ja JavaScript-tiedostoja ei tarvita Viikko 1:n toteutukseen.

## Etusivun rakenne

`index.html` sisältää semanttisen HTML5-rakenteen:

- `<header>`: palvelun nimi ja lyhyt kuvaus
- `<nav>`: linkit etusivulle ja Tietoa-sivulle
- `<main>`: varsinainen sisältö
- vähintään kaksi `<section>`-osiota
- `<footer>`: projektin perustieto

Sisällössä on:

- vähintään yksi `<h1>`-otsikko
- vähintään yksi `<h2>`-otsikko
- tekstikappaleita `<p>`
- toimiva ulkoinen linkki, esimerkiksi Open-Meteon sivulle tai HTML-dokumentaatioon
- paikallinen `<img>`-kuva suhteellisella tiedostopolulla ja kuvaavalla `alt`-tekstillä
- luettelo `<ul>` tai `<ol>` ja `<li>`, esimerkiksi palvelun tulevista ominaisuuksista
- staattinen esimerkkisää, esimerkiksi Vantaa, jotta sivun myöhempi kehitys oikeaa säädataa käyttäväksi voidaan osoittaa selkeästi

## Tietoa-sivu

`about.html` on toinen sivu, joka täyttää itsenäisen soveltamisen vaatimusta. Sivulla kuvataan lyhyesti:

- mikä Sääennuste 2.0 on
- että projekti kehittyy kurssin aikana vaiheittain
- että Viikko 1 keskittyy HTML-rakenteeseen

Sivulta on navigointi takaisin etusivulle.

## Viikko 1:n arviointikriteerien kattavuus

### a) Perusrunko

- kehitysympäristö käytössä
- `index.html` sisältää HTML-perusrakenteen
- vähintään kaksi eri tasoista otsikkoa
- tekstikappaleita
- toimiva ulkoinen linkki

### b) Laajennus I

- paikallinen kuva suhteellisella tiedostopolulla
- kuvaava `alt`-teksti

### c) Laajennus II

- luettelo tiedon jäsentämiseksi

### d) Laajennus III

- semanttiset HTML5-elementit: `header`, `nav`, `main`, `section`, `footer`

### e) Itsenäinen soveltaminen

- toinen sivu `about.html`
- tekoälyä ja/tai dokumentaatiota hyödynnetään toteutuksen tukena ja käyttö raportoidaan myöhemmin loppuraportissa

## Git- ja palautusmalli

Viikko 1:n valmistuessa:

1. kaikki Viikko 1:n a-e-kohdat tarkistetaan
2. muutokset commitoidaan `main`-haaraan
3. luodaan tagi `viikko-1`
4. Moodleen palautetaan `JSK2026_viikko1_abcde.txt`, jossa on GitHub-linkki ja haluttaessa linkki Viikko 1 -tagiin

## Myöhempi kehitys

Samaa sovellusta kehitetään vaiheittain:

- Viikko 1: HTML
- Viikko 2: CSS ja responsiivisuus
- Viikko 3: JavaScript
- Viikko 4: Open-Meteo API ja dynaaminen säädata
- Viikko 5: GitHub Pages, CI/CD-havainnointi ja laadunvarmistus
- Viikko 6: käytettävyys-, saavutettavuus-, kyberturva- ja AI-analyysi

Tavoitteena on, että Git-historia ja viikkotagit näyttävät selkeästi sovelluksen kehittymisen vaihe vaiheelta.