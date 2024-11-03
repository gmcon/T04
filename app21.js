let brushType = 'circle'; // Tipo de pincel por defecto
let brushSize = 20; // Tamaño del pincel por defecto
let brushColor;
let gradientStartColor, gradientEndColor; // Colores para el gradiente
let effects = 'none'; // Efectos iniciales
let colorPicker, colorPicker2; // Selectores de color
let effectSelect; // Referencia al selector de efectos
let prevMouseX, prevMouseY; // Posición anterior del mouse (para el pincel pluma)
let drawing = false; // Variable para verificar si el mouse está siendo presionado
let isErasing = false; // Variable para verificar si está en modo borrador (click derecho)

function setup() {
  let canvas = createCanvas(1200, 600); // Cambiar tamaño del lienzo a 1200x600
  canvas.parent('canvas-container');
  background(255); // Fondo blanco
  brushColor = color(0); // Pincel negro por defecto
  gradientStartColor = color(0); // Negro por defecto
  gradientEndColor = color(255); // Blanco por defecto
  prevMouseX = mouseX; // Inicializar las coordenadas previas del mouse
  prevMouseY = mouseY;

  // Desactivar el menú contextual del navegador sobre el lienzo
  canvas.elt.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  createUI();
}

function draw() {
  if (mouseIsPressed) {  
    // Detectar si está en modo borrador (click derecho)
    if (isErasing) {
      brushColor = color(255); // Usar blanco para simular borrador
    }

    paint(mouseX, mouseY);
    prevMouseX = mouseX; // Actualizar la posición anterior del mouse solo cuando el mouse está presionado
    prevMouseY = mouseY;
    drawing = true; // El usuario está dibujando
  }
}

function paint(x, y) {
  noStroke(); // Eliminar bordes innecesarios

  // Cambiar el color aleatoriamente si está seleccionado el pincel aleatorio y no es click derecho
  if (brushType === 'aleatorio' && !isErasing) {
    // Cambiar de color continuamente mientras se pinta
    brushColor = color(random(255), random(255), random(255));
    colorPicker.color(brushColor); // Actualizar la previsualización del selector de color
  }

  // Aplicar efectos visuales
  if (effects === 'gradient' && !isErasing) {
    // Gradiente basado en la posición X del mouse
    let gradientRatio = map(mouseX, 0, width, 0, 1); // Usar la posición X para el gradiente
    brushColor = lerpColor(gradientStartColor, gradientEndColor, gradientRatio);
  }

  fill(brushColor); // Aplicar el color al pincel

  if (effects === 'blur') {
    drawingContext.filter = 'blur(4px)';
  } else if (effects === 'invert') {
    drawingContext.filter = 'invert(100%)';
  } else {
    drawingContext.filter = 'none';
  }

  // Dibujar según el tipo de pincel
  if (brushType === 'circle') {
    ellipse(x, y, brushSize, brushSize);
  } else if (brushType === 'square') {
    rect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
  } else if (brushType === 'spray') {
    sprayBrush(x, y);
  } else if (brushType === 'aleatorio') {
    ellipse(x, y, brushSize, brushSize); // Usamos un círculo como forma base para el pincel aleatorio
  } else if (brushType === 'pluma') {
    // Cálculo de la velocidad del mouse
    let speed = dist(x, y, prevMouseX, prevMouseY);

    // Mapear la velocidad del mouse a un grosor de pincel (mayor velocidad = pincel más delgado)
    let adaptiveBrushSize = map(speed, 0, 50, brushSize, 2); // Grosor mínimo de 2 y máximo el seleccionado

    // Limitar el tamaño para que no exceda el valor del slider
    adaptiveBrushSize = constrain(adaptiveBrushSize, 2, brushSize);

    if (drawing) {
      // Dibujar una línea desde la posición anterior a la actual solo si el mouse está presionado
      stroke(brushColor); // Aplicar el color al trazo de la línea
      strokeWeight(adaptiveBrushSize); // Ajustar el grosor del trazo según la velocidad
      line(prevMouseX, prevMouseY, x, y); // Línea continua sin separaciones
    }
  }
}

