let mostrandoTutorial = true;
let inputTexto = "";
let frases = [
    "Esta es la primera frase que debes escribir.",
    "Aquí viene la segunda frase.",
    "Finalmente, la última frase para escribir."
];
let fraseIndex = 0;
let fraseActual = frases[fraseIndex];
let frasesCompletadas = 0;
let errores = 0;
let finalizado = false;
let letrasCorrectas = 0;
let totalLetras = 0;

function setup() {
    createCanvas(windowWidth, windowHeight); // Hacemos el canvas responsive
    textSize(32);
    textWrap(WORD); // Habilitamos el salto de línea por palabras
}

function draw() {
    background(220);

    if (mostrandoTutorial) {
        // Texto del tutorial bien organizado y espaciado
        text("Tutorial: Coloca tus manos en el teclado", 20, 100);
        text("El índice de la mano izquierda en la letra 'F'", 20, 150);
        text("El índice de la mano derecha en la letra 'J'", 20, 200);
        text("Presiona el botón para continuar.", 20, 300);
        
        // Dibujar un teclado básico con letras resaltadas para las manos
        dibujarTeclado();
        
        // Mostrar botón de continuar
        fill(0, 255, 0);
        rect(20, 350, 200, 50);
        fill(0);
        text("Continuar", 50, 385);
    } else if (finalizado) {
        // Mostrar el puntaje final
        text("Puntaje final: " + letrasCorrectas + " / " + totalLetras + " letras correctas", 20, 150);
        // Mostrar botón de reiniciar
        fill(0, 255, 0);
        rect(20, 200, 200, 50);
        fill(0);
        text("Reiniciar", 50, 235);
    } else {
        // Mostrar la frase actual que el usuario debe escribir
        fill(0); // Color negro para la frase
        textAlign(LEFT, BASELINE);
        textSize(32);
        text("Frase a escribir:", 20, 80);  // Texto fijo que indica qué hacer
        text(fraseActual, 20, 130, width - 40);  // Ajustamos la frase dentro del ancho de la pantalla
        
        // Mostrar el input del usuario con resaltado
        compararTextos(fraseActual, inputTexto, 20, 200, width - 40); // Paso el ancho para hacer el ajuste
        
        // Botón para mostrar el puntaje (ajuste de caja y texto)
        fill(0, 150, 255);
        rect(width - 220, 20, 200, 50);
        fill(255);
        textSize(24); // Reducimos el tamaño de la fuente del botón
        textAlign(CENTER, CENTER);
        text("Mostrar Puntaje", width - 120, 45); // Centrado dentro de la caja
        
        // Mostrar el puntaje actualizado (dentro de una caja ajustada)
        fill(0);
        let puntajeTexto = "Puntaje: " + frasesCompletadas + " (Errores: " + errores + ")";
        textAlign(LEFT, BASELINE);
        textSize(32); // Volvemos al tamaño original de texto
        text(puntajeTexto, 20, height - 50);

        // Ajustamos la caja alrededor del puntaje
        noFill();
        stroke(0);
        rect(10, height - 90, textWidth(puntajeTexto) + 20, 50); // Caja ajustada al texto
        noStroke();
    }
}

// Dibuja un teclado básico y resalta las teclas 'F' y 'J'
function dibujarTeclado() {
    let tecladoX = 20;
    let tecladoY = 250; // Ajustado más abajo para evitar solapamiento
    let teclaAncho = 50;
    let teclaAlto = 50;

    // Dibujar filas del teclado
    for (let i = 0; i < 10; i++) {
        fill(200);
        rect(tecladoX + i * teclaAncho, tecladoY, teclaAncho, teclaAlto);
    }

    // Resaltar la tecla 'F' (índice izquierdo)
    fill(0, 255, 0);
    rect(tecladoX + 3 * teclaAncho, tecladoY, teclaAncho, teclaAlto);
    fill(0);
    text('F', tecladoX + 3 * teclaAncho + 15, tecladoY + 35);

    // Resaltar la tecla 'J' (índice derecho)
    fill(0, 255, 0);
    rect(tecladoX + 6 * teclaAncho, tecladoY, teclaAncho, teclaAlto);
    fill(0);
    text('J', tecladoX + 6 * teclaAncho + 15, tecladoY + 35);
}

function mousePressed() {
    if (mostrandoTutorial) {
        if (mouseX > 20 && mouseX < 220 && mouseY > 350 && mouseY < 400) {
            mostrandoTutorial = false;
            inputTexto = ""; // Resetea el input
        }
    } else if (finalizado) {
        if (mouseX > 20 && mouseX < 220 && mouseY > 200 && mouseY < 250) {
            reiniciarPrograma();
        }
    } else {
        // Verificar si el botón de mostrar puntaje fue presionado
        if (mouseX > width - 220 && mouseX < width - 20 && mouseY > 20 && mouseY < 70) {
            alert("Puntaje actual: " + frasesCompletadas + " (Errores: " + errores + ")");
        }
    }
}

function keyPressed() {
    if (!mostrandoTutorial && !finalizado) {
        if (keyCode === BACKSPACE) {
            inputTexto = inputTexto.slice(0, -1); // Eliminar el último carácter
        } else if (keyCode === ENTER) {
            avanzarSiCompleto(); // Verificar si el usuario ha completado la frase
        } else if (key.length === 1) {
            inputTexto += key; // Agregar el carácter ingresado
            if (inputTexto[inputTexto.length - 1] !== fraseActual[inputTexto.length - 1]) {
                errores++; // Contar errores
            } else {
                letrasCorrectas++; // Contar letras correctas
            }
            totalLetras++; // Contar el total de letras ingresadas
        }
    }
}

function avanzarSiCompleto() {
    if (inputTexto === fraseActual) {
        frasesCompletadas++;
        if (fraseIndex < frases.length - 1) {
            fraseIndex++;
            fraseActual = frases[fraseIndex];
            inputTexto = ""; // Resetea el input
            errores = 0; // Reinicia el contador de errores
        } else {
            finalizado = true;
        }
    }
}

// Modificamos la función compararTextos para permitir saltos de línea
function compararTextos(objetivo, usuario, x, y, maxWidth) {
    let lineHeight = 40; // Altura de la línea
    let currentX = x;
    let currentY = y;

    for (let i = 0; i < usuario.length; i++) {
        if (textWidth(usuario[i]) + currentX > x + maxWidth) {
            currentX = x; // Reseteamos la posición X
            currentY += lineHeight; // Bajamos una línea
        }

        if (usuario[i] === objetivo[i]) {
            fill(255, 255, 0); // Amarillo para correcto
        } else {
            fill(255, 0, 0); // Rojo para incorrecto
        }
        text(usuario[i], currentX, currentY);
        currentX += textWidth(usuario[i]);
    }
}

function reiniciarPrograma() {
    fraseIndex = 0;
    fraseActual = frases[fraseIndex];
    frasesCompletadas = 0;
    errores = 0;
    letrasCorrectas = 0;
    totalLetras = 0;
    inputTexto = "";
    finalizado = false;
}
