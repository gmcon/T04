let player;
let platforms = [];
let gravity;
let jumpPower;
let moveSpeed;

let cameraY = 0; // Posición actual de la cámara en el eje Y
let targetCameraY = 0; // Objetivo de desplazamiento de la cámara

// Variables para la generación procedural de plataformas
let minPlatformSpacing;
let maxPlatformSpacing;
let maxHorizontalOffset;

let lastPlatformY;

let score = 0;
let gameOver = false;

// Configuración del puntaje máximo
const MAX_SCORE = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Definir parámetros basados en el tamaño de la ventana
    gravity = windowHeight * 0.0012; // Ajusta la gravedad
    jumpPower = windowHeight * -0.035; // Ajusta la potencia de salto
    moveSpeed = windowWidth * 0.005; // Ajusta la velocidad de movimiento

    // Calcular la altura máxima del salto usando la fórmula h = v^2 / (2g)
    let maxJumpHeight = (jumpPower * jumpPower) / (2 * gravity);

    // Definir el rango de separación vertical entre plataformas
    minPlatformSpacing = maxJumpHeight * 0.5;
    maxPlatformSpacing = maxJumpHeight * 0.8;

    // Calcular el desplazamiento horizontal máximo basado en el tiempo en el aire
    let t_air = (2 * abs(jumpPower)) / gravity; // Tiempo total en el aire
    maxHorizontalOffset = moveSpeed * t_air * 0.8; // Ajusta el factor para dejar margen

    // Inicializar la primera plataforma debajo del jugador
    let initialPlatformWidth = 100;
    let initialPlatformHeight = 5; // Reducida la altura de la plataforma
    let initialPlatformX = width / 2 - initialPlatformWidth / 2;
    let initialPlatformY = height - 50;
    platforms.push(new Platform(initialPlatformX, initialPlatformY, initialPlatformWidth, initialPlatformHeight));
    lastPlatformY = initialPlatformY;

    // Crear jugador justo sobre la plataforma inicial
    let playerWidth = windowWidth * 0.02; // 2% del ancho de la ventana
    let playerHeight = windowHeight * 0.04; // 4% de la altura de la ventana
    let playerX = initialPlatformX + initialPlatformWidth / 2 - playerWidth / 2;
    let playerY = initialPlatformY - playerHeight;
    player = new Player(playerX, playerY, playerWidth, playerHeight);
    player.onGround = true; // El jugador está inicialmente sobre la plataforma

    // Generar plataformas iniciales hacia arriba
    for (let i = 1; i < 100; i++) { // Generar 10 plataformas inicialmente
        generateNewPlatform();
    }
}

