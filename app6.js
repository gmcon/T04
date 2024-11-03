let sun;
let planets = [];
let asteroids = [];
let exploded = false;
let explodeButton, resetButton, addPlanetButton;
let selectedObject = null; // Variable para almacenar el objeto seleccionado

function setup() {
  createCanvas(windowWidth, windowHeight); // Lienzo del tamaño de la ventana
  sun = new Planet(50, 0, 0, color(255, 204, 0), "Sol", {
    gravedad: "274 m/s²",
    atmosfera: "Hidrógeno, Helio",
    temperatura: "5505°C"
  });

  // Planetas del Sistema Solar
  planets.push(new Planet(8, 70, 0.04, color(139, 69, 19), "Mercurio", {
    gravedad: "3.7 m/s²",
    atmosfera: "Oxígeno, Sodio",
    temperatura: "-173°C a 427°C"
  }));
  planets.push(new Planet(12, 100, 0.03, color(218, 165, 32), "Venus", {
    gravedad: "8.87 m/s²",
    atmosfera: "CO₂, Nitrógeno",
    temperatura: "462°C"
  }));
  planets.push(new Planet(13, 140, 0.02, color(0, 102, 204), "Tierra", {
    gravedad: "9.8 m/s²",
    atmosfera: "N₂, O₂",
    temperatura: "-88°C a 58°C"
  }));
  planets.push(new Planet(10, 180, 0.018, color(255, 69, 0), "Marte", {
    gravedad: "3.71 m/s²",
    atmosfera: "CO₂, Argón",
    temperatura: "-87°C a -5°C"
  }));
  planets.push(new Planet(22, 240, 0.008, color(255, 165, 0), "Júpiter", {
    gravedad: "24.79 m/s²",
    atmosfera: "Hidrógeno, Helio",
    temperatura: "-108°C"
  }));
  planets.push(new Planet(18, 300, 0.006, color(210, 180, 140), "Saturno", {
    gravedad: "10.44 m/s²",
    atmosfera: "Hidrógeno, Helio",
    temperatura: "-139°C"
  }));
  planets.push(new Planet(16, 360, 0.005, color(135, 206, 250), "Urano", {
    gravedad: "8.87 m/s²",
    atmosfera: "Hidrógeno, Helio, Metano",
    temperatura: "-195°C"
  }));
  planets.push(new Planet(16, 420, 0.004, color(0, 0, 139), "Neptuno", {
    gravedad: "11.15 m/s²",
    atmosfera: "Hidrógeno, Helio, Metano",
    temperatura: "-201°C"
  }));

  // Botón para explotar el Sol
  explodeButton = createButton('Explotar el Sol');
  explodeButton.position(10, 10);
  explodeButton.mousePressed(explodeSun);

  // Botón para restablecer el sistema (renacer el sol)
  resetButton = createButton('Renacer Estrella');
  resetButton.position(10, 40);
  resetButton.mousePressed(resetSystem);

  // Botón para agregar un planeta
  addPlanetButton = createButton('Agregar Planeta');
  addPlanetButton.position(10, 70);
  addPlanetButton.mousePressed(addPlanet);

  // Agregar algunos asteroides
  for (let i = 0; i < 10; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2); // Coloca el Sol en el centro de la ventana

  if (!exploded) {
    sun.display(); // Dibuja el Sol si no ha explotado
    sun.displayLabel(); // Dibuja el nombre del Sol
  }

  // Dibuja las órbitas solo si el Sol no ha explotado
  if (!exploded) {
    stroke(255, 50);
    noFill();
    for (let planet of planets) {
      ellipse(0, 0, planet.distance * 2); // Órbita del planeta
    }
  }

  // Dibuja los planetas
  for (let planet of planets) {
    if (exploded) {
      planet.moveAway(); // Movimiento aleatorio si el Sol explotó
    } else {
      planet.update(); // Movimiento orbital normal
    }
    planet.display();
    planet.displayLabel(); // Dibuja el nombre del planeta
  }

  // Dibuja y mueve los asteroides
  for (let asteroid of asteroids) {
    asteroid.move();
    asteroid.display();

    // Verifica colisiones con los planetas
    for (let planet of planets) {
      if (asteroid.hits(planet)) {
        console.log("¡Colisión entre un asteroide y un planeta!");
        planet.size -= 1; // El planeta se reduce de tamaño al colisionar
        if (planet.size <= 0) {
          planets.splice(planets.indexOf(planet), 1); // Elimina el planeta si es muy pequeño
        }
      }
    }
  }

  // Muestra la descripción del objeto seleccionado como una tabla inclinada
  if (selectedObject) {
    push();
    translate(10, 100); // Desplaza la tabla hacia la derecha y abajo
    rotate(radians(10)); // Inclina la tabla a la derecha

    fill(0, 150); // Fondo semitransparente
    rect(0, 0, 220, 100, 10); // Fondo de la tabla

    fill(255);
    noStroke();
    textSize(12);

    // Títulos de las columnas
    text("Característica", 10, 20);
    text("Valor", 130, 20);

    // Datos del objeto seleccionado
    text("Nombre:", 10, 40);
    text(selectedObject.name, 130, 40);
    text("Gravedad:", 10, 60);
    text(selectedObject.info.gravedad, 130, 60);
    text("Atmósfera:", 10, 80);
    text(selectedObject.info.atmosfera, 130, 80);
    text("Temperatura:", 10, 100);
    text(selectedObject.info.temperatura, 130, 100);

    pop();
  }
}

