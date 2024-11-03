let startTime;
let elapsedTime = 0;
let isRunning = false;
let cronometroButton;
let cronometroIncreaseButton, cronometroDecreaseButton; // Botones para ajustar el cronómetro

let timerDuration = 10;
let timerRemaining;
let timerRunning = false;
let timerButton;
let timerIncreaseButton, timerDecreaseButton; // Botones para ajustar el temporizador
let timerAlertShown = false; // Controlar que la alerta solo se muestre una vez

function setup() {
  createCanvas(400, 300);
  
  timerRemaining = timerDuration;

  // Crear contenedor principal para los botones
  const buttonContainer = select('.button-container');

  // Mostrar tiempo del cronómetro con su etiqueta
  const cronometroDisplay = createDiv();
  cronometroDisplay.class('time-display');
  cronometroDisplay.parent(buttonContainer);
  cronometroDisplay.html('<span class="time-label">Cronómetro: </span><span id="cronometroTime">0.00 s</span>');

  // Crear botón para comenzar/detener el cronómetro
  cronometroButton = createButton('Iniciar Cronómetro');
  cronometroButton.class('start-stop');
  cronometroButton.mousePressed(toggleCronometro);
  cronometroButton.parent(buttonContainer);

  // Crear botones para ajustar el cronómetro
  cronometroIncreaseButton = createButton('+ Cronómetro');
  cronometroIncreaseButton.class('adjust-increase');
  cronometroIncreaseButton.mousePressed(() => adjustTime('cronometro', 5));
  cronometroIncreaseButton.parent(buttonContainer);

  cronometroDecreaseButton = createButton('- Cronómetro');
  cronometroDecreaseButton.class('adjust-decrease');
  cronometroDecreaseButton.mousePressed(() => adjustTime('cronometro', -5));
  cronometroDecreaseButton.parent(buttonContainer);

  // Mostrar tiempo del temporizador con su etiqueta
  const timerDisplay = createDiv();
  timerDisplay.class('time-display');
  timerDisplay.parent(buttonContainer);
  timerDisplay.html('<span class="time-label">Temporizador: </span><span id="timerTime">' + timerDuration + ' s</span>');

  // Crear botón para comenzar/detener el temporizador
  timerButton = createButton('Iniciar Temporizador');
  timerButton.class('start-stop');
  timerButton.mousePressed(toggleTimer);
  timerButton.parent(buttonContainer);

  // Crear botones para ajustar el temporizador
  timerIncreaseButton = createButton('+ Temporizador');
  timerIncreaseButton.class('adjust-increase');
  timerIncreaseButton.mousePressed(() => adjustTime('temporizador', 5));
  timerIncreaseButton.parent(buttonContainer);

  timerDecreaseButton = createButton('- Temporizador');
  timerDecreaseButton.class('adjust-decrease');
  timerDecreaseButton.mousePressed(() => adjustTime('temporizador', -5));
  timerDecreaseButton.parent(buttonContainer);
}

function draw() {
  background(240);

  // Actualizar el cronómetro
  if (isRunning) {
    elapsedTime += deltaTime / 1000;
  }
  select('#cronometroTime').html(nf(elapsedTime, 1, 2) + ' s');

  // Actualizar el temporizador
  if (timerRunning) {
    timerRemaining -= deltaTime / 1000;
    if (timerRemaining <= 0) {
      timerRemaining = 0;
      timerRunning = false;
      if (!timerAlertShown) {
        alert('¡El temporizador ha llegado a cero!');
        timerAlertShown = true; // Asegurarse de que la alerta solo se muestre una vez
      }
    }
  }
  select('#timerTime').html(nf(timerRemaining, 1, 2) + ' s');
}

function toggleCronometro() {
  if (isRunning) {
    isRunning = false;
    cronometroButton.html('Iniciar Cronómetro');
  } else {
    elapsedTime = 0;
    isRunning = true;
    cronometroButton.html('Detener Cronómetro');
  }
}

function toggleTimer() {
  if (timerRunning) {
    timerRunning = false;
    timerButton.html('Iniciar Temporizador');
    timerAlertShown = false; // Resetear la alerta al reiniciar
  } else {
    timerRemaining = timerDuration;
    timerRunning = true;
    timerButton.html('Detener Temporizador');
    timerAlertShown = false; // Resetear la alerta al reiniciar
  }
}

function adjustTime(type, amount) {
  if (type === 'cronometro') {
    elapsedTime = max(0, elapsedTime + amount);
  } else if (type === 'temporizador') {
    timerDuration = max(0, timerDuration + amount);
    timerRemaining = timerDuration;
  }
}