function draw() {
// Determinar el color de fondo basado en el puntaje
    // Determinar el color de fondo basado en el puntaje
    if (score >= 70) {
        background(0, 0, 0); // Negro
        for (let i = 0; i < 50; i++) {
            let x = random(width);
            let y = random(height);
            stroke(255); // Color blanco para las estrellas
            point(x, y); // Dibuja un punto para la estrella
        }
    } else if (score >= 30) {
        background(0, 0, 128); // Azul marino
    } else {
        background(135, 206, 235); // Azul cielo
    }

if (!gameOver) {
        push();
        // Aplicar la transformación de la cámara de manera fluida
        cameraY = lerp(cameraY, targetCameraY, 0.1); // Interpolación para suavizar el movimiento
        translate(0, cameraY);

        // Dibujar y actualizar plataformas
        for (let platform of platforms) {
            platform.show();
        }

        // Actualizar y dibujar el jugador
        player.update();
        player.show();

        // Verificar colisiones con plataformas
        player.onGround = false; // Resetear estado en el suelo
        for (let platform of platforms) {
            player.checkCollision(platform);
        }

        pop(); // Restaurar la transformación

        // Generar nuevas plataformas según la posición del jugador
        generatePlatforms();

        // Eliminar plataformas que están demasiado abajo de la cámara
        removeOffscreenPlatforms();

        // Mostrar puntaje
        fill(255);
        textSize(32);
        textAlign(LEFT, TOP);
        text(`Puntaje: ${score}`, 20, 20);

        // **Añadir la condición para terminar el juego cuando el puntaje llega a 100**
        if (score >= 100) {
            gameOver = true;
        }

        // Verificar fin del juego por caída
        if ((player.y + cameraY) > height) { // Condición corregida
            gameOver = true;
        }

    } else {
        // Pantalla de fin del juego
        fill(0, 150);
        rect(0, 0, width, height);

        fill(255);
        textSize(48);
        textAlign(CENTER, CENTER);

        // **Mostrar mensaje de felicitaciones si el puntaje es 100 o más**
        if (score >= MAX_SCORE) {
            text(`¡Felicitaciones!\nHas terminado el juego.\nPresiona 'R' para reiniciar`, width / 2, height / 2);
        } else {
            // Pantalla de fin de juego estándar
            text(`¡Juego Terminado!\nPuntaje Final: ${score}\n`, width / 2, height / 2);
            textSize(24);
            text(`Presiona 'R' para reiniciar`, width / 2, height / 2 + 60);

            // Mostrar el puntaje más alto
            let highScore = localStorage.getItem('highScore') || 0;
            if (score > highScore) {
                localStorage.setItem('highScore', score);
                highScore = score;
            }
            text(`Puntaje Más Alto: ${highScore}`, width / 2, height / 2 + 120);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Actualizar parámetros basados en el nuevo tamaño
    gravity = windowHeight * 0.0012; // Reducida la gravedad
    jumpPower = windowHeight * -0.035; // Aumentada la potencia de salto
    moveSpeed = windowWidth * 0.005; // Mantener la velocidad de movimiento

    // Recalcular la altura máxima del salto
    let maxJumpHeight = (jumpPower * jumpPower) / (2 * gravity);

    // Definir el rango de separación vertical entre plataformas
    minPlatformSpacing = maxJumpHeight * 0.5;
    maxPlatformSpacing = maxJumpHeight * 0.8;

    // Recalcular el desplazamiento horizontal máximo
    let t_air = (2 * abs(jumpPower)) / gravity;
    maxHorizontalOffset = moveSpeed * t_air * 0.8;

    // Actualizar tamaño del jugador
    player.updateSize(windowWidth * 0.02, windowHeight * 0.04); // 2% ancho, 4% altura
}

function keyPressed() {
    if (!gameOver) {
        if (keyCode === LEFT_ARROW) {
            player.move(-moveSpeed);
        } else if (keyCode === RIGHT_ARROW) {
            player.move(moveSpeed);
        } else if (key === ' ' || keyCode === UP_ARROW) { // Salta con la barra espaciadora o la flecha hacia arriba
            player.jump();
        }
    } else {
        if (key === 'r' || key === 'R') {
            resetGame();
        }
    }
}

function keyReleased() {
    if (!gameOver) {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
            player.move(0);
        }
    }
}

// Función para actualizar la cámara al aterrizar en una plataforma
function updateCamera(platformY) {
    let desiredOffset = height * 0.75; // Posición deseada en la pantalla para la plataforma actual
    targetCameraY = desiredOffset - platformY;
}

// Función para generar una nueva plataforma con separación y desplazamiento controlados
function generateNewPlatform() {
    let ySpacing = random(minPlatformSpacing, maxPlatformSpacing);
    let lastPlatform = platforms[platforms.length - 1];
    let newY = lastPlatformY - ySpacing;

    // Calcular desplazamiento horizontal aleatorio dentro del rango permitido
    let xOffset = random(-maxHorizontalOffset, maxHorizontalOffset);
    let newX = lastPlatform.x + xOffset;

    // Obtener el ancho de la nueva plataforma antes de generar
    let newPlatformWidth = random(width * 0.01, width * 0.05); // 1% a 10% del ancho de la ventana

    // Asegurar que la nueva plataforma esté dentro de los límites de la pantalla
    newX = constrain(newX, 0, width - newPlatformWidth);

    // Reducir el ancho de la plataforma en función del puntaje para aumentar la dificultad
    let scaleFactor = 1 - (score / MAX_SCORE); // Ajustado para permitir puntajes hasta 100
    scaleFactor = constrain(scaleFactor, 0.3, 1); // Limitar entre 0.3 y 1
    let scaledWidth = newPlatformWidth * scaleFactor;

    // Crear nueva plataforma con ancho escalado y altura fija
    platforms.push(new Platform(newX, newY, scaledWidth, 20)); // Altura de 20 píxeles
    lastPlatformY = newY;
}

// Función para generar plataformas según sea necesario
function generatePlatforms() {
    // Generar plataformas mientras la última plataforma esté dentro del umbral
    while (lastPlatformY > cameraY - height) {
        generateNewPlatform();
    }
}

// Función para eliminar plataformas que están fuera de la pantalla
function removeOffscreenPlatforms() {
    platforms = platforms.filter(platform => platform.y < cameraY + height + 100);
}

// Función para reiniciar el juego
function resetGame() {
    gameOver = false;
    score = 0;
    cameraY = 0;
    targetCameraY = 0;
    platforms = [];

    // Reiniciar jugador y plataforma inicial
    let initialPlatformWidth = 100;
    let initialPlatformHeight = 5; // Reducida la altura de la plataforma
    let initialPlatformX = width / 2 - initialPlatformWidth / 2;
    let initialPlatformY = height - 50;
    platforms.push(new Platform(initialPlatformX, initialPlatformY, initialPlatformWidth, initialPlatformHeight));
    lastPlatformY = initialPlatformY;

    let playerWidth = windowWidth * 0.02; // 2% del ancho de la ventana
    let playerHeight = windowHeight * 0.04; // 4% de la altura de la ventana
    let playerX = initialPlatformX + initialPlatformWidth / 2 - playerWidth / 2;
    let playerY = initialPlatformY - playerHeight;
    player = new Player(playerX, playerY, playerWidth, playerHeight);
    player.onGround = true;

    // Generar plataformas iniciales hacia arriba
    for (let i = 1; i < 100; i++) { // Generar 10 plataformas inicialmente
        generateNewPlatform();
    }
}

class Player {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.onGround = false;
        this.currentPlatform = null;
        this.prevY = y;
    }

    update() {
        // Guardar posición anterior
        this.prevY = this.y;

        // Aplicar gravedad
        this.yVelocity += gravity;
        this.y += this.yVelocity;

        // Mover horizontalmente
        this.x += this.xVelocity;

        // Mantener al jugador dentro de los límites horizontales de la pantalla
        this.x = constrain(this.x, 0, width - this.w);

        // Limitar la velocidad vertical para evitar que el jugador se mueva demasiado rápido
        this.yVelocity = constrain(this.yVelocity, jumpPower, gravity * 20);
    }

    show() {
        fill(255, 0, 0); // Color rojo para el cubo
        rect(this.x, this.y, this.w, this.h);
    }

    move(speed) {
        this.xVelocity = speed;
    }

    jump() {
        if (this.onGround) { // Solo salta si está en el suelo
            this.yVelocity = jumpPower;
            this.onGround = false;
        }
    }

    checkCollision(platform) {
        // Solo verificar colisiones si el jugador está cayendo
        if (this.yVelocity > 0) {
            // Verificar si el jugador está sobre la plataforma
            if (this.x < platform.x + platform.w && this.x + this.w > platform.x) {
                // Verificar si la parte inferior del jugador está cruzando la parte superior de la plataforma
                if (this.prevY + this.h <= platform.y && this.y + this.h >= platform.y) {
                    // Colocar al jugador sobre la plataforma
                    this.y = platform.y - this.h;
                    this.yVelocity = 0;
                    this.onGround = true;

                    // Incrementar el puntaje solo si es una nueva plataforma más alta
                    if (this.currentPlatform == null || platform.y < this.currentPlatform.y) {
                        score += 1;
                        this.currentPlatform = platform;
                    }

                    // Ajustar la cámara para seguir al jugador
                    updateCamera(platform.y);
                }
            }
        }
    }

    updateSize(newW, newH) {
        this.w = newW;
        this.h = newH;
        // Asegurarse de que el jugador no esté fuera de los límites después del cambio de tamaño
        this.x = constrain(this.x, 0, width - this.w);
        this.y = constrain(this.y, 0, height - this.h);
    }
}

class Platform {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show() {
        fill(0, 255, 0); // Color verde para la plataforma
        rect(this.x, this.y, this.w, this.h);
    }
}