// Función para generar un efecto de spray
function sprayBrush(x, y) {
  for (let i = 0; i < 20; i++) {
    let offsetX = random(-brushSize, brushSize);
    let offsetY = random(-brushSize, brushSize);
    let d = dist(0, 0, offsetX, offsetY);
    if (d < brushSize) {
      ellipse(x + offsetX, y + offsetY, 2, 2);
    }
  }
}

// Restablecer la posición previa del mouse y el estado de dibujo al soltar el botón
function mouseReleased() {
  prevMouseX = mouseX; // Reiniciar la posición del mouse para evitar líneas no deseadas entre clics
  prevMouseY = mouseY;
  drawing = false; // Detener el dibujo
  isErasing = false; // Dejar de borrar cuando se suelta el botón
}

// Detectar si el botón derecho del mouse está presionado para activar el borrador
function mousePressed() {
  if (mouseButton === RIGHT) {
    isErasing = true; // Activar el modo borrador
  } else {
    isErasing = false;
  }
}

// Crear la interfaz de usuario con los controles
function createUI() {
  const controlsContainer = select('#controls-container');

  // Seleccionar tipo de pincel
  let brushSelect = createSelect();
  brushSelect.option('Circle');
  brushSelect.option('Square');
  brushSelect.option('Spray');
  brushSelect.option('Aleatorio'); // Opción aleatoria
  brushSelect.option('Pluma'); // Nueva opción "Pluma"
  brushSelect.changed(() => {
    brushType = brushSelect.value().toLowerCase();

    // Si cambia el pincel de "Aleatorio" a otro, permitir "Gradient" de nuevo
    if (brushType !== 'aleatorio' && effects === 'gradient') {
      colorPicker2.show(); // Mostrar el segundo selector de color si el gradiente está activo
    }
  });
  brushSelect.parent(controlsContainer);

  // Seleccionar tamaño del pincel
  let sizeSlider = createSlider(5, 100, 20);
  sizeSlider.input(() => brushSize = sizeSlider.value());
  sizeSlider.parent(controlsContainer);

  // Seleccionar color inicial
  colorPicker = createColorPicker('#000000'); // Negro por defecto
  colorPicker.input(() => brushColor = colorPicker.color()); // Actualizar el color del pincel
  colorPicker.parent(controlsContainer);

  // Segundo selector de color para el gradiente (color final)
  colorPicker2 = createColorPicker('#FFFFFF'); // Blanco por defecto
  colorPicker2.input(() => gradientEndColor = colorPicker2.color()); // Actualizar el color final del gradiente
  colorPicker2.parent(controlsContainer);
  colorPicker2.hide(); // Ocultamos el segundo selector hasta que se seleccione el gradiente

  // Efectos visuales
  effectSelect = createSelect();
  effectSelect.option('None');
  effectSelect.option('Blur');
  effectSelect.option('Invert');
  effectSelect.option('Gradient'); // Nueva opción para el gradiente
  effectSelect.changed(() => {
    effects = effectSelect.value().toLowerCase();
    
    // Validación: si el usuario intenta seleccionar "Gradient" y el pincel es "Aleatorio"
    if (effects === 'gradient' && brushType === 'aleatorio') {
      // Cambiar el efecto visual automáticamente a "None"
      effects = 'none';
      effectSelect.value('None');
      colorPicker2.hide(); // Ocultar el segundo selector de color si no es gradiente
    } else if (effects === 'gradient') {
      colorPicker2.show(); // Mostrar el segundo selector de color si es gradiente
    } else {
      colorPicker2.hide(); // Ocultar el segundo selector si no es gradiente
    }
  });
  effectSelect.parent(controlsContainer);

  // Botón para reiniciar el lienzo
  let resetButton = createButton('Reiniciar lienzo');
  resetButton.mousePressed(() => {
    background(255); // Limpiar el lienzo y poner el fondo en blanco
  });
  resetButton.parent(controlsContainer);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    background(255); // Limpiar la pantalla con fondo blanco
  }
}
