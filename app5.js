let cols, rows;
let w = 40;  // Tamaño inicial de cada celda
let grid = [];
let current;
let stack = [];
let player;  // Jugador
let goal;    // Meta
let fondoImg, paredImg, jugadorImg, metaImg;  // Imágenes de fondo, paredes, jugador y meta
let level = 1;  // Nivel del laberinto

function preload() {
  // Cargar las imágenes
  fondoImg = loadImage('rec/imagenes/cesped.jpg');
  paredImg = loadImage('rec/imagenes/ladrillos.jpg');
  jugadorImg = loadImage('rec/imagenes/player.png');
  metaImg = loadImage('rec/imagenes/meta.png');
  
  // Cargar sonidos
  moveSound = loadSound('rec/sonidos/movement.mp3', () => moveSound.playMode('sustain'));
  goalSound = loadSound('rec/sonidos/complet.mp3', () => goalSound.playMode('sustain'));
  wallHitSound = loadSound('rec/sonidos/chocarpared.mp3', () => wallHitSound.playMode('sustain'));
}

function setup() {
  let canvas = createCanvas(400, 400);
  // Centrando el canvas en la ventana
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  cols = floor(width / w);
  rows = floor(height / w);

  // Crear todas las celdas
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  // Comenzar desde la primera celda
  current = grid[0];

  // Definir al jugador (empezando en la celda 0,0)
  player = grid[0];

  // Definir la meta (última celda del laberinto)
  goal = grid[grid.length - 1];
}

function draw() {
  // Dibujar el fondo
  background(fondoImg);  

  // Centrar el laberinto en el canvas
  let offsetX = (width - cols * w) / 2;
  let offsetY = (height - rows * w) / 2;
  translate(offsetX, offsetY);

  // Dibujar todas las celdas
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  // Algoritmo DFS
  current.visited = true;
  let next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }

  // Dibujar al jugador
  player.showPlayer();

  // Dibujar la meta
  goal.showGoal();

  // Mostrar el nivel actual
  showLevel();

  // Verificar si el jugador llega a la meta
  checkGoal();
}

// Función para encontrar el índice en la cuadrícula
function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) {
    return -1;
  }
  return i + j * cols;
}

// Función para mostrar el nivel en el canvas
function showLevel() {
  noStroke();
  fill(255);  // Color blanco para el texto
  textSize(24);  // Tamaño del texto
  textAlign(CENTER, TOP);  // Alinear el texto al centro horizontal y la parte superior
  text('Nivel: ' + level, width / 2, 10);  // Mostrar el texto en el centro superior del canvas
}

// Definir la clase Cell
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true]; // [top, right, bottom, left]
    this.visited = false;
  }

  checkNeighbors() {
    let neighbors = [];

    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  show() {
    let x = this.i * w;
    let y = this.j * w;
    stroke(255);

    // Dibujar las paredes con imágenes de textura
    if (this.walls[0]) {
      image(paredImg, x, y, w, w / 10);  // Pared superior
    }
    if (this.walls[1]) {
      image(paredImg, x + w - 5, y, w / 10, w);  // Pared derecha ajustada
    }
    if (this.walls[2]) {
      image(paredImg, x, y + w - 5, w, w / 10);  // Pared inferior ajustada
    }
    if (this.walls[3]) {
      image(paredImg, x, y, w / 10, w);  // Pared izquierda
    }

    // Eliminar el color rosa de las celdas visitadas
    /*if (this.visited) {
      noStroke();
      fill(255, 0, 255, 100); // Este es el color que causa el efecto rosa
      rect(x, y, w, w);
    }*/
  }

  // Mostrar al jugador con textura
  showPlayer() {
    let x = this.i * w;
    let y = this.j * w;
    image(jugadorImg, x, y, w, w);  // Usar imagen del jugador
  }

  // Mostrar la meta con textura
  showGoal() {
    let x = this.i * w;
    let y = this.j * w;
    image(metaImg, x + w * 0.25, y + w * 0.25, w * 0.5, w * 0.5);  // Usar imagen de la meta
  }
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

// Verificar si el jugador llega a la meta
function checkGoal() {
  // Comparar posiciones en lugar de los objetos
  if (player.i === goal.i && player.j === goal.j) {
    level++;  // Aumentar nivel
    goalSound.play();  // Reproducir sonido de meta
    
    // Aumentar la dificultad reduciendo el tamaño de las celdas cada 5 niveles
    if (level % 5 === 0 && w > 20) {  
      w -= 5;  // Reducir el tamaño de las celdas (mínimo 20px)
    }

    newMaze();  // Generar nuevo laberinto
  }
}

// Generar un nuevo laberinto
function newMaze() {
  grid = [];
  stack = [];
  cols = floor(width / w);
  rows = floor(height / w);
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0];
  player = grid[0];  // Reiniciar al jugador a la primera celda
  goal = grid[grid.length - 1];  // Colocar la meta en la última celda
}

// Mover al jugador con las teclas
function keyPressed() {
  let moved = false;
  let hitWall = false;

  if (key === 'W' || key === 'w' || keyCode === UP_ARROW) {
    let top = grid[index(player.i, player.j - 1)];
    if (top && !player.walls[0]) {
      player = top;
      moved = true;
    } else {
      hitWall = true;
    }
  } else if (key === 'S' || key === 's' || keyCode === DOWN_ARROW) {
    let bottom = grid[index(player.i, player.j + 1)];
    if (bottom && !player.walls[2]) {
      player = bottom;
      moved = true;
    } else {
      hitWall = true;
    }
  } else if (key === 'A' || key === 'a' || keyCode === LEFT_ARROW) {
    let left = grid[index(player.i - 1, player.j)];
    if (left && !player.walls[3]) {
      player = left;
      moved = true;
    } else {
      hitWall = true;
    }
  } else if (key === 'D' || key === 'd' || keyCode === RIGHT_ARROW) {
    let right = grid[index(player.i + 1, player.j)];
    if (right && !player.walls[1]) {
      player = right;
      moved = true;
    } else {
      hitWall = true;
    }
  }

  // Reproducir sonido de movimiento si el jugador se movió
  if (moved) {
    moveSound.play();
  }

  // Reproducir sonido de choque si el jugador chocó con una pared
  if (hitWall) {
    wallHitSound.play();
  }
}

function windowResized() {
  // Recalcular la posición del canvas para centrarlo cuando cambie el tamaño de la ventana
  resizeCanvas(400, 400);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
