let balon;
let gol = false;
let mostrandoResultado = false;
let imagenArco;
let imagenMessi;
let sonidoCorrecto, sonidoIncorrecto, musicaFondo, sonidoGol; // Sonidos para respuestas, música de fondo y gol
let balones = []; // Lista para almacenar los balones rebotando
let numBalones = 5; // Número de balones que se mostrarán rebotando

let preguntas = [
  {
    pregunta: "¿Cuántos Balones de Oro ha ganado Messi?",
    opciones: ["5", "6", "7", "8"],
    correcta: 2 // 7 Balones de Oro
  },
  {
    pregunta: "¿Cuántas veces ha ganado Colo Colo la Copa Libertadores?",
    opciones: ["1", "2", "3", "Ninguna"],
    correcta: 0 // 1 vez
  },
  {
    pregunta: "¿En qué año ganó Chile su primera Copa América?",
    opciones: ["2011", "2015", "2016", "2019"],
    correcta: 1 // 2015
  },
  {
    pregunta: "¿Cuál es el máximo goleador histórico de la selección chilena?",
    opciones: ["Alexis Sánchez", "Iván Zamorano", "Marcelo Salas", "Eduardo Vargas"],
    correcta: 0 // Alexis Sánchez
  },
  {
    pregunta: "¿Contra qué equipo debutó Messi con el Barcelona?",
    opciones: ["Espanyol", "Sevilla", "Porto", "Juventus"],
    correcta: 2 // Porto
  }
];

let estado = "preguntas"; // Estados: "preguntas", "penalty", "puntaje"
let preguntaActual = 0;
let seleccionada = -1;
let puntaje = 0;
let mostrarResultado = false;
let mostrarPuntajeFinal = false;
let delayCambioPregunta = false;

function preload() {
  // Cargar la imagen del arco y la de Messi
  imagenArco = loadImage('rec/imagenes/futbol.avif');//l arco
  imagenMessi = loadImage('rec/imagenes/leo.jpg');//en de Messi

  // Cargar los sonidos
  sonidoCorrecto = loadSound('rec/sonidos/correcto.mp3');
  sonidoIncorrecto = loadSound('rec/sonidos/perder.mp3');//
  musicaFondo = loadSound('rec/sonidos/gol.mp3');//Música de fondo
  sonidoGol = loadSound('rec/sonidos/gol.mp3'); // Sonido para el gol
}

function setup() {
  createCanvas(1024, 768);
  userStartAudio(); // Habilita el audio en navegadores que lo requieran

  // Iniciar la música de fondo en bucle
  musicaFondo.loop();

  // Crear los balones rebotando
  for (let i = 0; i < numBalones; i++) {
    balones.push(new Balon(random(30, width - 30), random(30, height - 30)));
  }
}

function draw() {
  if (estado === "preguntas") {
    mostrarInterfazModerna();
    if (mostrarPuntajeFinal) {
      mostrarPuntaje();
    } else {
      mostrarPregunta();
    }
    // Dibujar y mover los balones rebotando
    for (let balon of balones) {
      balon.mover();
      balon.dibujar();
    }
  } else if (estado === "penalty") {
    mostrarPenalty();
  } else if (estado === "puntaje") {
    mostrarPuntaje();
  }
}

function mostrarPregunta() {
  let pregunta = preguntas[preguntaActual];

  fill(255);
  stroke(0);
  strokeWeight(5);
  rect(50, 50, width - 350, 100, 20);

  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(32);
  text(pregunta.pregunta, width / 2 - 150, 120);

  for (let i = 0; i < pregunta.opciones.length; i++) {
    if (seleccionada === i) {
      if (i === pregunta.correcta) {
        fill(0, 255, 0); // Verde si es correcta
      } else {
        fill(255, 0, 0); // Rojo si es incorrecta
      }
    } else {
      fill(255);
    }
    stroke(0);
    strokeWeight(5);
    rect(100, 200 + i * 80, width - 400, 60, 20);

    fill(0);
    noStroke();
    textSize(28);
    textAlign(CENTER);
    text(pregunta.opciones[i], width / 2 - 150, 240 + i * 80);
  }

  if (mostrarResultado && !delayCambioPregunta) {
    delayCambioPregunta = true;
    setTimeout(() => {
      preguntaActual++;
      seleccionada = -1;
      mostrarResultado = false;
      delayCambioPregunta = false;
      if (preguntaActual >= preguntas.length) {
        mostrarPuntajeFinal = true;
        estado = "puntaje";
      }
    }, 2000); // Avanza a la siguiente pregunta después de 2 segundos
  }
}

