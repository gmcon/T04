let img;
let thumbnails = [];
let currentImageIndex = 1;
let filterType = '';
let particles = []; // Arreglo para partículas

function preload() {
    // Cargar la primera imagen
    img = loadImage(`rec/imagenes/image${currentImageIndex}.jpeg`);
    // Cargar las miniaturas
    for (let i = 1; i <= 9; i++) {
        thumbnails[i] = loadImage(`rec/imagenes/image${i}.jpeg`);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Crear botones para cambiar los filtros
    let grayscaleButton = createButton('Blanco y Negro');
    grayscaleButton.position(width - 150, 100);
    grayscaleButton.mousePressed(() => applyFilter('GRAY'));

    let sepiaButton = createButton('Sepia');
    sepiaButton.position(width - 150, 150);
    sepiaButton.mousePressed(() => applyFilter('SEPIA'));

    let invertButton = createButton('Inverso');
    invertButton.position(width - 150, 200);
    invertButton.mousePressed(() => applyFilter('INVERT'));

    let resetButton = createButton('Quitar filtro');
    resetButton.position(width - 150, 250);
    resetButton.mousePressed(() => applyFilter(''));

    // Crear partículas iniciales
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0);

    // Mostrar las partículas flotantes
    for (let particle of particles) {
        particle.update();
        particle.show();
    }

    // Mostrar las miniaturas a la izquierda
    for (let i = 1; i <= 9; i++) {
        image(thumbnails[i], 10, i * 50, 50, 50); // Dibujar miniaturas
    }

    // Mostrar la imagen principal
    image(img, 150, (height - 400) / 2, 400, 400); // Posición de la imagen principal

    // Aplicar filtro a la imagen si corresponde
    if (filterType === 'GRAY') {
        filter(GRAY);
    } else if (filterType === 'INVERT') {
        filter(INVERT);
    } else if (filterType === 'SEPIA') {
        applySepia();
    }
}

// Función para aplicar los filtros según el botón presionado
function applyFilter(type) {
    filterType = type;
}

// Cambiar la imagen al hacer clic en las miniaturas
function mousePressed() {
    for (let i = 1; i <= 9; i++) {
        if (mouseX > 10 && mouseX < 60 && mouseY > i * 50 && mouseY < i * 50 + 50) {
            currentImageIndex = i;
            img = loadImage(`rec/imagenes/image${currentImageIndex}.jpeg`); // Cambiar la imagen
        }
    }
}

// Función para simular el efecto sepia
function applySepia() {
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];

        pixels[i] = r * 0.393 + g * 0.769 + b * 0.189;
        pixels[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
        pixels[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    }
    updatePixels();
}

// Clase para partículas flotantes
class Particle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
        this.size = random(2, 5);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebote en los bordes
        if (this.x > width || this.x < 0) {
            this.vx *= -1;
        }
        if (this.y > height || this.y < 0) {
            this.vy *= -1;
        }
    }

    show() {
        noStroke();
        fill(255, 100);
        ellipse(this.x, this.y, this.size);
    }
}