// Función que ajusta el tamaño del lienzo cuando la ventana se redimensiona
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Cambia el tamaño del lienzo al tamaño de la ventana
}

// Función para explotar el Sol
function explodeSun() {
  exploded = true;
  for (let planet of planets) {
    planet.randomDirection(); // Asigna direcciones aleatorias a los planetas
  }
}

// Función para restablecer el sistema solar
function resetSystem() {
  exploded = false;
  for (let planet of planets) {
    planet.reset(); // Restablece la órbita normal
  }
}

// Función para agregar un planeta nuevo
function addPlanet() {
  let size = random(8, 20);
  let distance = random(100, 500);
  let speed = random(0.004, 0.04);
  let col = color(random(255), random(255), random(255));
  let name = "Planeta " + nf(planets.length + 1, 2); // Nombre dinámico del planeta
  planets.push(new Planet(size, distance, speed, col, name, {
    gravedad: "Desconocido",
    atmosfera: "Desconocido",
    temperatura: "Desconocido"
  }));
}

// Clase Planet
class Planet {
  constructor(size, distance, speed, col, name, info) {
    this.size = size;
    this.distance = distance;
    this.angle = random(TWO_PI); // Posición inicial aleatoria
    this.speed = speed; // Velocidad de rotación
    this.col = col;
    this.name = name; // Nombre del planeta
    this.info = info; // Información del planeta
    this.velocity = createVector(0, 0); // Velocidad inicial
  }

  update() {
    this.angle += this.speed; // Actualiza la posición del planeta en su órbita
  }

  moveAway() {
    this.distance += this.velocity.mag(); // El planeta se aleja tras la explosión del Sol
  }

  display() {
    fill(this.col);
    noStroke();
    let x = this.distance * cos(this.angle);
    let y = this.distance * sin(this.angle);
    ellipse(x, y, this.size); // Dibuja el planeta
  }

  displayLabel() {
    let x = this.distance * cos(this.angle);
    let y = this.distance * sin(this.angle);
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(10);
    text(this.name, x, y + this.size); // Muestra el nombre del planeta debajo
  }

  randomDirection() {
    this.velocity = p5.Vector.random2D().mult(random(1, 3)); // Dirección aleatoria tras la explosión
  }

  reset() {
    this.velocity = createVector(0, 0); // Restablece la velocidad
  }

  clicked() {
    let x = this.distance * cos(this.angle);
    let y = this.distance * sin(this.angle);
    let d = dist(mouseX - width / 2, mouseY - height / 2, x, y);
    return d < this.size / 2;
  }
}

// Clase Asteroid (similar a un meteorito)
class Asteroid {
  constructor() {
    this.pos = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2));
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.size = random(5, 15);
  }

  move() {
    this.pos.add(this.velocity); // Movimiento en línea recta
  }

  display() {
    fill(150);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size); // Dibuja el asteroide
  }

  hits(planet) {
    let d = dist(this.pos.x, this.pos.y, planet.distance * cos(planet.angle), planet.distance * sin(planet.angle));
    return d < (this.size + planet.size) / 2;
  }
}

// Detecta si se ha hecho clic sobre un planeta o el Sol
function mousePressed() {
  if (sun.clicked()) {
    selectedObject = sun;
  } else {
    for (let planet of planets) {
      if (planet.clicked()) {
        selectedObject = planet;
        break;
      }
    }
  }
}
