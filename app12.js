let palabras = ["PROCESSING", "JAVASCRIPT", "PYTHON", "HTML", "CSS", "REACT", "NODE", "GITHUB", "JAVA", "SWIFT"];
let palabra;
let letrasAdivinadas = [];
let intentos = 6;
let letrasUsadas = [];
let canvasWidth = 800;
let canvasHeight = 600;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textAlign(CENTER, CENTER);
  
  palabra = random(palabras); // Seleccionar una palabra aleatoria
  for (let i = 0; i < palabra.length; i++) {
    letrasAdivinadas[i] = "_";
  }
}

function draw() {
  background(255);
  
  // Mostrar la palabra con guiones o letras adivinadas
  textSize(32);
  let palabraAdivinada = letrasAdivinadas.join(" ");
  text(palabraAdivinada, width / 2, height / 4);
  
  // Mostrar letras usadas
  textSize(20);
  text("Letras usadas: " + letrasUsadas.join(", "), width / 2, (height / 4) + 40);
  
  // Dibujar ahorcado completo
  dibujarAhorcado();

  // Verificar si ganó o perdió
  if (letrasAdivinadas.join("") === palabra) {
    textSize(32);
    text("¡Ganaste!", width / 2, (3 * height) / 4);
    noLoop();
  } else if (intentos <= 0) {
    textSize(32);
    text("¡Perdiste! La palabra era: " + palabra, width / 2, (3 * height) / 4);
    noLoop();
  }
}

function keyPressed() {
  let letra = key.toUpperCase();
  
  if (!letrasUsadas.includes(letra) && /[A-Z]/.test(letra)) {
    letrasUsadas.push(letra);
    
    if (palabra.includes(letra)) {
      for (let i = 0; i < palabra.length; i++) {
        if (palabra[i] === letra) {
          letrasAdivinadas[i] = letra;
        }
      }
    } else {
      intentos--; // Reduce el número de intentos si la letra no está en la palabra
    }
  }
}

function dibujarAhorcado() {
  stroke(0); // Cambia el color a negro
  strokeWeight(4);
  
  let baseX1 = width / 2 - 100;
  let baseX2 = width / 2 + 100;
  let baseY = height / 2 + 150;

  // Base del ahorcado
  line(baseX1, baseY, baseX2, baseY); // Base
  line(width / 2 - 50, baseY, width / 2 - 50, baseY - 200); // Poste vertical
  line(width / 2 - 50, baseY - 200, width / 2 + 50, baseY - 200); // Poste horizontal
  line(width / 2 + 50, baseY - 200, width / 2 + 50, baseY - 170); // Cuerda

  // Dibujo del ahorcado (completo)
  if (intentos < 6) {
    ellipse(width / 2 + 50, baseY - 100, 40, 40); // Cabeza
  }
  if (intentos < 5) {
    line(width / 2 + 50, baseY - 80, width / 2 + 50, baseY - 30); // Cuerpo
  }
  if (intentos < 4) {
    line(width / 2 + 50, baseY - 80, width / 2 - 20, baseY - 50); // Brazo izquierdo
  }
  if (intentos < 3) {
    line(width / 2 + 50, baseY - 80, width / 2 + 20, baseY - 50); // Brazo derecho
  }
  if (intentos < 2) {
    line(width / 2 + 50, baseY - 30, width / 2 - 20, baseY); // Pierna izquierda
  }
  if (intentos < 1) {
    line(width / 2 + 50, baseY - 30, width / 2 + 20, baseY); // Pierna derecha
  }
}
