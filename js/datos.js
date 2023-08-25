//Se capturan los elementos del dom que serán utilizados para mostrar los datos obtenidos
const fecha = document.getElementById('fecha');
const temperatura = document.getElementById('temperatura');
const city = document.getElementById('ciudad');
const estado = document.getElementById('estado');
const icon = document.getElementById('icon');

 

export default function Datos(response) {

    //Hora Unix a Hora UTC
    let unixTimestamp = response.dt
    let date = new Date(unixTimestamp * 1000);
    fecha.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}` //Se muestra la hora formateada en el dom

    let tempminima = response.main.temp_min
    tempmin.textContent = `Mín.: ${tempminima} °C`

    let tempmaxima = response.main.temp_max
    tempmax.textContent = `Máx.: ${tempmaxima} °C`

    let humedadporc = Math.trunc(response.main.humidity)
    humedad.textContent = `Humedad: ${humedadporc} %`

    let presionatm = Math.trunc(response.main.pressure)
    presion.textContent = `Presión atm: ${presionatm} hPa`


    //Se obtiene nombre de ciudad
    city.textContent = `${response.name}`
    //Obtencion temperatura
    let tempRedondeada = Math.trunc(response.main.temp)
    temperatura.textContent = `${tempRedondeada}°C` //Se muestra en el dom la temperarura

 

    estado.textContent = `${response.weather[0].description}` //Se muestra en el dom el estado del clima en este momento

 

    icon.src = `https://openweathermap.org/img/wn/${response.weather[0].icon}@4x.png` } //Se muestra el icono relacionado al clima en este momento