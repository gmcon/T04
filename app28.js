let xmin = -2.5, ymin = -2;
let xmax = 1, ymax = 2;
let zoomFactor = 0.95; // Factor de zoom
let currentFractal = "mandelbrot"; // Variable para el fractal actual
let button; // Botón para cambiar entre fractales
let colorButton; // Botón para cambiar colores
let slider; // Barra deslizadora para ajustar el ángulo del árbol
let angle; // Variable para el ángulo del árbol
let fractalColor; // Color del fractal
let c; // Variable para el parámetro c del conjunto de Julia
let sierpinskiDepthSlider; // Slider para controlar la profundidad del triángulo de Sierpinski
let sierpinskiDepth = 5; // Profundidad inicial del triángulo de Sierpinski

function setup() {
  createCanvas(710, 500); // Aumentar la altura para acomodar el slider
  pixelDensity(1);
  noLoop(); // No redibujar en bucle, lo haremos manualmente

  // Crear el botón para cambiar entre fractales
  button = createButton('Cambiar a Árbol Fractal');
  button.position(10, height - 40);
  button.mousePressed(toggleFractal); // Asignar función para cambiar fractal

  // Crear el botón para cambiar colores
  colorButton = createButton('Colores Aleatorios');
  colorButton.position(10, height - 70);
  colorButton.mousePressed(randomizeColor); // Asignar función para colores aleatorios

  // Crear la barra deslizadora para ajustar el ángulo del árbol
  slider = createSlider(0, TWO_PI, PI / 4, 0.01); // Rango de 0 a 2*PI para el ángulo
  slider.position(10, height - 100); // Posición del slider
  slider.hide(); // Ocultar el slider inicialmente

  // Crear la barra deslizadora para controlar la profundidad del triángulo de Sierpinski
  sierpinskiDepthSlider = createSlider(1, 10, sierpinskiDepth, 1); // Profundidad de 1 a 10
  sierpinskiDepthSlider.position(10, height - 130); // Posición del slider
  sierpinskiDepthSlider.hide(); // Ocultar el slider inicialmente

  fractalColor = color(255); // Establecer el color inicial del fractal
  c = createVector(-0.7, 0.27015); // Valor inicial de c para el conjunto de Julia
}

function draw() {
  background(0); // Limpiar el lienzo en cada dibujo
  fill(255); // Color blanco para el texto
  textSize(16);
  
  let infoText = "";
  if (currentFractal === "mandelbrot") {
    drawMandelbrot();
    infoText = "Conjunto de Mandelbrot:\nUn conjunto fractal que representa la\n" +
               "dinámica de la función cuadrática.";
  } else if (currentFractal === "fractalTree") {
    infoText = "Árbol Fractal:\nUna estructura fractal que simula el\n" +
               "crecimiento de un árbol.";
    angle = slider.value(); // Obtener el valor del slider
    stroke(fractalColor); // Establecer el color del árbol fractal
    translate(width / 2, height); // Mover el origen al centro inferior
    branch(100); // Iniciar el dibujo del árbol
  } else if (currentFractal === "julia") {
    infoText = "Conjunto de Julia:\nUn conjunto fractal relacionado con\n" +
               "el conjunto de Mandelbrot, con variaciones\ndependiendo de c.";
    drawJulia(); // Dibuja el conjunto de Julia con zoom
  } else if (currentFractal === "sierpinski") {
    infoText = "Triángulo de Sierpinski:\nUn triángulo fractal que se crea\n" +
               "dividiendo un triángulo en partes más pequeñas.";
    stroke(fractalColor); // Establecer el color del triángulo de Sierpinski
    fill(fractalColor); // Rellenar con el color del fractal
    sierpinskiDepth = sierpinskiDepthSlider.value(); // Obtener la profundidad del slider
    // Dibujar el triángulo de Sierpinski más arriba y más grande
    drawSierpinski(width / 2, height / 2 - 50, width / 3, sierpinskiDepth); // Dibujar el triángulo
  }
  text(infoText, 10, 30)
}

// Función para dibujar el conjunto de Mandelbrot
function drawMandelbrot() {
  background(0);

  // Calcular el tamaño del lienzo en el espacio complejo
  let w = (xmax - xmin);
  let h = (ymax - ymin);

  // Cargar los píxeles para modificar directamente
  loadPixels();

  const maxiterations = 100;

  // Incremento en x e y por cada píxel
  const dx = w / width;
  const dy = h / height;

  let y = ymin;
  for (let j = 0; j < height; j++) {
    let x = xmin;
    for (let i = 0; i < width; i++) {

      let a = x;
      let b = y;
      let n = 0;
      while (n < maxiterations) {
        const aa = a * a;
        const bb = b * b;
        const twoab = 2.0 * a * b;
        a = aa - bb + x;
        b = twoab + y;
        if (aa + bb > 16) {
          break;
        }
        n++;
      }

      const pix = (i + j * width) * 4;
      const norm = map(n, 0, maxiterations, 0, 1);
      let bright = map(sqrt(norm), 0, 1, 0, 255);
      if (n == maxiterations) {
        bright = 0;
      }

      // Establecer el color en función de fractalColor
      pixels[pix + 0] = bright * red(fractalColor) / 255; // Rojo
      pixels[pix + 1] = bright * green(fractalColor) / 255; // Verde
      pixels[pix + 2] = bright * blue(fractalColor) / 255; // Azul
      pixels[pix + 3] = 255; // Alpha
      x += dx;
    }
    y += dy;
  }

  updatePixels();
}

