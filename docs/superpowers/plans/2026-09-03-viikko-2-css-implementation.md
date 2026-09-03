# Viikko 2 CSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Muuttaa Sääennuste 2.0:n Viikko 1 HTML-versio mobiiliresponsiiviseksi Minimal Nordic + Soft Cyber -sääkäyttöliittymäksi ja täyttää Viikko 2:n CSS-arviointitasot a–e.

**Architecture:** Molemmat HTML-sivut käyttävät yhtä juureen luotavaa `styles.css`-tiedostoa. Nykyinen semanttinen HTML säilytetään, mutta etusivulle lisätään rajattuja luokkia ja wrapper-elementtejä hero- ja metriikkalayoutia varten. Toteutus on mobile-first ja käyttää Flexboxia navigaatioon, CSS Gridiä säämetriikoihin sekä yhtä selkeää desktop-`@media`-breakpointia.

**Tech Stack:** HTML5, CSS3, Git, PowerShell-validoinnit, selainpohjainen manuaalinen responsiivisuustarkistus.

**Spec:** `docs/superpowers/specs/2026-09-03-viikko-2-css-design.md`

## Global Constraints

- Viikko 2 sisältää vain HTML- ja CSS-muutoksia.
- Ei JavaScriptiä, API-kutsuja, CSS-frameworkeja, WebGL:ää tai 3D-ratkaisuja.
- Nykyinen Vantaa-esimerkkidata säilyy; älä lisää uutta feikkisäädataa.
- Käytä Week 2:n hyväksyttyä hero-kuvaa `assets/images/hero-partly-cloudy.png`; Week 1:n `assets/images/weather.jpg` säilytetään muuttamatta.
- Design: Minimal Nordic + Soft Cyber, tumma blue-gray, vaalea teksti, yksi hillitty cyan-accent.
- Toteutus suunnitellaan mobile-first ja sen on toimittava noin 360 px leveydestä ylöspäin ilman vaakasuuntaista sivuttaisvieritystä.
- `viikko-1`-tagia ei saa muuttaa.
- Älä mergeä `main`-haaraan tai luo `viikko-2`-tagia ennen erillistä reviewta.

---

## File Structure

- Create: `styles.css` — yhteinen design system, layout, responsive rules ja interaction states.
- Modify: `index.html` — linkitys CSS:ään sekä luokat/wrapperit hero-, säämetriikka- ja tulevat ominaisuudet -rakenteille.
- Modify: `about.html` — linkitys samaan CSS:ään ja rajatut luokat yhteistä layoutia varten.
- Modify: `README.md` — dokumentoi Viikko 2:n CSS-scope ja a–e-kattavuus lyhyesti.

---

### Task 1: External stylesheet and shared visual foundation

**Files:**
- Create: `styles.css`
- Modify: `index.html`
- Modify: `about.html`

**Interfaces:**
- Consumes: nykyiset semanttiset HTML5-rakenteet.
- Produces: molempien sivujen yhteinen `styles.css`-linkitys ja perusdesign-tokenit, joita myöhemmät tehtävät käyttävät.

- [ ] **Step 1: Verify the stylesheet does not yet exist**

Run:

```powershell
Test-Path .\styles.css
```

Expected before implementation: `False`.

- [ ] **Step 2: Link the external stylesheet to both pages**

Add inside `<head>` after the viewport meta element in both `index.html` and `about.html`:

```html
<link rel="stylesheet" href="styles.css">
```

- [ ] **Step 3: Create the shared CSS foundation**

Create `styles.css` with:

- `box-sizing: border-box` globally
- CSS custom properties for background, surface, primary text, muted text, cyan accent, border, radius and shadow
- system font stack
- body background/color/font-size/line-height
- responsive page padding
- sensible defaults for links and images
- a centered maximum-width page container using existing semantic elements/classes rather than a framework

Use a restrained palette approximately in this family, adjusting only if contrast requires it:

```css
:root {
  --bg: #08111f;
  --surface: #101c2d;
  --surface-soft: #15243a;
  --text: #f4f8fc;
  --muted: #a9b8c8;
  --accent: #64e5e7;
  --border: rgba(148, 207, 219, 0.2);
  --radius: 1.25rem;
  --shadow: 0 1.25rem 3rem rgba(0, 0, 0, 0.24);
}
```

Do not add magenta or multiple neon accent colors.

- [ ] **Step 4: Validate requirement a**

Run:

