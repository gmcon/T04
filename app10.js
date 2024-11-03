let angleX = 0;
let angleY = 0;
let zoom = -200;
let currentModel = 'Cube'; // Modelo inicial
let ambientSlider, directionalSlider, colorPicker;

function setup() {
  createCanvas(600, 600, WEBGL);
  
  // Crear los sliders para la iluminación
  ambientSlider = createSlider(0, 255, 150);
  ambientSlider.position(20, 60);
  directionalSlider = createSlider(0, 255, 150);
  directionalSlider.position(20, 90);

  // Crear selector de color
  colorPicker = createColorPicker('#ff0000');
  colorPicker.position(20, 120);

  // Crear botones para la galería de modelos
  const cubeBtn = select('#cubeBtn');
  cubeBtn.mousePressed(() => currentModel = 'Cube');

  const rectPrismBtn = select('#rectPrismBtn');
  rectPrismBtn.mousePressed(() => currentModel = 'RectangularPrism');

  const cylinderBtn = select('#cylinderBtn');
  cylinderBtn.mousePressed(() => currentModel = 'Cylinder');

  const coneBtn = select('#coneBtn');
  coneBtn.mousePressed(() => currentModel = 'Cone');
}

function draw() {
  background(200);

  // Rotar con las teclas
  if (keyIsDown(LEFT_ARROW)) {
    angleY -= 0.02;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    angleY += 0.02;
  }
  if (keyIsDown(UP_ARROW)) {
    angleX -= 0.02;
  }
  if (keyIsDown(DOWN_ARROW)) {
    angleX += 0.02;
  }

  // Zoom con "+" y "-"
  if (keyIsDown(187)) { // "+" key
    zoom += 5;
  }
  if (keyIsDown(189)) { // "-" key
    zoom -= 5;
  }
  
  // Aplicar rotación y zoom
  translate(0, 0, zoom);
  rotateX(angleX);
  rotateY(angleY);
  
  // Ajustar la luz según los sliders
  let ambientLightLevel = ambientSlider.value();
  let directionalLightLevel = directionalSlider.value();

  // Luz ambiente
  ambientLight(ambientLightLevel);

  // Luz direccional
  directionalLight(directionalLightLevel, directionalLightLevel, directionalLightLevel, 0, -1, 0);
  
  // Color de la figura según el color picker
  let c = colorPicker.color();
  fill(c);

  // Dibujar el modelo seleccionado
  switch (currentModel) {
    case 'Cube':
      drawCube();
      break;
    case 'RectangularPrism':
      drawRectangularPrism();
      break;
    case 'Cylinder':
      drawCylinder();
      break;
    case 'Cone':
      drawCone();
      break;
  }
}

function drawCube() {
  noStroke();
  box(150);
  stroke(0);
  strokeWeight(2);
  noFill();
  box(150);
}

function drawRectangularPrism() {
  noStroke();
  box(150, 75, 100);
  stroke(0);
  strokeWeight(2);
  noFill();
  box(150, 75, 100);
}

function drawCylinder() {
  noStroke();
  cylinder(75, 150);
  stroke(0);
  strokeWeight(2);
  noFill();
  cylinder(75, 150);
}

function drawCone() {
  noStroke();
  cone(75, 150);
  stroke(0);
  strokeWeight(2);
  noFill();
  cone(75, 150);
}
