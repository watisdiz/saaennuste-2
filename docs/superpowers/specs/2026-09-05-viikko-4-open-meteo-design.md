# Viikko 4 Open-Meteo API Design Spec

## Tavoite

Viikko 4 muuttaa Sääennuste 2.0 -sovelluksen paikallisesta demosta oikeaa säädataa käyttäväksi sovellukseksi. Data haetaan Open-Meteon Weather Forecast API:sta, ja Viikko 3:ssa rakennettu `getWeatherTheme(code)`-logiikka otetaan oikeaan käyttöön API:n `weather_code`-arvon perusteella.

Toteutus täyttää Viikko 4:n a–e-kriteerit yhden yhtenäisen sääominaisuuden kautta.

## Kurssikriteerien a–e kattavuus

### a) Perusrunko

Sivulla on oikea `<button>` ja näkyvä palauteteksti. JavaScript käyttää `fetch()`-kutsua Open-Meteon avoimeen API:in ja tulostaa API-vastauksen myös `console.log`-kutsulla.

### b) Laajennus I

Haettu säädata viedään näkyvästi sivulle. Hero-alue ja metriikkakortit päivittyvät API-vastauksen perusteella.

### c) Laajennus II

Käyttöliittymä näyttää selkeän loading-tilan, esimerkiksi `Haetaan säätietoja...`, ja ymmärrettävän virheilmoituksen epäonnistuneessa haussa. Nykyinen onnistunut sää voidaan jättää näkyviin virheen aikana.

### d) Laajennus III

Käyttäjä voi valita kaupungin `<select>`-elementistä. Lisäksi käyttäjä voi halutessaan käyttää selaimen nykyistä sijaintia erillisellä painikkeella.

### e) Itsenäinen soveltaminen

Avoimeksi rajapinnaksi valitaan itsenäisesti Open-Meteo Weather Forecast API. Toteutus käyttää oikeaa säädataa eikä kurssiohjeen esimerkkirajapintaa.

## API

Käytetään Open-Meteon yleistä forecast-endpointia:

`https://api.open-meteo.com/v1/forecast`

Jokainen pyyntö sisältää WGS84 `latitude`- ja `longitude`-koordinaatit.

Nykyisistä olosuhteista pyydetään vain käyttöliittymässä tarvittavat muuttujat:

- `temperature_2m`
- `relative_humidity_2m`
- `weather_code`
- `wind_speed_10m`

Tuulen yksikkö asetetaan metriin sekunnissa:

`wind_speed_unit=ms`

API-avainta ei käytetä.

Esimerkkirakenne:

```text
https://api.open-meteo.com/v1/forecast
  ?latitude=...
  &longitude=...
  &current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m
  &wind_speed_unit=ms
```

## Open-Meteo-attribuutio

Open-Meteon säädata on attribuutiota edellyttävää dataa. Säädatan yhteydessä näytetään selkeä linkki Open-Meteoon, esimerkiksi:

`Säädata: Open-Meteo`

Linkki osoittaa `https://open-meteo.com/`.

## Aloitustila

Sovelluksen oletuskaupunki on **Helsinki**.

Sivun latautuessa sovellus hakee automaattisesti Helsingin ajantasaisen sään Open-Meteosta ja renderöi sen nykyiseen hero-näkymään.

Helsinki valittiin oletukseksi myös siksi, että geolocation-polun testaaminen Vantaalta tuottaa helposti havaittavan siirtymän oletuskaupungista selaimen todellisiin koordinaatteihin.

## Manuaalinen kaupunkivalinta

Sivulle lisätään natiivi `<select>` kaupunkivalintaa varten.

Valittavat kaupungit:

- Helsinki
- Vantaa
- Tampere
- Turku
- Oulu
- Rovaniemi
- Kuopio
- Jyväskylä
- Vaasa
- Lappeenranta

Jokaiselle kaupungille määritellään sovelluksessa kiinteät WGS84-koordinaatit. Runtime-geocodingia ei käytetä.

Käyttäjän vaihtaessa kaupungin selectistä sovellus hakee valitun kaupungin sään välittömästi yhteisellä fetch-polulla.

## Nykyinen sijainti

Manuaalisen valinnan rinnalla on erillinen painike:

