let mapa;
let regiones = [
  { 
    nombre: 'Arica y Parinacota', 
    x: 105, y: 20, 
    descripcion: 'Primera región de Chile, frontera con Perú.',
    ciudades: ['Arica']
  },
  { 
    nombre: 'Tarapacá', 
    x: 110, y: 70, 
    descripcion: 'Región famosa por sus playas y desierto.',
    ciudades: ['Iquique', 'Gran Iquique']
  },
  { 
    nombre: 'Antofagasta', 
    x: 120, y: 140, 
    descripcion: 'Importante por su minería, ubicada en el norte.',
    ciudades: ['Antofagasta', 'Calama']
  },
  { 
    nombre: 'Atacama', 
    x: 100, y: 240, 
    descripcion: 'Conocida por su desierto de flores.',
    ciudades: ['Copiapó', 'Vallenar']
  },
  { 
    nombre: 'Coquimbo', 
    x: 80, y: 330, 
    descripcion: 'Región con costas hermosas y valles fértiles.',
    ciudades: ['La Serena', 'Ovalle', 'Gran La Serena']
  },
  { 
    nombre: 'Valparaíso', 
    x: 80, y: 380, 
    descripcion: 'Región con el principal puerto de Chile.',
    ciudades: ['Valparaíso', 'Viña del Mar', 'Gran Valparaíso', 'San Antonio', 'San Felipe', 'Quillota', 'Limache']
  },
  { 
    nombre: 'Metropolitana', 
    x: 80, y: 405, 
    descripcion: 'Región que contiene la capital, Santiago.',
    ciudades: ['Santiago', 'Gran Santiago', 'Colina', 'Melipilla', 'Lampa', 'Buin', 'Peñaflor', 'Paine', 'Talagante']
  },
  { 
    nombre: 'O’Higgins', 
    x: 75, y: 430, 
    descripcion: 'Conocida por su agricultura y viñedos.',
    ciudades: ['Rancagua', 'Gran Rancagua', 'San Fernando', 'Rengo', 'San Vicente']
  },
  { 
    nombre: 'Maule', 
    x: 65, y: 460, 
    descripcion: 'Famosa por sus campos agrícolas.',
    ciudades: ['Talca', 'Curicó', 'Linares', 'Constitución', 'Cauquenes', 'San Javier']
  },
  { 
    nombre: 'Biobío', 
    x: 55, y: 495, 
    descripcion: 'Región industrial y forestal.',
    ciudades: ['Concepción', 'Gran Concepción', 'Los Ángeles']
  },
  { 
    nombre: 'La Araucanía', 
    x: 55, y: 535, 
    descripcion: 'Región de volcanes y lagos.',
    ciudades: ['Temuco', 'Gran Temuco', 'Villarrica', 'Angol']
  },
  { 
    nombre: 'Los Ríos', 
    x: 50, y: 570, 
    descripcion: 'Conocida por sus ríos y paisajes verdes.',
    ciudades: ['Valdivia', 'La Unión']
  },
  { 
    nombre: 'Los Lagos', 
    x: 55, y: 620, 
    descripcion: 'Famosa por sus lagos y paisajes patagónicos.',
    ciudades: ['Puerto Montt', 'Gran Puerto Montt', 'Osorno']
  },
  { 
    nombre: 'Aysén', 
    x: 50, y: 730, 
    descripcion: 'Región de la Patagonia, conocida por sus fiordos.',
    ciudades: ['Coyhaique']
  },
  { 
    nombre: 'Magallanes', 
    x: 50, y: 860, 
    descripcion: 'Región más austral, incluye la Antártica Chilena.',
    ciudades: ['Punta Arenas']
  }
];

let zoomRegion = null;
let zoomActive = false;
let botonSalir;

function preload() {
  // Carga la imagen del mapa de Chile
  mapa = loadImage('rec/imagenes/chile.png'); // Asegúrate de poner la ruta correcta aquí
}

