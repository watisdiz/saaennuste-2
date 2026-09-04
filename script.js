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

const demoWeatherStates = [
  { code: 2, label: "Puolipilvistä" },
  { code: 0, label: "Selkeää" },
  { code: 61, label: "Sadetta" },
  { code: 71, label: "Lumisadetta" }
];

let currentDemoIndex = 0;
const initialTheme = getWeatherTheme(demoWeatherStates[currentDemoIndex].code);
console.log("Nykyinen sääteema:", initialTheme);

function renderDemoWeather(state) {
  const hero = document.querySelector("#weatherHero");
  const status = document.querySelector("#weatherStatus");
  const metricStatus = document.querySelector("#weatherMetricStatus");
  const theme = getWeatherTheme(state.code);

  supportedThemes.forEach((supportedTheme) => {
    hero.classList.remove(`theme-${supportedTheme}`);
  });

  hero.classList.add(`theme-${theme}`);
  status.textContent = state.label;
  metricStatus.textContent = state.label;

  console.log("Valittu demo:", state.label, "Teema:", theme);
}

const changeWeatherButton = document.querySelector("#changeWeatherButton");

changeWeatherButton.addEventListener("click", () => {
  currentDemoIndex = (currentDemoIndex + 1) % demoWeatherStates.length;
  renderDemoWeather(demoWeatherStates[currentDemoIndex]);
});
