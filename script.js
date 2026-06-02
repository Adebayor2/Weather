import { API_KEY, BASE_URL } from './config.js';

const iconMap = {
  '01d': '☀️', '01n': '🌙',
  '02d': '🌤️', '02n': '🌤️',
  '03d': '🌥️', '03n': '🌥️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

const card = document.getElementById('weatherCard');
const cityInput = document.getElementById('cityInput');
const errorPill = document.getElementById('errorPill');
const elCity = document.getElementById('cityName');
const elCountry = document.getElementById('countryBadge');
const elDesc = document.getElementById('weatherDesc');
const elTemp = document.getElementById('tempValue');
const elIcon = document.getElementById('weatherIcon');
const elHumidity = document.getElementById('humidityVal');
const elWind = document.getElementById('windVal');
const elFeels = document.getElementById('feelsVal');

let errorTimeout;

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  errorPill.classList.remove('show');
  if (errorTimeout) clearTimeout(errorTimeout);
  card.classList.remove('visible');


  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      card.classList.remove('loading', 'shimmer');
      const message = res.status === 404
        ? 'City not found. Please check the spelling and try again.'
        : 'An unexpected error occurred. Please try again later.';
      showError(message);
      return;
    }

    const data = await res.json();
    console.log('Weather data fetched successfully:', data);
    renderWeather(data);
  } catch (err) {
    card.classList.remove('loading', 'shimmer');
    console.error('Error fetching weather:', err);
    showError('Network error. Please check your connection.');
  }
}

function showError(message) {
  errorPill.textContent = message;
  errorPill.classList.add('show');

  errorTimeout = setTimeout(() => {
    errorPill.classList.remove('show');
  }, 2000);
}

function renderWeather(data) {
  const iconCode = data.weather[0].icon;
  const emoji = iconMap[iconCode] || '🌡️';
  const windKmh = Math.round(data.wind.speed * 3.6);

  elCity.textContent = data.name;
  elCountry.textContent = data.sys.country;
  elDesc.textContent = data.weather[0].description;
  elTemp.textContent = Math.round(data.main.temp);
  elIcon.textContent = emoji;
  elHumidity.textContent = data.main.humidity + '%';
  elWind.textContent = windKmh;
  elFeels.textContent = Math.round(data.main.feels_like) + '°';

  card.classList.remove('loading', 'shimmer');
  void card.offsetWidth;
  card.classList.add('visible');
}

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchWeather();
});
window.fetchWeather = fetchWeather; 
window.showError = showError; 
window.renderWeather = renderWeather; 
window.iconMap = iconMap;
