# Viikko 2 CSS Design Spec

## Tavoite

Muuta Viikko 1:n semanttinen HTML-versio visuaalisesti viimeistellyksi, mobiiliresponsiiviseksi sääpalveluksi käyttäen vain HTML:ää ja erillistä CSS-tiedostoa. Viikko 2:n design-suunnaksi on valittu **Minimal Nordic + Soft Cyber**: skandinaavisen pelkistetty rakenne, vahva sääkuva ja typografia sekä yksi hillitty cyan-korostusväri.

Toteutuksen pitää näyttää selvä kehitysaskel Viikko 1:n selaimen oletustyyleistä, mutta sen tulee edelleen olla helposti ymmärrettävä johdatus sovelluskehitykseen -kurssin CSS-toteutus.

## Rajaus

Viikko 2 sisältää vain HTML- ja CSS-muutoksia.

Ei toteuteta:

- JavaScriptiä
- API-kutsuja
- oikeaa reaaliaikaista säädataa
- säätilan automaattista vaihtamista
- 3D-maapalloa, karttaa tai WebGL-ratkaisuja
- animaatioita, jotka ovat keskeisiä toiminnallisuuden kannalta
- CSS-frameworkeja tai komponenttikirjastoja
- uutta feikkidataa vain designin täyttämiseksi

Nykyinen staattinen Vantaa-esimerkkisää säilyy. Viikko 3:ssa voidaan myöhemmin käyttää JavaScriptin `if/else`-logiikkaa sääteeman valintaan ja Viikko 4:ssa kytkeä sama logiikka Open-Meteon oikeaan weather code -dataan.

## Visuaalinen konsepti

Design on yhdistelmä Nordic Atmospheric -tyyliä ja erittäin kevyttä cyber-noir-fiilistä.

Pääperiaatteet:

- tumma siniharmaa sivutausta
- vaalea, korkeakontrastinen teksti
- yksi cyan-korostusväri
- paljon tyhjää tilaa
- iso lämpötila tärkeimpänä visuaalisena elementtinä
- nykyinen pilvikuva hero-alueen tunnelmakuvana
- hillityt reunukset, pyöristykset ja varjot
- ei neon- tai synthwave-efektien ylikäyttöä
- käyttöliittymän tulee näyttää ensisijaisesti sääpalvelulta, ei cyberpunk-teemasivulta

## Design tokenit

Toteutuksessa voidaan käyttää CSS-muuttujia esimerkiksi seuraavalla tasolla:

- tausta: hyvin tumma navy / blue-gray
- pinta: hieman taustaa vaaleampi siniharmaa
- pääteksti: lähes valkoinen
- toissijainen teksti: vaalea harmaansininen
- accent: hillitty cyan
- reunus: läpikuultava vaalea/cyan

Typografia pidetään dependency-free-ratkaisuna system font stackilla. Lämpötila on selvästi muuta typografiaa suurempi ja toteutetaan responsiivisesti esimerkiksi `clamp()`-funktion avulla.

## Etusivun rakenne

Nykyinen semanttinen HTML-rakenne säilytetään, mutta HTML:ään saa lisätä luokkia ja rajattuja wrapper-elementtejä CSS-layoutia varten.

### Header ja navigaatio

- `header` sisältää Sääennuste 2.0 -nimen ja lyhyen kuvauksen.
- `nav` näyttää Etusivu- ja Tietoa-linkit vaakasuunnassa desktopilla ja edelleen selkeästi mobiilissa.
- Navigaatiossa käytetään Flexboxia.
- Linkeillä on hillitty hover- ja `:focus-visible`-tila.

### Weather hero

Etusivun pääelementti on yksi suuri weather hero.

Hierarkia:

1. VANTAA
2. pieni `ESIMERKKIDATA`-badge
3. suuri `15°`
4. `Puolipilvistä`
5. nykyinen sääkuva tunnelmallisena hero-kuvana
6. kolme nykyiseen dataan perustuvaa metriikkaa: Tuuli, Kosteus ja Säätila

Hero-kuva toteutetaan edelleen oikeana paikallisena kuvana, jotta kuvan alt-teksti säilyy. CSS rajaa kuvan hallitusti `object-fit: cover` -ratkaisulla eikä HTML:n `width`-attribuutilla.

Hero-kuvan päälle voidaan rakentaa tumma gradient-overlay CSS:llä, jotta teksti säilyy luettavana.

### Tulevia ominaisuuksia

Nykyinen lista säilyy erillisenä osiona hero-alueen jälkeen. Se tyylitellään rauhalliseksi, hero-elementtiä tukevaksi osioksi. Open-Meteo-linkki säilyy.

## Tietoa-sivu