```powershell
Test-Path .\styles.css
Select-String -Path .\index.html,.\about.html -Pattern 'href="styles.css"'
Select-String -Path .\styles.css -Pattern 'background-color|background:'
Select-String -Path .\styles.css -Pattern 'font-family'
Select-String -Path .\styles.css -Pattern 'font-size'
```

Expected: stylesheet exists, both HTML files link it, and color/typography declarations are present.

---

### Task 2: Build the weather hero and metric layout

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: Task 1 design tokens and stylesheet link.
- Produces: visual hero hierarchy and metric grid using only the existing Vantaa sample data.

- [ ] **Step 1: Refactor only the presentation hooks in the weather section**

Keep the existing semantic `section`, weather text and `figure`, but add classes/wrappers so the section can express this hierarchy:

```text
VANTAA + ESIMERKKIDATA
15°
Puolipilvistä
hero image
Tuuli | Kosteus | Säätila
```

Allowed HTML changes:

- classes on existing elements
- small `div` wrappers for layout
- short label elements needed to distinguish metric labels from values

Do not remove semantic `header`, `nav`, `main`, `section`, `figure`, `figcaption` or `footer` elements.

Do not add new weather measurements.

- [ ] **Step 2: Style the hero as the single WOW element**

In `styles.css`:

- give the weather section a dark atmospheric surface
- use generous padding and rounded corners
- use subtle border and shadow
- make `15°` the dominant element with responsive `clamp()` typography
- style `ESIMERKKIDATA` as a small restrained badge
- keep the cyan accent limited to selected labels/borders/states

- [ ] **Step 3: Make the existing image a controlled cinematic hero image**

Style the existing `<img>` with CSS rather than HTML dimensions:

```css
width: 100%;
height: 100%;
object-fit: cover;
```

Give the figure an intentional responsive height/aspect treatment and rounded clipping. Preserve the existing meaningful `alt` text.

Use a CSS gradient/overlay only if needed for visual integration and text contrast. Do not bake text into the image.

- [ ] **Step 4: Build the metric area with CSS Grid**

Create three metric items from the existing values only:

- Tuuli — `4 m/s`
- Kosteus — `70 %`
- Säätila — `Puolipilvistä`

Use CSS Grid for layout. On narrow mobile, use either one column or a two-plus-one arrangement that never causes horizontal overflow.

- [ ] **Step 5: Style the upcoming-features section**

Keep its existing content and Open-Meteo link. Make it visually secondary to the weather hero using the same palette and box model.

- [ ] **Step 6: Validate requirements b and c structurally**

Run:

```powershell
Select-String -Path .\styles.css -Pattern 'padding'
Select-String -Path .\styles.css -Pattern 'margin'
Select-String -Path .\styles.css -Pattern 'border'
Select-String -Path .\styles.css -Pattern 'display:\s*grid'
Select-String -Path .\styles.css -Pattern 'display:\s*flex'
Select-String -Path .\styles.css -Pattern 'object-fit:\s*cover'
Select-String -Path .\styles.css -Pattern 'clamp\('
```

Expected: Box Model properties, CSS Grid, Flexbox, responsive image handling and clamp typography are all present.

---

### Task 3: Responsive behavior, shared About styling and advanced CSS states

**Files:**
- Modify: `styles.css`
- Modify: `about.html`

**Interfaces:**
- Consumes: Task 1 shared foundation and Task 2 hero classes.
- Produces: finished mobile/desktop behavior and the Week 2 requirement e interaction states.

- [ ] **Step 1: Make navigation a Flexbox component**

Use Flexbox for navigation alignment. Keep both links visible on mobile; do not add a hamburger menu.

Add restrained interaction states:

```css
nav a:hover { ... }
nav a:focus-visible { ... }
```

Include a short transition on color/background/border changes. Focus must remain visibly distinguishable.

- [ ] **Step 2: Style `about.html` with the same design system**

Add only the classes/wrappers necessary to make `about.html` visually consistent:

- same dark page background
- same header/nav/footer treatment
- readable max-width content surface
- restrained border, radius and spacing

Do not add new content or functionality just to fill the layout.

- [ ] **Step 3: Add one clear desktop media query**

Use a mobile-first breakpoint around `760px`:

```css
@media (min-width: 760px) {
  /* desktop enhancements */
}
```

Desktop enhancements should include:

- more horizontal breathing room
- improved header/nav alignment
- three weather metrics in one row
- hero proportions suitable for desktop

Do not create a large collection of breakpoints when one or two clear rules are enough.