// Función para dibujar el conjunto de Julia
function drawJulia() {
  background(0);
  loadPixels();

  const maxiterations = 100;

  const dx = (xmax - xmin) / width;
  const dy = (ymax - ymin) / height;

  let y = ymin;
  for (let j = 0; j < height; j++) {
    let x = xmin;
    for (let i = 0; i < width; i++) {

      let a = x;
      let b = y;
      let n = 0;
      while (n < maxiterations) {
        const aa = a * a;
        const bb = b * b;
        if (aa + bb > 16) {
          break; // Bail out
        }
        b = 2 * a * b + c.y; // Fórmula del conjunto de Julia
        a = aa - bb + c.x;
        n++;
      }

      const pix = (i + j * width) * 4;
      const norm = map(n, 0, maxiterations, 0, 1);
      let bright = map(sqrt(norm), 0, 1, 0, 255);
      if (n == maxiterations) {
        bright = 0;
      }

      pixels[pix + 0] = bright * red(fractalColor) / 255; // Rojo
      pixels[pix + 1] = bright * green(fractalColor) / 255; // Verde
      pixels[pix + 2] = bright * blue(fractalColor) / 255; // Azul
      pixels[pix + 3] = 255; // Alpha
      x += dx;
    }
    y += dy;
  }

  updatePixels();
}

// Función para dibujar un triángulo de Sierpinski
function drawSierpinski(x, y, s, depth) {
  if (depth === 0) {
    noStroke(); // Sin borde
    triangle(x, y, x - s / 2, y + s * sqrt(3) / 2, x + s / 2, y + s * sqrt(3) / 2);
  } else {
    drawSierpinski(x, y, s / 2, depth - 1); // Triángulo superior
    drawSierpinski(x - s / 4, y + s * sqrt(3) / 4, s / 2, depth - 1); // Triángulo izquierdo
    drawSierpinski(x + s / 4, y + s * sqrt(3) / 4, s / 2, depth - 1); // Triángulo derecho
  }
}

// Función para manejar el zoom con el mouse en el conjunto de Mandelbrot y Julia
function mouseWheel(event) {
  if (currentFractal === "mandelbrot" || currentFractal === "julia") {
    let mouseXComplex = map(mouseX, 0, width, xmin, xmax);
    let mouseYComplex = map(mouseY, 0, height, ymin, ymax);

    let zoom = event.delta > 0 ? zoomFactor : 1 / zoomFactor;

    let newW = (xmax - xmin) * zoom;
    let newH = (ymax - ymin) * zoom;

    xmin = mouseXComplex - newW * ((mouseX - 0) / width);
    xmax = mouseXComplex + newW * ((width - mouseX) / width);
    ymin = mouseYComplex - newH * ((mouseY - 0) / height);
    ymax = mouseYComplex + newH * ((height - mouseY) / height);

    redraw(); // Redibujar después de ajustar el zoom
  }
}

// Función para alternar entre fractales
function toggleFractal() {
  if (currentFractal === "mandelbrot") {
    currentFractal = "fractalTree";
    button.html('Cambiar a Conjunto de Julia');
    slider.show(); // Mostrar el slider para el ángulo del árbol
    sierpinskiDepthSlider.hide(); // Ocultar el slider de profundidad
    loop(); // Reanudar el bucle de dibujo para el árbol
  } else if (currentFractal === "fractalTree") {
    currentFractal = "julia";
    button.html('Cambiar a Triángulo de Sierpinski');
    slider.hide(); // Ocultar el slider del árbol
    sierpinskiDepthSlider.hide(); // Ocultar el slider de profundidad
    loop(); // Reanudar el bucle de dibujo para el conjunto de Julia
  } else if (currentFractal === "julia") {
    currentFractal = "sierpinski";
    button.html('Cambiar a Conjunto de Mandelbrot');
    slider.hide(); // Ocultar el slider cuando está en modo Sierpinski
    sierpinskiDepthSlider.show(); // Mostrar el slider de profundidad
    loop(); // Reanudar el bucle de dibujo para el triángulo de Sierpinski
  } else {
    currentFractal = "mandelbrot";
    button.html('Cambiar a Árbol Fractal');
    slider.hide(); // Ocultar el slider cuando está en modo Mandelbrot
    sierpinskiDepthSlider.hide(); // Ocultar el slider de profundidad
    loop(); // Reanudar el bucle de dibujo para el conjunto de Mandelbrot
  }
}

// Función para cambiar colores aleatorios
function randomizeColor() {
  fractalColor = color(random(255), random(255), random(255)); // Generar color aleatorio
  redraw(); // Redibujar con el nuevo color
}

// Función para dibujar ramas del árbol
function branch(len) {
  if (len > 2) {
    stroke(fractalColor); // Establecer color de las ramas
    line(0, 0, 0, -len); // Dibujar la rama
    translate(0, -len); // Mover el origen a la punta de la rama
    push(); // Guardar el estado actual
    rotate(angle); // Rotar a la derecha
    branch(len * 0.67); // Dibujar la rama derecha
    pop(); // Restaurar el estado
    push(); // Guardar el estado actual
    rotate(-angle); // Rotar a la izquierda
    branch(len * 0.67); // Dibujar la rama izquierda
    pop(); // Restaurar el estado
  }
}
