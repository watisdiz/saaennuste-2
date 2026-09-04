# Viikko 3 JavaScript Design Spec

## Tavoite

Lisätä Sääennuste 2.0 -sovellukseen ensimmäinen käyttäytymiskerros JavaScriptillä siten, että Viikko 3:n arviointikriteerit a–e täyttyvät yhden aidon ominaisuuden kautta. Käyttäjä voi vaihtaa esimerkkisäätilaa painikkeella, ja sovellus valitsee sääteeman JavaScript-logiikalla.

Viikko 3 ei käytä ulkoista API:a. Kaikki säätilat ovat paikallista demodataa. Viikko 4 voi myöhemmin korvata kovakoodatun weather code -arvon Open-Meteon oikealla datalla ilman että teemanvalintalogiikka tarvitsee rakentaa uudelleen.

## Rajaus

Viikko 3 sisältää HTML-, CSS- ja JavaScript-muutoksia vain siinä määrin kuin JavaScript-ominaisuus niitä tarvitsee.

Ei toteuteta:

- `fetch()`-kutsuja tai muuta API-liikennettä
- geolokaatiota
- hakukenttää
- ulkoisia kirjastoja tai frameworkeja
- localStoragea
- automaattista säädatan päivitystä
- uusia liiketoiminnallisia ominaisuuksia arviointikriteerien ulkopuolelta

Viikko 2:n Minimal Nordic + Soft Cyber -design säilyy visuaalisena perustana.

## Käyttäjäkokemus

Hero-alueelle lisätään yksi hillitty painike:

**Vaihda esimerkkisäätä**

Painike vaihtaa paikallisten demo-säätilojen välillä. Jokaisella painalluksella:

1. aktiivinen demo-säätila vaihtuu seuraavaan
2. säätilan teksti päivittyy
3. hero saa uuden teemaluokan
4. hero-kuva vaihtuu vain jos kyseiselle teemalle on olemassa paikallinen asset
5. valittu teema tulostetaan konsoliin

Painike sopii nykyiseen designiin eikä kilpaile lämpötilan tai säätilan kanssa.

## Sääteemat

Sovellus varautuu seitsemään teemaan:

- `clear`
- `partly-cloudy`
- `cloudy`
- `rain`
- `thunder`
- `snow`
- `fog`

Viikko 3:ssa kaikkien seitsemän teeman nimet voivat olla JavaScript-taulukossa, mutta kuvallisia assetteja ei tarvitse olla kaikille. Nykyinen `hero-partly-cloudy.png` säilyy toimivana fallback-kuvana.

Demo-tilat pidetään opetuksellisesti yksinkertaisina. Esimerkiksi taulukossa voidaan käyttää olioita:

```js
const demoWeatherStates = [
  { code: 0, label: "Selkeää" },
  { code: 2, label: "Puolipilvistä" },
  { code: 61, label: "Sadetta" },
  { code: 71, label: "Lumisadetta" }
];
```

Näin painike voi näyttää muutoksen näkyvästi ilman API:a.

## JavaScript-rakenne

Luodaan yksi ulkoinen tiedosto:

`script.js`

Se linkitetään `index.html`:ään `defer`-attribuutilla.

JavaScript pidetään aloituskurssille sopivana ja helposti selitettävänä. Ei moduulijakoa, build-vaihetta tai monimutkaista tilanhallintaa.

### a) Muuttujat ja console.log

Käytetään vähintään yhtä `const`- tai `let`-muuttujaa ja tulostetaan nykyinen sääteema konsoliin.

Esimerkiksi:

```js
const weatherCode = 2;
console.log("Nykyinen sääteema:", getWeatherTheme(weatherCode));
```

### b) if / else

Teeman valinta tehdään näkyvästi `if / else if / else` -rakenteella.

Esimerkkimapping:

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

Tämän rakenteen tarkoitus on samalla valmistaa Viikko 4:n Open-Meteo weather code -dataa varten.

### c) Funktio ja return

`getWeatherTheme(code)` ottaa argumentin ja palauttaa teeman merkkijonona.

Lisäksi voidaan käyttää pientä `renderDemoWeather(state)`-funktiota DOM-päivityksiin, mutta arviointikriteerin varsinainen palauttava funktio on `getWeatherTheme`.

