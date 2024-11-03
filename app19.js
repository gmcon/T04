let ship;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let stars = [];
let level = 1; // Nivel inicial
let safeZoneHeight = 100; // Altura del espacio seguro para la nave

// Cargar las imágenes
let shipImage;
let enemyShipImage;

function preload() {
  // Cargar imágenes antes de que inicie el juego
  shipImage = loadImage('rec/imagenes/nave.png');
  enemyShipImage = loadImage('rec/imagenes/nave-enemiga.png');
}

function setup() {
  createCanvas(800, 600);
  ship = new Ship();

  // Crear las estrellas
  for (let i = 0; i < 200; i++) {
    stars.push(new Star());
  }

  // Generar las naves iniciales
  generateEnemies();
}

function draw() {
  background(0);

  // Mostrar las estrellas
  for (let star of stars) {
    star.show();
    star.move();
  }

  if (!gameOver) {
    // Mostrar la nave del jugador
    ship.show();
    ship.move();

    // Mostrar y mover las balas del jugador
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].show();
      bullets[i].move();

      // Eliminar balas fuera de la pantalla
      if (bullets[i].offscreen()) {
        bullets.splice(i, 1);
      }
    }

    // Mostrar y mover las balas enemigas
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      enemyBullets[i].show();
      enemyBullets[i].move();

      // Detectar colisión con la nave del jugador
      if (enemyBullets[i].hits(ship)) {
        gameOver = true;
      }

      // Eliminar balas enemigas fuera de la pantalla
      if (enemyBullets[i].offscreen()) {
        enemyBullets.splice(i, 1);
      }
    }

    // Mostrar y mover los enemigos
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].show();
      enemies[i].move();

      // Ataque aleatorio de los enemigos basado en su nivel (con menor frecuencia)
      if (random(1) < enemies[i].shootProbability) {
        enemyBullets.push(new EnemyBullet(enemies[i].x, enemies[i].y, enemies[i].level));
      }

      // Detectar colisiones con las balas del jugador
      for (let j = bullets.length - 1; j >= 0; j--) {
        if (enemies[i].hits(bullets[j])) {
          enemies.splice(i, 1); // Eliminar enemigo cuando es golpeado por una bala
          bullets.splice(j, 1); // Eliminar la bala
          score += 10; // Incrementar el puntaje
          break;
        }
      }

      // Detectar colisión con la nave del jugador
      if (enemies[i] && enemies[i].hits(ship)) {
        gameOver = true;
      }
    }

    // Si no hay más enemigos, subir de nivel
    if (enemies.length === 0) {
      level++; // Aumentar nivel
      generateEnemies(); // Generar enemigos para el siguiente nivel
    }

    // Mostrar la puntuación y el nivel
    fill(255);
    textSize(24);
    text("Score: " + score, 10, 25);
    text("Level: " + level, width - 100, 25);
  } else {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2);
    text("Score: " + score, width / 2, height / 2 + 40);
  }
}

// Crear disparos con la barra espaciadora
function keyPressed() {
  if (key === ' ') {
    bullets.push(new Bullet(ship.x, ship.y));
  }
  if (keyCode === LEFT_ARROW) {
    ship.setDir(-1);
  } else if (keyCode === RIGHT_ARROW) {
    ship.setDir(1);
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    ship.setDir(0);
  }
}

// Clase de la nave del jugador
class Ship {
  constructor() {
    this.x = width / 2;
    this.y = height - 40;
    this.xdir = 0;
    this.r = 20;
  }

  show() {
    imageMode(CENTER);
    image(shipImage, this.x, this.y, 40, 40); // Ajusta el tamaño según sea necesario
  }

  setDir(dir) {
    this.xdir = dir;
  }

  move() {
    this.x += this.xdir * 5;
    this.x = constrain(this.x, 0, width);
  }
}

// Clase para las balas del jugador
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.toDelete = false;
  }

  show() {
    fill(255, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  move() {
    this.y -= 5;
  }

  offscreen() {
    return this.y < 0;
  }

  hits(obj) {
    let d = dist(this.x, this.y, obj.x, obj.y);
    return d < this.r + obj.r;
  }
}

// Clase de las naves enemigas
class Enemy {
  constructor(level, yPos) {
    this.level = level;
    this.x = random(100, width - 100);
    this.y = -50;
    this.targetY = yPos;
    this.r = 30;
    this.yspeed = 2;
    this.staticPositionReached = false;
    this.shootProbability = this.setShootProbability(level);
    this.color = this.setColor(level);
  }

  setColor(level) {
    if (level === 1) {
      return color(0, 255, 0); 
    } else if (level === 2) {
      return color(255, 255, 0); 
    } else {
      return color(255, 0, 0); 
    }
  }

  setShootProbability(level) {
    if (level === 1) {
      return 0.001; 
    } else if (level === 2) {
      return 0.002; 
    } else {
      return 0.003; 
    }
  }

  show() {
    imageMode(CENTER);
    image(enemyShipImage, this.x, this.y, 60, 60); 
  }

  move() {
    if (!this.staticPositionReached) {
      this.y += this.yspeed;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.staticPositionReached = true;
      }
    }
  }

  hits(obj) {
    let d = dist(this.x, this.y, obj.x, obj.y);
    return d < this.r + obj.r;
  }
}

// Clase para las balas enemigas
class EnemyBullet {
  constructor(x, y, level) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.r = 6;
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  move() {
    this.y += 5;
  }

  offscreen() {
    return this.y > height;
  }

  hits(obj) {
    let d = dist(this.x, this.y, obj.x, obj.y);
    return d < this.r + obj.r;
  }
}

// Clase para las estrellas
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.speed = random(1, 3);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
    }
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// Generar enemigos según el nivel
function generateEnemies() {
  enemies = []; // Resetear enemigos anteriores

  let numberOfEnemies = level * 5; // Aumenta la cantidad de enemigos por nivel
  let yOffset = 50;
  
  // Generar enemigos, evitando que caigan en el área segura
  for (let i = 0; i < numberOfEnemies; i++) {
    if (yOffset < height - safeZoneHeight) {
      enemies.push(new Enemy(level, yOffset));
    }
    yOffset += 60;
  }
}
