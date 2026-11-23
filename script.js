// Weather functionality
const townInput = document.querySelector("#town-input");
const weatherBtn = document.querySelector("#weather-btn");
const weatherResult = document.querySelector("#weather-result");
const weatherError = document.querySelector("#weather-error");

// List of towns in the Netherlands for geocoding
const netherlandsTowns = {
  amsterdam: { lat: 52.3676, lon: 4.9041 },
  rotterdam: { lat: 51.9225, lon: 4.4792 },
  den_haag: { lat: 52.0705, lon: 4.3007 },
  the_hague: { lat: 52.0705, lon: 4.3007 },
  utrecht: { lat: 52.0908, lon: 5.1266 },
  groningen: { lat: 53.2194, lon: 6.5665 },
  antwerpen: { lat: 51.2213, lon: 4.4015 },
  eindhoven: { lat: 51.4416, lon: 5.4697 },
  leiden: { lat: 52.1601, lon: 4.4941 },
  delft: { lat: 52.0116, lon: 4.3571 },
  dordrecht: { lat: 51.8133, lon: 4.6734 },
  breda: { lat: 51.5897, lon: 4.7788 },
  almere: { lat: 52.3702, lon: 5.2215 },
  arnhem: { lat: 51.9851, lon: 5.8987 },
  tilburg: { lat: 51.5603, lon: 5.0919 },
};

weatherBtn.addEventListener("click", async () => {
  const town = townInput.value.trim().toLowerCase();
  weatherError.textContent = "";
  weatherResult.textContent = "";
  weatherResult.classList.remove("show");

  if (!town) {
    weatherError.textContent = "Please enter a town name.";
    return;
  }

  const coords = netherlandsTowns[town.replace(/\s+/g, "_")];
  if (!coords) {
    weatherError.textContent = `Town "${town}" not found. Try: Amsterdam, Rotterdam, Utrecht, Groningen, Eindhoven, etc.`;
    return;
  }

  try {
    // Using Open-Meteo API (free, no API key required)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe/Amsterdam`
    );

    if (!response.ok) {
      throw new Error("Could not fetch weather data");
    }

    const data = await response.json();
    const tomorrow = data.daily;

    // Tomorrow is index 1 (today is index 0)
    const tempMax = tomorrow.temperature_2m_max[1];
    const tempMin = tomorrow.temperature_2m_min[1];
    const weatherCode = tomorrow.weather_code[1];
    const precipitation = tomorrow.precipitation_sum[1];
    const date = tomorrow.time[1];

    const weatherDescription = getWeatherDescription(weatherCode);

    weatherResult.innerHTML = `
      <strong>Tomorrow in ${town.charAt(0).toUpperCase() + town.slice(1)} (${date})</strong><br>
      Condition: ${weatherDescription}<br>
      High: ${tempMax}°C | Low: ${tempMin}°C<br>
      Precipitation: ${precipitation}mm
    `;
    weatherResult.classList.add("show");
  } catch (error) {
    console.error("Weather fetch error:", error);
    weatherError.textContent = "Could not fetch weather data. Please try again.";
  }
});

// Allow pressing Enter to fetch weather
townInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    weatherBtn.click();
  }
});

// Flower functionality
const flowerBtn = document.querySelector("#flower-btn");
const flowerImage = document.querySelector("#flower-image");
const flowerError = document.querySelector("#flower-error");
const flowerCredit = document.querySelector("#flower-credit");
const flowerAuthor = document.querySelector("#flower-author");
const flowerSource = document.querySelector("#flower-source");
const flowerLicense = document.querySelector("#flower-license");

const flowers = [
  {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Flower_jtca001.jpg/500px-Flower_jtca001.jpg",
    alt: "Orange gazania flower",
    author: "Sam Oth",
    source: "https://commons.wikimedia.org/wiki/File:Flower_jtca001.jpg",
    license: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/",
  },
  {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Tulip_Tulipa_clusiana_%27Lady_Jane%27_Rock_Ledge_Flower_Edit_2000px.jpg/500px-Tulip_Tulipa_clusiana_%27Lady_Jane%27_Rock_Ledge_Flower_Edit_2000px.jpg",
    alt: "Lady Jane tulip",
    author: "Derek Ramsey and Chanticleer Garden",
    source: "https://commons.wikimedia.org/wiki/File:Tulip_Tulipa_clusiana_%27Lady_Jane%27_Rock_Ledge_Flower_Edit_2000px.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Halictus_bee_on_flower-2.jpg/500px-Halictus_bee_on_flower-2.jpg",
    alt: "Bee on an orange flower",
    author: "Alvesgaspar",
    source: "https://commons.wikimedia.org/wiki/File:Halictus_bee_on_flower-2.jpg",
    license: "CC BY 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
  },
  {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Hoverfly_on_flower_edit.jpg/500px-Hoverfly_on_flower_edit.jpg",
    alt: "Hoverfly on a yellow flower",
    author: "Alvesgaspar",
    source: "https://commons.wikimedia.org/wiki/File:Hoverfly_on_flower_edit.jpg",
    license: "CC BY 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
  },
];
let lastFlowerIndex = -1;

function getRandomFlower() {
  let index = Math.floor(Math.random() * (flowers.length - (lastFlowerIndex < 0 ? 0 : 1)));
  if (lastFlowerIndex >= 0 && index >= lastFlowerIndex) {
    index++;
  }
  const flower = flowers[index];
  lastFlowerIndex = index;
  flowerError.textContent = "";
  flowerImage.hidden = true;
  flowerCredit.hidden = true;
  flowerBtn.disabled = true;

  flowerImage.onload = () => {
    flowerImage.hidden = false;
    flowerAuthor.textContent = flower.author;
    flowerSource.href = flower.source;
    flowerLicense.href = flower.licenseUrl;
    flowerLicense.textContent = flower.license;
    flowerCredit.hidden = false;
    flowerBtn.disabled = false;
  };
  flowerImage.onerror = () => {
    console.error("Could not load flower image:", flower.image);
    flowerError.textContent = "Could not load flower image. Please try again.";
    flowerBtn.disabled = false;
  };
  flowerImage.alt = flower.alt;
  flowerImage.src = flower.image;
}

flowerBtn.addEventListener("click", getRandomFlower);

// Load an initial flower on page load
window.addEventListener("load", getRandomFlower);

// WMO Weather interpretation codes
function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherCodes[code] || "Unknown";
}

// Existing starred repositories functionality
fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load events.json (${response.status})`);
    }
    return response.json();
  })
  .then((events) => {
    const list = document.querySelector("#starred");
    events.forEach((event) => {
      const item = document.createElement("li");
      item.textContent = `${event.name} — starred ${event.starred}`;
      list.appendChild(item);
    });
  })
  .catch((error) => {
    console.error("Could not load starred repositories:", error);
    document.querySelector("#error").textContent =
      "Could not load starred repositories. Please try again later.";
  });
