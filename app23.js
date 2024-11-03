let conversionBlocks = [];
let currencyRates = {}; // Objeto para almacenar las tasas de cambio

// Aquí añadimos un fetch para obtener los datos de la API al inicio
function obtenerTasasDeCambio() {
  const apiKey = "72585c2f3c29c1ce778507cf3bd33ebc";
  const url = `https://api.currencylayer.com/live?access_key=${apiKey}&currencies=EUR,GBP,CAD,PLN,USD&source=CLP&format=1`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        currencyRates = data.quotes; // Guardamos las tasas en el objeto
        createCurrencyConversionBlock(); // Creamos el bloque de moneda después de obtener los datos
      } else {
        console.error("Error al obtener los datos de la API de moneda");
      }
    })
    .catch(error => console.error("Error en la solicitud a la API:", error));
}

function setup() {
  noCanvas();

  // Crear los bloques de conversión
  createConversionBlock("Temperatura", ["Celsius", "Fahrenheit", "Kelvin"], convertirTemperatura);
  createConversionBlock("Longitud", ["Metros", "Centímetros", "Pulgadas", "Pies"], convertirLongitud);
  createConversionBlock("Peso", ["Kilogramos", "Gramos", "Libras"], convertirPeso);
  createConversionBlock("Tiempo", ["Segundos", "Minutos", "Horas", "Días"], convertirTiempo);
  createConversionBlock("Volumen", ["Litros", "Galones", "Mililitros"], convertirVolumen);
  
  // Llamamos a la función para obtener las tasas de cambio antes de crear el bloque de moneda
  obtenerTasasDeCambio();
}

function createConversionBlock(title, units, conversionFunction) {
  let container = createDiv().addClass("conversion-block");
  
  let header = createDiv(title).addClass("conversion-title");
  
  let input = createInput().attribute("placeholder", "Ingrese valor").addClass("input-box");
  
  let fromUnit = createSelect().addClass("unit-select");
  units.forEach(unit => fromUnit.option(unit));
  
  let toUnit = createSelect().addClass("unit-select");
  units.forEach(unit => toUnit.option(unit));
  
  let button = createButton("Convertir").addClass("convert-button");
  
  let result = createDiv("Resultado: ").addClass("result-text");
  
  container.child(header);
  container.child(input);
  container.child(fromUnit);
  container.child(toUnit);
  container.child(button);
  container.child(result);
  
  button.mousePressed(() => {
    let valor = parseFloat(input.value());
    let desdeUnidad = fromUnit.value();
    let haciaUnidad = toUnit.value();
    let resultado = conversionFunction(valor, desdeUnidad, haciaUnidad);
    result.html(`Resultado: ${resultado}`);
  });
  
  conversionBlocks.push(container);
}

// Bloque específico para moneda
function createCurrencyConversionBlock() {
  let currencies = ["CLP", "EUR", "GBP", "CAD", "PLN", "USD"];
  let container = createDiv().addClass("conversion-block");
  
  let header = createDiv("Moneda").addClass("conversion-title");
  
  let input = createInput().attribute("placeholder", "Ingrese valor en CLP").addClass("input-box");
  
  let fromUnit = createSelect().addClass("unit-select");
  currencies.forEach(currency => fromUnit.option(currency));
  
  let toUnit = createSelect().addClass("unit-select");
  currencies.forEach(currency => toUnit.option(currency));
  
  let button = createButton("Convertir").addClass("convert-button");
  
  let result = createDiv("Resultado: ").addClass("result-text");
  
  container.child(header);
  container.child(input);
  container.child(fromUnit);
  container.child(toUnit);
  container.child(button);
  container.child(result);
  
  button.mousePressed(() => {
    let valor = parseFloat(input.value());
    let desdeUnidad = fromUnit.value();
    let haciaUnidad = toUnit.value();
    
    let resultado = convertirMoneda(valor, desdeUnidad, haciaUnidad);
    result.html(`Resultado: ${resultado}`);
  });
  
  conversionBlocks.push(container);
}

function convertirMoneda(valor, desdeUnidad, haciaUnidad) {
  if (desdeUnidad === "CLP") {
    // Si la unidad de origen es CLP, convertimos usando las tasas
    let tasa = currencyRates[`CLP${haciaUnidad}`];
    return valor * tasa;
  } else if (haciaUnidad === "CLP") {
    // Si la unidad destino es CLP, invertimos la tasa
    let tasa = currencyRates[`CLP${desdeUnidad}`];
    return valor / tasa;
  } else {
    // Si la conversión es entre otras monedas, convertimos a CLP primero y luego a la moneda deseada
    let tasaDesdeCLP = currencyRates[`CLP${desdeUnidad}`];
    let tasaHaciaCLP = currencyRates[`CLP${haciaUnidad}`];
    return (valor / tasaDesdeCLP) * tasaHaciaCLP;
  }
}

// Funciones de conversión existentes
function convertirTemperatura(valor, desdeUnidad, haciaUnidad) {
  if (desdeUnidad === "Celsius") {
    if (haciaUnidad === "Fahrenheit") return valor * 9/5 + 32;
    if (haciaUnidad === "Kelvin") return valor + 273.15;
  } else if (desdeUnidad === "Fahrenheit") {
    if (haciaUnidad === "Celsius") return (valor - 32) * 5/9;
    if (haciaUnidad === "Kelvin") return (valor - 32) * 5/9 + 273.15;
  } else if (desdeUnidad === "Kelvin") {
    if (haciaUnidad === "Celsius") return valor - 273.15;
    if (haciaUnidad === "Fahrenheit") return (valor - 273.15) * 9/5 + 32;
  }
  return valor;
}

function convertirLongitud(valor, desdeUnidad, haciaUnidad) {
  let conversiones = {
    "Metros": 1,
    "Centímetros": 100,
    "Pulgadas": 39.3701,
    "Pies": 3.28084
  };
  return valor * conversiones[haciaUnidad] / conversiones[desdeUnidad];
}

function convertirPeso(valor, desdeUnidad, haciaUnidad) {
  let conversiones = {
    "Kilogramos": 1,
    "Gramos": 1000,
    "Libras": 2.20462
  };
  return valor * conversiones[haciaUnidad] / conversiones[desdeUnidad];
}

function convertirTiempo(valor, desdeUnidad, haciaUnidad) {
  // Definir las conversiones en segundos para cada unidad
  let conversiones = {
    "Segundos": 1,          // Base en segundos
    "Minutos": 60,          // 1 minuto = 60 segundos
    "Horas": 3600,          // 1 hora = 3600 segundos
    "Días": 86400           // 1 día = 86400 segundos
  };

  // Convertimos primero el valor de la unidad de origen a segundos
  let valorEnSegundos = valor * conversiones[desdeUnidad];

  // Luego, convertimos de segundos a la unidad de destino
  let resultado = valorEnSegundos / conversiones[haciaUnidad];

  return resultado;
}

function convertirVolumen(valor, desdeUnidad, haciaUnidad) {
  let conversiones = {
    "Litros": 1,
    "Galones": 0.264172,
    "Mililitros": 1000
  };
  return valor * conversiones[haciaUnidad] / conversiones[desdeUnidad];
}