- [ ] **Step 4: Add overflow-safe CSS**

Ensure:

- images never exceed their containers
- grid children can shrink when necessary
- long text/links wrap
- no fixed width forces a viewport wider than about 360 px

Do not hide layout mistakes with `overflow-x: hidden` as the primary fix.

- [ ] **Step 5: Validate requirements d and e structurally**

Run:

```powershell
Select-String -Path .\styles.css -Pattern '@media'
Select-String -Path .\styles.css -Pattern ':hover'
Select-String -Path .\styles.css -Pattern ':focus-visible'
Select-String -Path .\styles.css -Pattern 'border-radius'
Select-String -Path .\styles.css -Pattern 'box-shadow'
Select-String -Path .\styles.css -Pattern 'transition'
```

Expected: all patterns are present.

- [ ] **Step 6: Manually verify browser behavior**

Open both pages and check at minimum:

- approximately 360 px wide mobile viewport
- approximately 768 px tablet/narrow desktop viewport
- approximately 1440 px desktop viewport

Verify:

- no horizontal scrollbar
- all text remains readable
- hero temperature remains dominant without clipping
- hero image crops intentionally
- metrics reflow cleanly
- nav links remain usable
- `about.html` shares the same visual language
- hover/focus styles do not obscure text

Capture one mobile and one desktop screenshot for the final course report after the implementation is approved.

---

### Task 4: Documentation and final Week 2 verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: completed Week 2 implementation.
- Produces: concise repository documentation and a review-ready feature branch.

- [ ] **Step 1: Update README with a short Week 2 section**

Add a concise section documenting that Week 2 introduces:

- external CSS
- Minimal Nordic + Soft Cyber visual style
- Box Model
- Flexbox/Grid
- responsive `@media` layout
- hover/focus/radius/shadow styling

Also state explicitly that JavaScript and live weather API data are still deferred to later weeks.

- [ ] **Step 2: Run final source-scope checks**

Run:

```powershell
git diff --check
Get-ChildItem -Recurse -File | Where-Object { $_.Extension -in '.js','.mjs','.ts' }
Select-String -Path .\index.html,.\about.html,.\styles.css -Pattern 'fetch\(|axios|XMLHttpRequest' -ErrorAction SilentlyContinue
```

Expected:

- `git diff --check` has no whitespace errors
- no new JavaScript/TypeScript implementation exists
- no API call pattern exists

- [ ] **Step 3: Verify all a–e evidence in one pass**

Run:

```powershell
$checks = @(
  (Test-Path .\styles.css),
  ((Select-String .\index.html 'href="styles.css"').Count -ge 1),
  ((Select-String .\about.html 'href="styles.css"').Count -ge 1),
  ((Select-String .\styles.css 'font-family').Count -ge 1),
  ((Select-String .\styles.css 'padding').Count -ge 1),
  ((Select-String .\styles.css 'border').Count -ge 1),
  ((Select-String .\styles.css 'display:\s*flex').Count -ge 1),
  ((Select-String .\styles.css 'display:\s*grid').Count -ge 1),
  ((Select-String .\styles.css '@media').Count -ge 1),
  ((Select-String .\styles.css ':hover').Count -ge 1),
  ((Select-String .\styles.css 'border-radius').Count -ge 1),
  ((Select-String .\styles.css 'box-shadow').Count -ge 1)
)
$checks
$checks -notcontains $false
```

Expected final line: `True`.

- [ ] **Step 4: Inspect status and diff before committing**

Run:

```powershell
git status
git diff --stat
git diff -- index.html about.html styles.css README.md
```

Review that the diff contains only Week 2 HTML/CSS/documentation changes and no `CNAME` or Week 1 tag changes.

- [ ] **Step 5: Commit the reviewed Week 2 implementation on `week-2-css`**

Only after browser review is accepted:

```powershell
git add index.html about.html styles.css README.md
git commit -m "feat: complete week 2 responsive CSS"
git push -u origin week-2-css
```

Do not merge to `main` and do not create the `viikko-2` tag yet.

---

## Review Gate

After Tasks 1–3 and the README/source validations in Task 4 are complete, stop before the final integration steps if the user has not yet reviewed the browser result.

Report:

1. files changed
2. evidence for a–e
3. validation command results
4. desktop/mobile manual checks
5. any design deviations from the spec
6. git status and diff summary
7. confirmation that no JavaScript/API work was added

The human review then decides whether the design is accepted, needs visual adjustment, or can proceed to commit/push and later merge/tag.
