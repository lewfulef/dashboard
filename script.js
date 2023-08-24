const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".locationsearch-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "4974a1ba35a5114946804992d47ea7d8"; // API KEY de OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { //HTML principal de pronostico
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperatura: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Viento: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humedad: ${weatherItem.main.humidity}%</h4>                     
                </div>
                <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else { //HTML para los otros días
        return `<li class="card">
        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Viento: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humedad: ${weatherItem.main.humidity}%</h4> 
</li>`;
    }
    
};

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then (res => res.json()).then(data => {
        //Filtro de pronosticos por día
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter (forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        //Limpiando datos anteriores
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";


        //Se crean tarjetas y se agregan al DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index)); 
            }
                        
        });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });

}


const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //Usar nombre de ciudad completo, se eliminaran espacios de sobra
    if(!cityName) return; // Volver a principal si no hay nombre escrito
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    //Obtener coordenadas de ciudades (longitud,latitud y nombre) de API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails (name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates");        
    });
}
searchButton.addEventListener("click", getCityCoordinates);

// Dentro de la función getWeatherDetails, después de crear las tarjetas HTML

// Preparar datos para el gráfico
const labels = [];
const temperatures = [];

fiveDaysForecast.forEach((weatherItem, index) => {
    labels.push(new Date(weatherItem.dt_txt));
    temperatures.push((weatherItem.main.temp - 273.15).toFixed(2));
});

// Configuración de los datos y opciones del gráfico
const chartData = {
    labels: labels,
    datasets: [{
        label: 'Temperatura (°C)',
        data: temperatures,
        borderColor: 'blue',
        fill: false
    }]
};

const chartOptions = {
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'day'
            }
        },
        y: {
            beginAtZero: true
        }
    }
};

// Obtener el contexto del lienzo para el gráfico
const chartCtx = document.getElementById('weatherChart').getContext('2d');

// Crear el gráfico utilizando Chart.js
new Chart(chartCtx, {
    type: 'line',
    data: chartData,
    options: chartOptions
});