### d) Taulukko ja silmukka

Seitsemän tuettua teemaa määritellään taulukossa:

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
```

Taulukko käydään läpi `forEach`-silmukalla ja teemat tulostetaan konsoliin. Tämä tekee arviointievidenssin suoraksi ilman että käyttöliittymään lisätään turhaa sisältöä.

### e) Button + event listener

`index.html`:ään lisätään painike, jonka click-tapahtuma rekisteröidään `addEventListener("click", ...)`-kutsulla.

Painike kierrättää `demoWeatherStates`-taulukon säätiloja. Indeksiä ylläpidetään `let`-muuttujalla.

## DOM-päivitys

JavaScript saa päivittää vain elementtejä, joilla on selkeä tarkoitus:

- säätilan teksti
- hero-alueen teemaluokka
- mahdollinen hero-kuvan `src` ja `alt`, jos teemalle on asset
- painikkeen saavutettava nimi tarvittaessa

Lämpötila voidaan pitää kaikissa demoissa `15°`, ellei toteutuksen aikana päätetä käyttää muutamaa paikallista esimerkkilämpötilaa. Uutta dataa ei lisätä vain visuaalisen täytteen vuoksi.

## CSS-teemaluokat

Hero-alueelle käytetään yhtä teemaluokkaa kerrallaan, esimerkiksi:

- `theme-clear`
- `theme-partly-cloudy`
- `theme-cloudy`
- `theme-rain`
- `theme-thunder`
- `theme-snow`
- `theme-fog`

Viikko 3:ssa CSS-muutosten pitää olla pieniä. Teemaluokat voivat esimerkiksi muuttaa overlayn sävyä, accent-intensiteettiä tai muuta hillittyä visuaalista yksityiskohtaa. Seitsemää täysin erillistä designia ei rakenneta.

## Responsiivisuus

Uusi painike ja mahdolliset teemamuutokset eivät saa rikkoa Viikko 2:n mobile-first-layoutia.

Vähimmäisvaatimukset:

- painike toimii noin 360–375 px leveydellä
- metriikkakortit pysyvät mobiilissa pinottuina
- hero ei kasva hallitsemattomasti
- ei vaakasuuntaista overflowta
- desktopin kolmen sarakkeen metriikkarakenne säilyy

## Saavutettavuus

- käytetään oikeaa `<button>`-elementtiä
- painike toimii näppäimistöllä ilman erillistä JavaScript-käsittelyä
- `:focus-visible` säilyy
- dekoratiivisia muutoksia ei käytetä ainoana tapana kertoa säätilan vaihtumisesta; näkyvä säätilateksti päivittyy
- mahdollisten kuvavaihtojen alt-teksti päivitetään kuvaamaan uutta kuvaa

## Tuleva Viikko 4

Tärkein jatkopolku on:

```text
Viikko 3:
paikallinen weather code -> getWeatherTheme(code) -> hero-teema

Viikko 4:
Open-Meteo weather code -> getWeatherTheme(code) -> sama hero-teema
```

Viikko 3:ssa ei tehdä API-rakennetta etukäteen.

## Hyväksymiskriteerit

Viikko 3 on valmis reviewhun, kun:

1. `script.js` on olemassa ja linkitetty `index.html`:ään.
2. Koodissa käytetään `let`/`const`-muuttujaa ja `console.log`-tulostusta.
3. `getWeatherTheme(code)` käyttää `if / else` -rakennetta ja palauttaa arvon `return`-lauseella.
4. Seitsemän teemaa ovat taulukossa ja taulukko käydään läpi `forEach`- tai `for`-silmukalla.
5. Sivulla on toimiva `Vaihda esimerkkisäätä` -button ja click-event listener.
6. Painike vaihtaa näkyvästi vähintään useamman demo-säätilan välillä.
7. Viikko 2:n responsiivinen design ei regressioidu.
8. `fetch`, `axios`, `XMLHttpRequest` tai muuta API-koodia ei lisätä.
9. `viikko-1` ja `viikko-2` -tagit pysyvät muuttumattomina.
10. Muutoksia ei yhdistetä `main`-haaraan eikä `viikko-3`-tagia luoda ennen reviewta.