`about.html` käyttää samaa design-järjestelmää kuin etusivu:

- sama tausta, header ja navigaatio
- luettava, keskitetty content container
- sisältö korttimaisella mutta hillityllä pinnalla
- ei erillistä visuaalista konseptia tai uusia ominaisuuksia

## Responsiivisuus

Toteutus suunnitellaan mobile-first-periaatteella.

### Mobiili

- yksi pääsarake
- ei vaakasuuntaista sivuttaisvieritystä
- lämpötila skaalautuu viewportin mukaan
- hero-kuva rajautuu mobiiliin sopivasti
- säämetriikat muodostavat joko kaksi saraketta + yhden täysleveän rivin tai yhden sarakkeen, jos tila käy liian pieneksi
- navigaatio pysyy yksinkertaisena ilman hamburger-valikkoa
- sivun padding pienenee hallitusti

### Desktop

Yhdellä selkeällä `@media`-breakpointilla, noin 760 px tai sitä leveämmillä näytöillä:

- sivun maksimileveys kasvaa
- headerin ja navigaation asettelu hyödyntää tilaa paremmin
- hero ja metriikat avartuvat
- metriikat voidaan näyttää samassa rivissä CSS Gridillä
- tulevien ominaisuuksien osio saa enemmän vaakasuuntaista tilaa

## Viikko 2:n arviointitasojen a–e kattaminen

### a) Perusrunko

- luodaan ulkoinen `styles.css`
- `index.html` ja `about.html` linkittävät sen `<link>`-elementillä
- määritellään `color`, `background-color`, `font-family` ja `font-size`

### b) Box Model

- käytetään hallitusti `padding`, `margin` ja `border`-ominaisuuksia
- hero, metriikat, navigaatio ja about-sivun sisältöpinta osoittavat box modelin käytön selvästi

### c) Flexbox / CSS Grid

- navigaatio käyttää Flexboxia
- säämetriikat käyttävät CSS Gridiä

### d) Responsiivisuus

- käytetään vähintään yhtä `@media`-kyselyä
- mobiili- ja desktop-layout eroavat tarkoituksenmukaisesti
- sivulla ei saa olla vaakasuuntaista overflowta normaalilla mobiilileveydellä

### e) Itsenäinen soveltaminen

Toteutetaan useampi selkeä mutta hillitty edistyneempi ratkaisu:

- nav-linkkien `:hover`
- `:focus-visible`
- `border-radius`
- hienovarainen `box-shadow`
- lyhyt `transition`
- responsiivinen `clamp()`-typografia

Näitä ei käytetä koristeeksi kaikkialla, vaan vain visuaalisen hierarkian tukemiseen.

## Saavutettavuuden peruslinja

Vaikka varsinainen saavutettavuusanalyysi kuuluu myöhempään teemaan, Viikko 2:ssa ei tietoisesti rakenneta myöhemmin korjattavia ongelmia.

- teksti säilyy riittävän kontrastisena
- kuva säilyttää nykyisen alt-tekstinsä
- hover-tilaa vastaa myös näppäimistön `:focus-visible`
- tekstiä ei sijoiteta kuvan päälle ilman riittävää overlayta
- mobiilissa ei synny vaakavieritystä

## Tuleva sääteema-arkkitehtuuri

Viikko 2 toteuttaa vain yhden staattisen puolipilvisen näkymän. Myöhemmässä vaiheessa sovellus voidaan laajentaa seitsemään visuaaliseen sääteemaan:

- clear
- partly-cloudy
- cloudy
- rain
- thunder
- snow
- fog

Näitä ei toteuteta vielä. Viikko 3 voi käyttää `if/else`-logiikkaa teeman valintaan ja Viikko 4 oikeaa API-dataa teeman syötteenä.

## Hyväksymiskriteerit

Viikko 2 on valmis reviewhun, kun:

1. Molemmat HTML-sivut käyttävät samaa ulkoista CSS-tiedostoa.
2. Etusivu vastaa Minimal Nordic + Soft Cyber -designia ilman uusia toiminnallisia ominaisuuksia.
3. Nykyinen iso sääkuva on hallitusti responsiivinen.
4. Kaikki a–e-arviointikriteerit ovat suoraan koodista osoitettavissa.
5. Sivusto toimii vähintään noin 360 px mobiilileveydellä ja tavallisella desktop-leveydellä ilman vaakavieritystä.
6. `about.html` näyttää samalta sovellukselta kuin `index.html`.
7. JavaScript- ja API-toteutusta ei ole lisätty.
8. Viikko 1:n `viikko-1`-tagia ei muuteta.
9. Muutoksia ei yhdistetä `main`-haaraan eikä tagia `viikko-2` luoda ennen reviewta.
