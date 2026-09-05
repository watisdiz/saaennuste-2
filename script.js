const supportedThemes = [
  "clear",
  "partly-cloudy",
  "cloudy",
  "rain",
  "thunder",
  "snow",
  "fog"
];

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

const heroImages = {
  clear: "assets/images/hero-clear.webp",
  "partly-cloudy": "assets/images/hero-partly-cloudy.webp",
  cloudy: "assets/images/hero-cloudy.webp",
  rain: "assets/images/hero-rain.webp",
  thunder: "assets/images/hero-thunder.webp",
  snow: "assets/images/hero-snow.webp",
  fog: "assets/images/hero-fog.webp"
};

function getWeatherTheme(code) {
  if (code === 0) {
    return "clear";
  } else if (code >= 1 && code <= 2) {
    return "partly-cloudy";
  } else if (code === 3) {
    return "cloudy";
  } else if (code === 45 || code === 48) {
    return "fog";
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return "rain";
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return "snow";
  } else if (code >= 95) {
    return "thunder";
  }

  return "cloudy";
}

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

const hero = document.querySelector("#weatherHero");
const locationName = document.querySelector("#locationName");
const dataBadgeText = document.querySelector("#dataBadgeText");
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

function renderWeather(data, locationLabel) {
  const current = data.current;
  const theme = getWeatherTheme(current.weather_code);
  const label = getWeatherLabel(current.weather_code);

  supportedThemes.forEach((supportedTheme) => {
    hero.classList.remove(`theme-${supportedTheme}`);
  });

  hero.classList.add(`theme-${theme}`);
  locationName.textContent = locationLabel;
  dataBadgeText.textContent = "AJANTASAINEN SÄÄ";
  temperatureValue.textContent = `${Math.round(current.temperature_2m)}°`;
  weatherStatus.textContent = label;
  windValue.textContent = `${current.wind_speed_10m.toFixed(1)} m/s`;
  humidityValue.textContent = `${Math.round(current.relative_humidity_2m)} %`;
  weatherMetricStatus.textContent = label;
  weatherImage.src = heroImages[theme];
  weatherImage.alt = `${label}, säämaisema`;
  weatherFigureCaption.textContent = `${label}, sääteema.`;
}

function hasValidCurrentWeather(current) {
  return current && [
    current.temperature_2m,
    current.relative_humidity_2m,
    current.weather_code,
    current.wind_speed_10m
  ].every(Number.isFinite);
}

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

    if (!hasValidCurrentWeather(data.current)) {
      throw new Error("Open-Meteo-vastauksen current-data on virheellinen");
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

function fetchSelectedCityWeather() {
  const city = cities[citySelect.value];

  if (!city) {
    showFeedback("Valittua kaupunkia ei löytynyt. Valitse kaupunki listasta.", "error");
    return;
  }

  fetchWeather(city.latitude, city.longitude, city.label);
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    showFeedback("Sijaintia ei voitu käyttää. Voit valita kaupungin listasta.", "error");
    return;
  }

  setLoading(true, "Haetaan sijaintia...");
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      citySelect.value = "";
      fetchWeather(coords.latitude, coords.longitude, "NYKYINEN SIJAINTI");
    },
    () => {
      setLoading(false);
      showFeedback("Sijaintia ei käytetty. Voit valita kaupungin listasta.", "error");
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
}

citySelect.addEventListener("change", fetchSelectedCityWeather);
useLocationButton.addEventListener("click", useCurrentLocation);

const defaultCity = cities.helsinki;
fetchWeather(defaultCity.latitude, defaultCity.longitude, defaultCity.label);
