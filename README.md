# Sääennuste 2.0

Sääennuste 2.0 on VAMKin Johdatus sovelluskehitykseen -opintojakson aikana vaiheittain kehitettävä web-sovellus.

## Viikko 1

Ensimmäinen versio keskittyy semanttiseen HTML-rakenteeseen. CSS, JavaScript ja sää-API lisätään myöhemmissä viikkotehtävissä.

Viikko 1 sisältää staattisen etusivun (`index.html`), Tietoa-sivun (`about.html`) ja yhden paikallisen sääaiheisen kuvan.

## Viikko 2

Viikko 2 tuo projektiin ulkoisen `styles.css`-tyylitiedoston ja Minimal Nordic + Soft Cyber -visuaalisen tyylin. Toteutuksessa käytetään Box Modelia, Flexboxia ja CSS Gridiä sekä responsiivista `@media`-layoutia. Navigaatiossa on hover- ja focus-tilat, ja pinnoissa käytetään hillittyjä reunuksia, pyöristyksiä ja varjoja.

JavaScript ja reaaliaikainen sää-API-data oli siirretty myöhempiin viikkoihin; ajantasainen säädata toteutettiin Viikolla 4.

Viikon hero-kuvana käytetään projektia varten luotua AI-generoitua assetia `assets/images/hero-partly-cloudy.png`. Se ei ole valokuva Vantaasta.

## Viikko 3

Viikko 3 lisää etusivulle `script.js`-tiedoston ja paikallisen esimerkkisään vaihdon. Painike kierrättää demo-säätiloja ilman API-kutsua. Toteutuksessa on selkeä `if/else`-teemanvalinta, palauttava `getWeatherTheme(code)`-funktio, tuettujen teemojen array ja `forEach`-silmukka sekä oikea button ja click-event. Viikko 4 korvasi tämän demon oikealla säädatalla.

## Viikko 4

Viikko 4 korvaa paikallisen esimerkkisään Open-Meteon ajantasaisella säädatalla. Sovellus hakee oletuksena Helsingin sään, ja käyttäjä voi valita kaupungin manuaalisesti tai antaa erillisellä painikkeella luvan selaimen nykyisen sijainnin käyttöön. Sijaintia ei pyydetä automaattisesti.

API-vastauksesta käytetään lämpötilaa, suhteellista kosteutta, säätilakoodia ja tuulennopeutta. `weather_code` ohjaa seitsemää sääteemaa, joilla jokaisella on oma hero-kuva. Open-Meteo ei vaadi API-avainta.

Säädata: [Open-Meteo](https://open-meteo.com/)

### Kuvan lähde ja lisenssi

Kuva `assets/images/weather.jpg`:

- Tekijä: Gayatri Das
- Lähde: [Fair weather clouds.jpg, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Fair_weather_clouds.jpg)
- Lisenssi: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
