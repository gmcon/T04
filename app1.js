let colorPicker; 
let brushSize = 5;
let downloadButton;
let sizeSlider;
let zoomSlider;
let zoomFactor = 1;
let offsetX = 0, offsetY = 0;
let canvasGraphics; // Para manejar el dibujo
let moveSpeed = 10; // Velocidad de desplazamiento con las teclas
let initialOffsetX, initialOffsetY; // Para guardar los desplazamientos originales
let undoStack = []; // Pila para deshacer
let redoStack = []; // Pila para rehacer
let clearButton; // Botón para borrar todo
let keysPressed = {}; // Para guardar el estado de las teclas presionadas

function setup() {
  // Crear el canvas y el objeto gráfico para manejar el dibujo
  let canvas = createCanvas(700, 450);
  canvas.parent('canvas-container');
  canvasGraphics = createGraphics(700, 450);
  canvasGraphics.background(255); // Fondo blanco

  // Guardar los valores iniciales de desplazamiento
  initialOffsetX = offsetX;
  initialOffsetY = offsetY;

  // Crear el contenedor <div class="box"> para los controles
  let controlBox = createDiv();
  controlBox.class('box');

  // Crear un botón de descarga
  downloadButton = createButton('Descargar dibujo');
  downloadButton.class('download-button'); // Agregar clase
  downloadButton.mousePressed(downloadDrawing);
  controlBox.child(downloadButton); // Añadir al contenedor

  // Crear un botón de borrar
  clearButton = createButton('Borrar todo');
  clearButton.class('clear-button');
  clearButton.mousePressed(clearCanvas);
  controlBox.child(clearButton); // Añadir al contenedor
  
  // Crear un selector de color
  colorPicker = createColorPicker('#000000');
  colorPicker.class('color-picker'); // Agregar clase
  colorPicker.style('width', '250px');
  colorPicker.style('z-index', '20');
  controlBox.child(colorPicker); // Añadir al contenedor
  
  // Crear un slider para el tamaño del pincel
  sizeSlider = createSlider(1, 50, brushSize);
  sizeSlider.class('size-slider'); // Agregar clase
  sizeSlider.style('width', '250px');
  sizeSlider.input(() => {
    brushSize = sizeSlider.value();
  });
  controlBox.child(sizeSlider); // Añadir al contenedor


  // Crear una barra de zoom en la parte inferior de la pizarra
  zoomSlider = createSlider(0, 100, 0); // Zoom de 0 a 100
  zoomSlider.class('zoom-slider'); // Agregar ID
  zoomSlider.style('width', '700px');
  zoomSlider.input(() => {
    zoomFactor = 1 + zoomSlider.value() / 100; // Zoom empieza en 1 y aumenta hasta 2
    document.getElementById('zoom-display').innerText = `Zoom: ${zoomSlider.value()}%`; // Actualizar el texto del <p>
    if (zoomFactor === 1) {
      // Restaurar la posición original si el zoom es 0
      offsetX = initialOffsetX;
      offsetY = initialOffsetY;
    }
  });

  // Registrar teclas para Ctrl+Z (deshacer) y Ctrl+Y (rehacer)
  document.addEventListener('keydown', handleUndoRedo);
}

function draw() {
  // Limpiar el canvas pero no el objeto gráfico
  background(255);

  // Aplicar zoom y desplazamiento
  push();
  translate(offsetX, offsetY); // Desplazamiento
  scale(zoomFactor); // Zoom

  // Dibujar el contenido anterior del gráfico
  image(canvasGraphics, 0, 0);

  // Si el ratón está presionado, dibujar
  if (mouseIsPressed && isMouseInsideCanvas()) {
    canvasGraphics.stroke(colorPicker.color());
    canvasGraphics.strokeWeight(brushSize / zoomFactor); // Ajustar el grosor del pincel según el zoom
    canvasGraphics.line(
      (mouseX - offsetX) / zoomFactor, (mouseY - offsetY) / zoomFactor, 
      (pmouseX - offsetX) / zoomFactor, (pmouseY - offsetY) / zoomFactor
    );
  }

  pop(); // Restaurar las transformaciones

  // Controlar el movimiento continuo con las teclas
  handleMovement();

  // Limitar el desplazamiento al área visible
  limitMovement();
}

// Verificar si el ratón está dentro del área del canvas
function isMouseInsideCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

// Función para descargar el dibujo
function downloadDrawing() {
  saveCanvas(canvasGraphics, 'mi_dibujo', 'png');
}

// Función para borrar el lienzo
function clearCanvas() {
  canvasGraphics.background(255); // Limpia el gráfico
  undoStack = []; // Limpiar el stack de deshacer
  redoStack = []; // Limpiar el stack de rehacer
}

// Guardar el estado actual del lienzo antes de cada trazo
function mousePressed() {
  undoStack.push(canvasGraphics.get());
  redoStack = []; // Limpiar el stack de rehacer cuando se realiza un nuevo trazo
}

// Manejar combinación de teclas Ctrl+Z y Ctrl+Y
function handleUndoRedo(event) {
  if (event.ctrlKey && event.key === 'z') {
    undo();
  } else if (event.ctrlKey && event.key === 'y') {
    redo();
  }
}

// Función para deshacer el último trazo (Ctrl + Z)
function undo() {
  if (undoStack.length > 0) {
    redoStack.push(canvasGraphics.get()); // Guardar el estado actual para rehacer
    let lastState = undoStack.pop(); // Sacar el último estado de la pila
    canvasGraphics.image(lastState, 0, 0); // Restaurar el último estado
  }
}

// Función para rehacer el último trazo (Ctrl + Y)
function redo() {
  if (redoStack.length > 0) {
    undoStack.push(canvasGraphics.get()); // Guardar el estado actual para deshacer
    let lastState = redoStack.pop(); // Sacar el último estado de la pila de rehacer
    canvasGraphics.image(lastState, 0, 0); // Restaurar el estado
  }
}

// Función para manejar el movimiento continuo con las teclas
function handleMovement() {
  if (zoomFactor > 1) { // Solo permitir desplazamiento si hay zoom
    if (keysPressed['a']) {
      offsetX += moveSpeed;
    }
    if (keysPressed['d']) {
      offsetX -= moveSpeed;
    }
    if (keysPressed['w']) {
      offsetY += moveSpeed;
    }
    if (keysPressed['s']) {
      offsetY -= moveSpeed;
    }
  }
}

// Limitar el desplazamiento al área visible del canvas
function limitMovement() {
  let canvasWidth = width * zoomFactor;
  let canvasHeight = height * zoomFactor;

  // Limitar desplazamiento horizontal
  offsetX = constrain(offsetX, -(canvasWidth - width), 0);
  
  // Limitar desplazamiento vertical
  offsetY = constrain(offsetY, -(canvasHeight - height), 0);
}
// Función para detectar cuando se presionan teclas
function keyPressed() {
  keysPressed[key] = true;
}

// Función para detectar cuando se sueltan las teclas
function keyReleased() {
  keysPressed[key] = false;
}