**Käytä nykyistä sijaintiani**

Sijaintia ei pyydetä automaattisesti sivun latautuessa. `navigator.geolocation` käynnistetään vasta käyttäjän painalluksesta.

Jos käyttäjä hyväksyy luvan:

1. selain palauttaa `latitude`- ja `longitude`-koordinaatit
2. ne annetaan suoraan samalle Open-Meteo-hakufunktiolle
3. sijaintiotsikko vaihtuu muotoon **NYKYINEN SIJAINTI**
4. mitään lähimmän kaupungin laskentaa tai reverse geocodingia ei tehdä

Jos käyttäjä kieltää luvan tai geolocation epäonnistuu:

- näytetään ymmärrettävä virheviesti
- manuaalinen kaupunkivalinta jää täysin toimivaksi
- viimeisin onnistunut säädata voidaan jättää näkyviin

## Datavirta

```text
HELSINKI oletuksena
TAI käyttäjän valitsema kaupunki
TAI selaimen nykyiset koordinaatit
        ↓
fetch Open-Meteo
        ↓
current.temperature_2m
current.relative_humidity_2m
current.weather_code
current.wind_speed_10m
        ↓
getWeatherTheme(weather_code)
        ↓
7 hero-kuvaa + sääteksti + metriikat
```

API-hakua varten tehdään yksi yhteinen funktio, joka ottaa koordinaatit. Manuaalinen kaupunkivalinta ja geolocation käyttävät samaa hakupolkua eivätkä duplikoi fetch-logiikkaa.

## Seitsemän sääteemaa ja hero-kuvaa

Viikko 3:n seitsemän teemaa säilyvät:

- `clear`
- `partly-cloudy`
- `cloudy`
- `rain`
- `thunder`
- `snow`
- `fog`

Jokaisella teemalla on oma oikea hero-kuva:

```text
clear           -> assets/images/hero-clear.png
partly-cloudy   -> assets/images/hero-partly-cloudy.png
cloudy          -> assets/images/hero-cloudy.png
rain            -> assets/images/hero-rain.png
thunder         -> assets/images/hero-thunder.png
snow            -> assets/images/hero-snow.png
fog             -> assets/images/hero-fog.png
```

Kaikkien seitsemän assetin pitää olla repossa ennen Viikko 4:n hyväksyntää.

Sama kuva + CSS-filtteri ei korvaa teemakuvaa. API:n säätila vaihtaa aidosti hero-kuvan.

## Weather code -logiikka

Nykyinen `getWeatherTheme(code)` säilytetään pääosin Viikko 3:n toteutuksesta. Open-Meteon WMO-koodit ryhmitellään seitsemään visuaaliseen teemaan.

Pilvisyyskoodit erotellaan niin, että koodit `1`–`2` ovat `partly-cloudy` ja koodi `3` on `cloudy`. Näin WMO-koodin näkyvä säätila, hero-teema ja seitsemän hero-kuvan mapping pysyvät yhtenäisinä.

Lisäksi tehdään helposti luettava funktio näkyvälle suomenkieliselle säätilalle, esimerkiksi `getWeatherLabel(code)`. Tekstin pitää perustua API:n `weather_code`-arvoon eikä kovakoodattuun demotilaan.

Näkyvän säätilan ei tarvitse erotella jokaista WMO-koodia omaksi täysin eri termiksi, mutta sen pitää olla semanttisesti oikea, esimerkiksi:

- Selkeää
- Puolipilvistä
- Pilvistä
- Sumua
- Sadetta
- Lumisadetta
- Ukkosta

## UI-päivitykset

API:n onnistuneen vastauksen jälkeen päivitetään vähintään:

- sijaintiotsikko
- lämpötila
- säätilan pääteksti
- Tuuli-metriikka
- Kosteus-metriikka
- Säätila-metriikka
- hero-kuva
- hero-teema
- datan tilaa kuvaava badge

Viikko 3:n `Vaihda esimerkkisäätä` -painike poistetaan, koska demodata korvataan oikealla API-datalla.

`ESIMERKKIDATA`-badge korvataan oikeaa tilaa kuvaavalla tekstillä, esimerkiksi **AJANTASAINEN SÄÄ**.

