//Para subir
import pintaDatos from './pintaDatos.js'
import pintaMapa from './mapa.js';
import pintaGrafico from './grafico.js'
import nextDays from './tarjetas.js'
const boton = document.getElementById('boton');


export let grados = []; //Inicia vacio para poder reasignar
export let horas = []; //Inicia vacio para poder reasignar
export let lat;
export let lon;
export let response;
export let respuestaDias;
let dias = [];
let temDiaria = [];

 

async function clima() {

 

    //Realizo primera consulta donde obtengo los datos que mostrare en el dom
    let buscar = document.getElementById('buscar').value;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${buscar}&units=metric&appid=616629f9acdc3b22b8b09553e632e5da&lang=es`
    response = await axios.get(url)
    response = response.data;

    lat = response.coord.lat //Capturo la latitud que se utilizara en la segunda consulta
    lon = response.coord.lon //Capturo la longitud que se utilizara en la segunda consulta    

 

 

    //Realizo la segunda consulta donde obtengo los datos que se utilizan en el gráfico
    let url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&units=metric&appid=616629f9acdc3b22b8b09553e632e5da&lang=es`
    let respuesta = await axios.get(url2)
    respuesta = respuesta.data;

    let info = respuesta.list; //Creo la variable info y la igualo a respuesta.list donde se encuentran los grados y las horas

 

    let grados_api = info.map((grado) => Math.trunc(grado.main.temp)) //Obtengo temperatura    
    grados = grados_api //Igualo la variable grados a los valores obtenidos de la api

 

    let horas_api = info.map((fech) => obtenerHora(fech.dt_txt)) //Obtengo Horas     
    horas = horas_api //Igualo la variable horas a los valores obtenidos de la api

 

    let urlDias = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=616629f9acdc3b22b8b09553e632e5da&lang=es`
    respuestaDias = await axios.get(urlDias)
    respuestaDias = respuestaDias.data
    respuestaDias = respuestaDias.daily    

 

    dias = respuestaDias.map((dia) => dia.dt)   

 

    temDiaria = respuestaDias.map((diaria) => Math.trunc(diaria.temp.day))

    pintaDatos(response) //Pinto datos obtenidos de la ap
    pintaMapa();
    pintaGrafico();
    nextDays();

 

}

 

function obtenerHora(fecha) { //Funcion que me formatea la hora 
    let hora_corregida = fecha;
    hora_corregida = hora_corregida.split(' ');
    hora_corregida = hora_corregida[1];
    hora_corregida = hora_corregida.split(':');
    hora_corregida = `${hora_corregida[0]}:${hora_corregida[1]}`
    return hora_corregida
}

 

boton.addEventListener('click', clima)