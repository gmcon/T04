let grid;
let cols;
let rows;
let resolution = 20; // Tamaño de cada celda
let playing = false;
let speed = 10; // Velocidad de reproducción
let frameCount = 0;
let manualMode = false; // Para avanzar manualmente
let mode = null; // Modo de edición ("crear" o "destruir")
let isDragging = false; // Para arrastrar y modificar múltiples cuadros
let stateText;
let toolText;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2 - 50); // Centrar el canvas

  cols = width / resolution;
  rows = height / resolution;
  grid = make2DArray(cols, rows); // Inicializar con todos los cuadros "muertos"

  // Fila 1: Botones de reproducción, pausa y frame
  let playBtn = createButton('Reproducir');
  playBtn.mousePressed(() => {
    playing = true;
    updateStateText();
  });
  playBtn.position((windowWidth - width) / 2, (windowHeight - height) / 2 + height + 20);

  let pauseBtn = createButton('Pausar');
  pauseBtn.mousePressed(() => {
    playing = false;
    updateStateText();
  });
  pauseBtn.position((windowWidth - width) / 2 + 100, (windowHeight - height) / 2 + height + 20);

  let nextFrameBtn = createButton('Siguiente Frame');
  nextFrameBtn.mousePressed(() => {
    manualMode = true;
    nextGeneration();
    manualMode = false;
  });
  nextFrameBtn.position((windowWidth - width) / 2 + 200, (windowHeight - height) / 2 + height + 20);

  // Texto para indicar si está reproduciendo o en pausa
  stateText = createP("Pausado");
  stateText.position((windowWidth - width) / 2 + 320, (windowHeight - height) / 2 + height + 10);
  updateStateText();

  // Fila 2: Control de velocidad de reproducción
  let speedSlider = createSlider(1, 60, 10); // Control de velocidad
  speedSlider.input(() => speed = speedSlider.value());
  speedSlider.position((windowWidth - width) / 2, (windowHeight - height) / 2 + height + 60);

  let speedLabel = createP("Velocidad de reproducción");
  speedLabel.position((windowWidth - width) / 2 + 160, (windowHeight - height) / 2 + height + 50);

  // Fila 3: Botones de crear y destruir
  let createBtn = createButton('Crear');
  createBtn.mousePressed(() => {
    mode = 'crear';
    updateToolText();
  });
  createBtn.position((windowWidth - width) / 2, (windowHeight - height) / 2 + height + 100);

  let destroyBtn = createButton('Destruir');
  destroyBtn.mousePressed(() => {
    mode = 'destruir';
    updateToolText();
  });
  destroyBtn.position((windowWidth - width) / 2 + 100, (windowHeight - height) / 2 + height + 100);

  // Texto para indicar la herramienta activa (crear o destruir)
  toolText = createP("Modo: Ninguno");
  toolText.position((windowWidth - width) / 2 + 220, (windowHeight - height) / 2 + height + 90);
  updateToolText();

  // Fila 4: Botones "Crear todo" y "Matar todo"
  let fillAllBtn = createButton('Crear todo');
  fillAllBtn.mousePressed(() => fillAll(1));
  fillAllBtn.position((windowWidth - width) / 2, (windowHeight - height) / 2 + height + 140);

  let clearAllBtn = createButton('Matar todo');
  clearAllBtn.mousePressed(() => fillAll(0));
  clearAllBtn.position((windowWidth - width) / 2 + 100, (windowHeight - height) / 2 + height + 140);
}

function draw() {
  background(0);

  // Mostrar la cuadrícula con borde gris
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        fill(255);
      } else {
        fill(0);
      }
      stroke(100); // Borde gris
      rect(x, y, resolution, resolution);
    }
  }

  // Avanzar a la siguiente generación si está jugando
  if (playing && frameCount % (61 - speed) == 0 && !manualMode) {
    nextGeneration();
  }

  frameCount++;
}

// Crear matriz 2D
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0); // Inicializar todos los cuadros como "muertos"
  }
  return arr;
}

// Calcular la siguiente generación
function nextGeneration() {
  let next = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let neighbors = countNeighbors(grid, i, j);

      if (state == 0 && neighbors == 3) {
        next[i][j] = 1;
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  grid = next;
}

// Contar los vecinos vivos
function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

// Función para manejar los clics del ratón
function mousePressed() {
  modifyCell();
  isDragging = true;
}

function mouseDragged() {
  modifyCell();
}

function mouseReleased() {
  isDragging = false;
}

// Modificar las celdas según el modo ("crear" o "destruir")
function modifyCell() {
  if (mode) {
    let i = floor(mouseX / resolution);
    let j = floor(mouseY / resolution);
    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      if (mode === 'crear') {
        grid[i][j] = 1;
      } else if (mode === 'destruir') {
        grid[i][j] = 0;
      }
    }
  }
}

// Función para llenar o vaciar toda la cuadrícula
function fillAll(value) {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = value;
    }
  }
}

// Actualizar el texto del estado (reproducción o pausa)
function updateStateText() {
  if (playing) {
    stateText.html("Jugando");
  } else {
    stateText.html("Pausado");
  }
}

// Actualizar el texto de la herramienta activa
function updateToolText() {
  if (mode === 'crear') {
    toolText.html("Modo: Crear");
  } else if (mode === 'destruir') {
    toolText.html("Modo: Destruir");
  } else {
    toolText.html("Modo: Ninguno");
  }
}