function mostrarPuntaje() {
  fill(0);
  stroke(255);
  strokeWeight(5);
  rect(50, height / 2 - 100, width - 100, 200, 20);

  fill(255);
  textAlign(CENTER);
  textSize(48);
  text("Puntaje Final: " + puntaje + "/" + preguntas.length, width / 2, height / 2);

  drawRetryButton();
}

function mostrarInterfazModerna() {
  background(135, 206, 235);

  if (imagenMessi) {
    image(imagenMessi, width - 280, 50, 230, 300);
  }
}

function mousePressed() {
  if (estado === "puntaje" && mostrarPuntajeFinal) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 20 && mouseY < height / 2 + 60) {
      reiniciarJuego();
      estado = "penalty";
    }
  } else if (estado === "penalty") {
    balon.y -= 250;

    if (balon.y < 350 && balon.x > 320 && balon.x < 720) {
      gol = true;
      reproducirSonidoGol();
    } else if (balon.y < 350) {
      mostrandoResultado = true;
    }
  } else if (estado === "preguntas" && !mostrarResultado) {
    for (let i = 0; i < preguntas[preguntaActual].opciones.length; i++) {
      if (mouseY > 200 + i * 80 && mouseY < 260 + i * 80) {
        seleccionada = i;
        musicaFondo.pause(); // Pausar la música de fondo

        // Reproducir sonido correcto o incorrecto
        if (i === preguntas[preguntaActual].correcta) {
          puntaje++;
          sonidoCorrecto.play(); // Reproducir sonido correcto
          setTimeout(() => sonidoCorrecto.stop(), 2000); // Detener el sonido después de 2 segundos
        } else {
          sonidoIncorrecto.play(); // Reproducir sonido incorrecto
          setTimeout(() => sonidoIncorrecto.stop(), 2000); // Detener el sonido después de 2 segundos
        }

        // Esperar 2 segundos para avanzar a la siguiente pregunta y reanudar la música de fondo
        setTimeout(() => {
          mostrarResultado = true;
          musicaFondo.play(); // Reanudar la música de fondo
        }, 2000);
      }
    }
  }
}

function drawRetryButton() {
  fill(0);
  rect(width / 2 - 50, height / 2 + 20, 100, 40);
  fill(255);
  textAlign(CENTER);
  textSize(24);
  text("Reintentar", width / 2, height / 2 + 50);
}

function mostrarPenalty() {
  background(imagenArco);

  fill(255);
  stroke(0);
  ellipse(balon.x, balon.y, 30, 30);

  if (mostrandoResultado) {
    fill(255, 0, 0);
    textAlign(CENTER);
    textSize(32);
    text("¡Fallaste!", width / 2, height / 2 + 150);
  } else if (gol) {
    fill(0, 255, 0);
    textAlign(CENTER);
    textSize(48);
    text("¡Gol!", width / 2, height / 2); // Título de ¡Gol!
  }
}

function reproducirSonidoGol() {
  sonidoGol.play(); // Reproducir el sonido de gol
  setTimeout(() => {
    sonidoGol.stop(); // Detener el sonido después de 2 segundos
    estado = "preguntas"; // Volver a las preguntas después de 2 segundos
  }, 2000);
}

function reiniciarJuego() {
  balon = createVector(width / 2, height - 100);
  mostrandoResultado = false;
  gol = false;
  preguntaActual = 0;
  puntaje = 0;
  mostrarPuntajeFinal = false;
}

// Clase para crear balones que rebotan
class Balon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.diametro = 30;
    this.velX = random(-3, 3);
    this.velY = random(-3, 3);
  }

  mover() {
    this.x += this.velX;
    this.y += this.velY;

    // Rebotar en los bordes
    if (this.x < 0 || this.x > width) this.velX *= -1;
    if (this.y < 0 || this.y > height) this.velY *= -1;
  }

  dibujar() {
    fill(255);
    stroke(0);
    ellipse(this.x, this.y, this.diametro);
  }
}
