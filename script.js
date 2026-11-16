
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");

const weatherTypes = {
    0: ["Clear Sky", "☀️"],
    1: ["Mainly Clear", "🌤️"],
    2: ["Partly Cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Foggy", "🌫️"],
    48: ["Foggy", "🌫️"],
    51: ["Light Drizzle", "🌦️"],
    53: ["Drizzle", "🌦️"],
    55: ["Heavy Drizzle", "🌧️"],
    61: ["Light Rain", "🌧️"],
    63: ["Rain", "🌧️"],
    65: ["Heavy Rain", "⛈️"],
    71: ["Light Snow", "🌨️"],
    73: ["Snow", "❄️"],
    75: ["Heavy Snow", "❄️"],
    80: ["Rain Showers", "🌦️"],
    81: ["Rain Showers", "🌧️"],
    82: ["Heavy Showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm", "⛈️"],
    99: ["Heavy Thunderstorm", "⛈️"]
};

async function searchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name!";
        return;
    }

    try {
        message.textContent = "Searching...";

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const place = geoData.results[0];

        await loadWeather(
            place.latitude,
            place.longitude,
            place.name,
            place.country || ""
        );

    } catch (error) {
        message.textContent = error.message || "Something went wrong!";
    }
}

async function loadWeather(lat, lon, city, country) {
    try {
        message.textContent = "Loading weather...";

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=7&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to get weather data.");
        }

        const data = await response.json();

        const current = data.current;

        const weather = weatherTypes[current.weather_code]
            || ["Unknown", "🌡️"];

        document.getElementById("cityName").textContent = city;
        document.getElementById("country").textContent = country;

        document.getElementById("date").textContent =
            new Date(current.time).toLocaleString();

        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m) + "°C";

        document.getElementById("weatherIcon").textContent =
            current.is_day ? weather[1] :
            (current.weather_code === 0 ? "🌙" : weather[1]);

        document.getElementById("description").textContent = weather[0];

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            current.wind_speed_10m + " km/h";

        document.getElementById("feels").textContent =
            Math.round(current.apparent_temperature) + "°C";

        document.getElementById("uv").textContent =
            data.daily.uv_index_max[0];

        showForecast(data.daily);

        message.textContent = "";

    } catch (error) {
        message.textContent = error.message;
    }
}

function showForecast(daily) {
    const forecast = document.getElementById("forecast");

    forecast.innerHTML = "";

    daily.time.forEach((date, index) => {
        const weather = weatherTypes[daily.weather_code[index]]
            || ["Unknown", "🌡️"];

        const day = new Date(date + "T12:00:00")
            .toLocaleDateString("en-US", {
                weekday: "short"
            });

        const card = document.createElement("div");
        card.className = "forecast-item";

        const dayText = document.createElement("p");
        dayText.textContent = day;

        const icon = document.createElement("div");
        icon.className = "icon";
        icon.textContent = weather[1];

        const description = document.createElement("p");
        description.textContent = weather[0];

        const temperature = document.createElement("p");
        temperature.textContent =
            `${Math.round(daily.temperature_2m_max[index])}° / ${Math.round(daily.temperature_2m_min[index])}°`;

        card.append(dayText, icon, description, temperature);
        forecast.appendChild(card);
    });
}

function getLocation() {
    if (!navigator.geolocation) {
        message.textContent = "Location is not supported.";
        return;
    }

    message.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const url =
                    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`;

                const response = await fetch(url);
                const data = await response.json();

                const place = data.results?.[0];

                await loadWeather(
                    lat,
                    lon,
                    place?.name || "My Location",
                    place?.country || ""
                );

            } catch {
                await loadWeather(lat, lon, "My Location", "");
            }
        },
        () => {
            message.textContent =
                "Please allow location access.";
        }
    );
}

// Load Phnom Penh weather when website opens
loadWeather(
    11.5564,
    104.9282,
    "Phnom Penh",
    "Cambodia"
);

// Search by pressing Enter
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});