function setup() {
  createCanvas(800, 980); // Aumenta el ancho del canvas
  botonSalir = createButton('Salir');
  botonSalir.position(10, height - 60); // Posición inicial del botón
  botonSalir.mousePressed(salirZoom);
  botonSalir.hide(); // Oculta el botón al inicio
}

function draw() {
  background(255);
  
  if (zoomActive && zoomRegion) {
    mostrarZoom(zoomRegion);
  } else {
    image(mapa, 0, 0);
    mostrarMapa();
  }
}

function mostrarMapa() {
  for (let i = 0; i < regiones.length; i++) {
    let r = regiones[i];
    let distancia = dist(mouseX, mouseY, r.x, r.y);

    // Si el mouse está cerca del punto, agrandar punto y texto
    let puntoSize = distancia < 10 ? 10 : 6;
    let textoSize = distancia < 10 ? 14 : 10;

    // Dibuja el punto
    fill(255, 0, 0);
    noStroke();
    ellipse(r.x, r.y, puntoSize, puntoSize);

    // Dibuja la línea que conecta al nombre de la región
    stroke(0);
    line(r.x, r.y, r.x + 100, r.y);

    // Dibuja el nombre de la región al final de la línea
    noStroke();
    fill(0);
    textSize(textoSize);
    textAlign(LEFT, CENTER);
    text(r.nombre, r.x + 105, r.y);

    // Si está en modo zoom y es la región seleccionada, resaltar
    if (zoomActive && zoomRegion === r) {
      fill(0, 0, 255);
      ellipse(r.x, r.y, puntoSize + 5, puntoSize + 5);
    }
  }
}

function mousePressed() {
  // Verifica si el mouse está cerca de alguna región para activar el zoom
  for (let i = 0; i < regiones.length; i++) {
    let r = regiones[i];
    let distancia = dist(mouseX, mouseY, r.x, r.y);

    if (distancia < 10) {
      zoomRegion = r;
      zoomActive = true;
      botonSalir.show(); // Muestra el botón para salir del zoom
      break;
    }
  }
}

function mostrarZoom(region) {
  // Muestra la imagen del mapa en la parte izquierda
  let zoomX = width / 2 - region.x * 2.2 - 100; // Mueve el zoom más a la izquierda
  let zoomY = height / 2 - region.y * 2;

  push();
  translate(zoomX, zoomY); // Mantiene la posición del mapa centrada en la región
  scale(2); // Aplica zoom

  image(mapa, 0, 0); // Muestra la imagen del mapa

  // Dibuja el punto en su posición original
  fill(0, 0, 255, 150);
  ellipse(region.x, region.y, 15, 15);
  pop();

  // Muestra la información de la región a la derecha
  let infoX = width / 2 + 20;
  let infoY = height / 2 - 80;

  // Fondo semi-transparente para la información de la región
  fill(255, 255, 255, 220);
  rect(infoX - 5, infoY - 5, 300, 150); // Rectángulo de fondo

  // Dibuja la información de la región
  fill(0);
  textSize(18);
  textAlign(LEFT, TOP); // Alineación a la izquierda
  text(`Región: ${region.nombre}`, infoX, infoY); // Texto a la derecha
  textSize(14);
  text(region.descripcion, infoX, infoY + 25, 250, 100); // Descripción centrada
  
  // Muestra las ciudades de la región
  textSize(12);
  text('Ciudades:', infoX, infoY + 110);
  for (let i = 0; i < region.ciudades.length; i++) {
    text(`- ${region.ciudades[i]}`, infoX + 10, infoY + 130 + (i * 15));
  }

  // Posiciona el botón de salir debajo de la información con más espacio
  botonSalir.position(infoX + 100, infoY + 180); // Ajusta la posición del botón
}

function salirZoom() {
  zoomActive = false;
  zoomRegion = null;
  botonSalir.hide(); // Oculta el botón al salir del zoom
}
