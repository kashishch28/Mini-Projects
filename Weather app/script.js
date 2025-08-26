const API_KEY = "d1e9e72526cb4fef9de185232252408"; // double-check length
let defaultCity = "Mathura";

// Fetch current weather
async function getCurrentWeather(city) {
  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    console.log("Current Weather:", data);

    document.querySelector(".weather-city").textContent = data.location.name;
    document.querySelector(".weather-temp").textContent = `${Math.round(data.current.temp_c)}°C`;
    document.querySelector(".weather-desc").textContent = data.current.condition.text;
    document.querySelector(".weather-icon").src = "https:" + data.current.condition.icon;

    document.getElementById("humidity").textContent = data.current.humidity + "%";
    document.getElementById("wind").textContent = data.current.wind_kph + " km/h";
    document.getElementById("uv").textContent = data.current.uv;
    document.getElementById("pressure").textContent = data.current.pressure_mb + " hPa";
  } catch (error) {
    console.error(error);
    alert("Weather data not available for this city!");
  }
}

// Fetch forecast (today + week)
async function getForecast(city) {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=no`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Forecast not available");
    const data = await res.json();

    console.log("Forecast:", data);

    // Today’s forecast (hourly 6AM-6PM)
    const todayForecast = document.getElementById("todayForecast");
    todayForecast.innerHTML = "";
    data.forecast.forecastday[0].hour.slice(6, 19).forEach(hour => {
      const div = document.createElement("div");
      div.className = "min-w-[90px] bg-white/20 rounded-lg p-3 text-center backdrop-blur";
      div.innerHTML = `
        <p>${hour.time.split(" ")[1]}</p>
        <img src="https:${hour.condition.icon}" class="w-10 mx-auto my-2">
        <p>${Math.round(hour.temp_c)}°C</p>
      `;
      todayForecast.appendChild(div);
    });

    // Weekly forecast
    const weeklyForecast = document.getElementById("weeklyForecast");
    weeklyForecast.innerHTML = "";
    data.forecast.forecastday.forEach(day => {
      const div = document.createElement("div");
      div.className = "min-w-[90px] bg-white/20 rounded-lg p-3 text-center backdrop-blur";
      div.innerHTML = `
        <p>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
        <img src="https:${day.day.condition.icon}" class="w-10 mx-auto my-2">
        <p>${Math.round(day.day.avgtemp_c)}°C</p>
      `;
      weeklyForecast.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
}

// Search bar
document.getElementById("search").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let city = e.target.value.trim();
    if (city) {
      getCurrentWeather(city);
      getForecast(city);
    }
  }
});

// Run only after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  getCurrentWeather(defaultCity);
  getForecast(defaultCity);
});