## Loading- ja error-tilat

UI:ssa on oma status-elementti, jota käytetään käyttäjäpalautteeseen.

### Loading

Haun alkaessa näytetään esimerkiksi:

`Haetaan säätietoja...`

Hakupainikkeet voidaan tilapäisesti disabloida päällekkäisten hakujen välttämiseksi.

### API-virhe

Näytetään esimerkiksi:

`Säätietojen hakeminen epäonnistui. Yritä uudelleen.`

### Geolocation-virhe

Jos lupa evätään:

`Sijaintia ei käytetty. Voit valita kaupungin listasta.`

Tarkoitus ei ole syyllistää käyttäjää luvan kieltämisestä.

## Responsiivisuus ja saavutettavuus

Viikko 2:n mobile-first-rakenne säilytetään.

Vähimmäisvaatimukset:

- noin 375 px mobiilinäkymä toimii ilman vaakasuuntaista overflowta
- select ja molemmat painikkeet ovat helposti käytettäviä kosketuksella
- desktopissa metriikkakortit pysyvät kolmessa sarakkeessa
- `<label>` on ohjelmallisesti yhdistetty `<select>`-elementtiin
- käytetään oikeita `<button>`-elementtejä
- loading/error-status on tekstinä näkyvä, ei vain värinä
- hero-kuvan `alt` päivitetään sääteeman mukana
- focus-visible-tilat säilyvät

## Tiedostot

Viikko 4:n odotetut sovellusmuutokset:

- `index.html`
- `styles.css`
- `script.js`
- `README.md`
- kuusi uutta hero-assetia nykyisen `hero-partly-cloudy.png`-kuvan lisäksi

Viikko 4 ei tarvitse uutta JavaScript-frameworkia, pakettienhallintaa tai build-vaihetta.

## Rajauksen ulkopuolella

Viikko 4:ssa ei toteuteta:

- vapaata kaupungin tekstihakua
- Open-Meteo Geocoding API:a
- reverse geocodingia
- lähimmän kaupungin laskentaa
- karttaa
- localStoragea
- automaattista geolocation-kyselyä sivun latauksessa
- usean päivän ennustetta
- erillistä backendia
- API-avainta
- frameworkeja

## Hyväksymiskriteerit

Viikko 4 on valmis reviewhun, kun:

1. Helsinki haetaan oletuksena oikeasta Open-Meteo API:sta.
2. `fetch()` ja `console.log` näkyvät lähdekoodissa selvästi.
3. API-data renderöityy HTML-elementteihin.
4. Loading- ja error-palautteet toimivat.
5. Kaupunkivalinta sisältää sovitut 10 kaupunkia ja kaupungin vaihtaminen hakee sään automaattisesti.
6. **Käytä nykyistä sijaintiani** kysyy selaimen luvan vasta painalluksesta.
7. Geolocation käyttää saatuja koordinaatteja suoraan Open-Meteossa ja näyttää otsikon **NYKYINEN SIJAINTI**.
8. Sijaintiluvan kieltäminen ei estä manuaalista käyttöä.
9. `weather_code` ohjaa Viikko 3:n `getWeatherTheme(code)`-logiikkaa.
10. Jokaisella seitsemällä sääteemalla on oma hero-kuva ja oikea mapping.
11. Lämpötila, tuuli, kosteus ja säätila tulevat API-vastauksesta.
12. Viikko 3:n demo-painike ja demodata poistuvat tuotantokäytöstä.
13. Open-Meteon attribuutiolinkki näkyy säädatan yhteydessä.
14. 375 px mobiili ja desktop tarkistetaan selaimessa.
15. Ei runtime-virheitä normaalissa Helsinki-, kaupunkivalinta- tai geolocation-polussa.
16. `viikko-1`, `viikko-2` ja `viikko-3` -tagit pysyvät muuttumattomina.
17. Muutoksia ei yhdistetä `main`-haaraan eikä `viikko-4`-tagia luoda ennen reviewta.

## Lähteet

- VAMK: DJ00BP24 Johdatus sovelluskehitykseen, Viikkotehtävä 4
- Open-Meteo Weather Forecast API: https://open-meteo.com/en/docs
- Open-Meteo licence: https://open-meteo.com/en/license
