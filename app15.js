let weatherData;
let apiKey = 'b3041ce2e0e146a38e5b411fb30ec768';
let city = 'New York'; // Ciudad por defecto
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
let input; // Para el campo de entrada
let button; // Para el botón
let weatherIcon; // Para el icono del clima

function setup() {
  createCanvas(900, 600);
  textSize(24);
  textAlign(CENTER); // Centrar el texto
  fill(0); // Color del texto negro
  
  // Crear un campo de entrada
  input = createInput(city);
  input.position((width - input.width-50), 550); // Centrar el campo de entrada
  
  // Crear un botón para refrescar los datos del clima
  button = createButton('Obtener Clima');
  button.position((width - button.width) / 2, height / 2 + 10); // Posición inicial del botón
  button.mousePressed(getWeather); // Asignar la función al botón
  
  // Obtener los datos del clima al inicio
  getWeather();
}

function getWeather() {
  city = input.value(); // Obtener el valor del campo de entrada
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      weatherData = data;
      console.log(weatherData);
      
      // Cargar el icono correspondiente
      let iconCode = weatherData.weather[0].icon;
      weatherIcon = loadImage(`https://openweathermap.org/img/wn/${iconCode}@2x.png`);
    })
    .catch(err => {
      console.error('Error: ', err);
      weatherData = null; // Establecer a null si hay un error
    });
}

function draw() {
  background(200, 220, 255);
  
  if (weatherData) {
    let temperature = weatherData.main.temp;
    let condition = weatherData.weather[0].description;
    let windSpeed = weatherData.wind.speed;
    let humidity = weatherData.main.humidity;

    text("Datos del Clima Actual", width / 2, 50); // Centrar el texto
    text("Temperatura: " + temperature + "°C", width / 2, 100); // Centrar el texto
    text("Condición: " + condition, width / 2, 150); // Centrar el texto
    text("Velocidad del Viento: " + windSpeed + " m/s", width / 2, 200); // Centrar el texto
    text("Humedad: " + humidity + "%", width / 2, 250); // Centrar el texto
    
    // Mostrar el icono del clima
    if (weatherIcon) {
      image(weatherIcon, width / 2 - 50, 300, 100, 100); // Mostrar el icono centrado
      button.position((width - button.width), 550); // Mover el botón debajo de la imagen y centrarlo
    }
  } else {
    text("Obteniendo datos del clima...", width / 2, 100); // Centrar el texto
    button.position((width - button.width), 550); // Mover el botón debajo de la imagen en caso de error
  }
}
