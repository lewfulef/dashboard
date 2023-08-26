const cityInput = document.querySelector(".city-input")
const searchButton = document.querySelector(".search-btn")
const locationButton = document.querySelector(".location-btn")
const currentWeatherDiv = document.querySelector(".current-weather")
const weatherCardsDiv = document.querySelector(".weather-cards")

const API_KEY = "f3d17631323dbe3c801b2f0fced3968e" // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML para la tarjeta meteoroñogica principal
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                     <h4>Viento: ${weatherItem.wind.speed} M/S</h4>
                     <h4>Humedad: ${weatherItem.main.humidity}%</h4>                     
                </div>
                <div class="icon">
                <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>
        `;
    } else {return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Viento: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humedad: ${weatherItem.main.humidity} %</h4> 
            </li>`;

    }
    
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = ` http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(data =>{ 
        // Filtra el pronóstico para tener sólo uno por día
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate)
            }
        });

        // Limpiando la data anterior sobre el clima

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
        // Crear el gráfico aquí
        const temperatures = fiveDaysForecast.map(weatherItem => (weatherItem.main.temp - 273.15).toFixed(2));
        const dates = fiveDaysForecast.map(weatherItem => weatherItem.dt_txt.split(" ")[0]);

        const ctx = document.getElementById("weatherChart").getContext("2d");
        const weatherChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: dates,
                datasets: [{
                    label: "Temperature (°C)",
                    data: temperatures,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    })
    .catch(() => {
        alert("¡Ocurrió un error mientras se buscaba el pronóstico del clima!");
    });
}


const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //  Get user entered city name and remove extra spaces.
    if(!cityName) return; // Return if cityName is 
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then( data => {
        if(!data.length) return alert(`No se han encontrado coordenadas para ${cityName}`)
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(( ) => {
        alert("¡Ocurrió un error mientras se buscaban las coordenadas!")
    });
}; 
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            console.log(position);
        }, 
        error => {
            if(error.code === error.PERMISSION_DENIED){
                alert("Geolocation request denied. Please reset location")
            }
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates)
searchButton.addEventListener("click", getCityCoordinates)