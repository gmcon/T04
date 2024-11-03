let particles = [];
let explosionParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  
  // Agregar nuevas partículas que siguen al ratón
  particles.push(new Particle(mouseX, mouseY));

  // Mostrar y actualizar cada partícula normal
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();

    // Eliminar las partículas que son demasiado viejas
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }

  // Mostrar y actualizar las partículas de la explosión
  for (let i = explosionParticles.length - 1; i >= 0; i--) {
    explosionParticles[i].update();
    explosionParticles[i].show();

    // Eliminar las partículas de la explosión que terminan su ciclo de vida
    if (explosionParticles[i].finished()) {
      explosionParticles.splice(i, 1);
    }
  }
}

// Crear la explosión al hacer clic
function mousePressed() {
  for (let i = 0; i < 50; i++) {
    explosionParticles.push(new ExplosiveParticle(mouseX, mouseY));
  }
}

// Clase de Partícula normal
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);  // Velocidad en x
    this.vy = random(-2, 2);  // Velocidad en y
    this.alpha = 255;         // Transparencia
    this.color = [random(255), random(255), random(255)];  // Color inicial aleatorio
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;

    // Rebotar las partículas si tocan los bordes
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  show() {
    noStroke();

    // Cambiar a color verde si el ratón está en el centro
    if (dist(mouseX, mouseY, width / 2, height / 2) < 100) {
      fill(0, 255, 0, this.alpha);  // Verde si el ratón está en el centro
    } 
    // Cambiar a color rojo si la partícula está cerca de los bordes
    else if (this.x < 50 || this.x > width - 50 || this.y < 50 || this.y > height - 50) {
      fill(255, 0, 0, this.alpha);  // Rojo
    } 
    else {
      fill(this.color[0], this.color[1], this.color[2], this.alpha);  // Color original
    }

    ellipse(this.x, this.y, 16);
  }

  finished() {
    return this.alpha < 0;
  }
}

// Clase de Partícula explosiva (para el efecto de explosión)
class ExplosiveParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-5, 5);  // Velocidad más alta en x para el efecto de explosión
    this.vy = random(-5, 5);  // Velocidad más alta en y para el efecto de explosión
    this.alpha = 255;         // Transparencia
    this.bounces = 0;         // Contador de rebotes
    this.color = [random(255), random(255), random(255)];  // Color inicial aleatorio
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;

    // Rebotar hasta 2 veces
    if ((this.x < 0 || this.x > width) && this.bounces < 2) {
      this.vx *= -1;
      this.bounces++;
    }
    if ((this.y < 0 || this.y > height) && this.bounces < 2) {
      this.vy *= -1;
      this.bounces++;
    }
  }

  show() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    ellipse(this.x, this.y, 10);  // Tamaño más pequeño para partículas de explosión
  }

  finished() {
    return this.alpha < 0 || this.bounces >= 2;  // Desaparecer después de 2 rebotes
  }
}
