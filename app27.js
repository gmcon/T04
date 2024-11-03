let recetas = [];
let inputNombre, inputIngredientes, inputInstrucciones, inputSearch;
let recetaEditando = -1;
let resultadosBusqueda = [];

function setup() {
  createCanvas(600, 700);
  textAlign(LEFT, TOP);

  inputNombre = createInput();
  inputIngredientes = createInput();
  inputInstrucciones = createInput();
  inputSearch = createInput(); // Barra de búsqueda
  inputSearch.position(20, 40);
  inputSearch.attribute('placeholder', 'Buscar recetas...');
  inputSearch.input(buscarRecetas); // Ejecutar búsqueda al escribir

  hideInputs(); // Ocultar inputs al inicio

  // Botón para crear nueva receta
  let botonAgregar = createButton("Agregar Receta");
  botonAgregar.position(20, 10);
  botonAgregar.mousePressed(agregarReceta);

  // Cargar recetas desde localStorage o ejemplos iniciales
  cargarRecetas();

  resultadosBusqueda = recetas; // Inicialmente mostrar todas las recetas
}

function draw() {
  background(255);
  fill(0);
  textSize(24);
  text("Recetario Interactivo", 20, 10);
  textSize(16);

  let yOffset = 100;
  let padding = 20; // Espacio extra para que el contenido no se sienta ajustado
  let lineHeight = 25; // Altura de línea para evitar que el texto se superponga

  for (let i = 0; i < resultadosBusqueda.length; i++) {
    let receta = resultadosBusqueda[i];
    let altoBarra = receta.abierta ? 350 : 50; // Mayor altura para más espacio

    if (yOffset + altoBarra > height) {
      break;
    }

    // Contenedor con bordes redondeados y color más suave
    fill(220);
    rect(10, yOffset - padding, width - 20, altoBarra, 10);

    fill(0);
    if (receta.editando) {
      inputNombre.position(20, yOffset);
      inputIngredientes.position(20, yOffset + lineHeight);
      inputInstrucciones.position(20, yOffset + lineHeight * 2);
    } else {
      text(receta.nombre, 20, yOffset);

      if (receta.abierta) {
        text("Ingredientes: " + receta.ingredientes, 20, yOffset + lineHeight, width - 40);
        text("Instrucciones: " + receta.instrucciones, 20, yOffset + lineHeight * 3, width - 40);
      }
    }

    // Flecha para abrir/cerrar
    let flecha = receta.abierta ? '▲' : '▼';
    text(flecha, width - 40, yOffset);

    // Mostrar botones solo si la receta está abierta
    if (receta.abierta) {
      let buttonEditX = width - 180;
      let buttonSaveX = width - 90;
      let buttonDeleteX = width - 270;
      let buttonDownloadX = width - 360;
      let buttonY = yOffset + altoBarra - 50;
      let buttonWidth = 70;
      let buttonHeight = 35;

      // Botón de Editar
      dibujarBoton(buttonEditX, buttonY, buttonWidth, buttonHeight, "Editar", color(70, 130, 180));

      // Botón de Guardar (solo visible si se está editando)
      if (receta.editando) {
        dibujarBoton(buttonSaveX, buttonY, buttonWidth, buttonHeight, "Guardar", color(100, 255, 150));
      }

      // Botón de Borrar
      dibujarBoton(buttonDeleteX, buttonY, buttonWidth, buttonHeight, "Borrar", color(255, 100, 100));

      // Botón de Descargar PDF
      dibujarBoton(buttonDownloadX, buttonY, buttonWidth + 20, buttonHeight, "Descargar PDF", color(100, 100, 255));
    }

    yOffset += altoBarra + padding;
  }
}

function mousePressed() {
  let yOffset = 100;
  let lineHeight = 25; // Altura de línea consistente

  for (let i = 0; i < resultadosBusqueda.length; i++) {
    let receta = resultadosBusqueda[i];
    let altoBarra = receta.abierta ? 350 : 50;

    // Detectar clic en la flecha
    if (mouseX > width - 60 && mouseX < width - 20 && mouseY > yOffset && mouseY < yOffset + 50) {
      receta.abierta = !receta.abierta;
      guardarRecetas(); // Guardar cambios de apertura/cierre
    }

    // Detectar clic en los botones dentro del contenedor abierto
    if (receta.abierta) {
      let buttonEditX = width - 180;
      let buttonSaveX = width - 90;
      let buttonDeleteX = width - 270;
      let buttonDownloadX = width - 360;
      let buttonY = yOffset + altoBarra - 50;
      let buttonWidth = 70;
      let buttonHeight = 35;

      // Clic en el botón de Editar
      if (mouseX > buttonEditX && mouseX < buttonEditX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        recetaEditando = i;
        receta.editando = true;
        inputNombre.value(receta.nombre);
        inputIngredientes.value(receta.ingredientes);
        inputInstrucciones.value(receta.instrucciones);
        showInputs(yOffset);
      }

      // Clic en el botón de Guardar
      if (receta.editando && mouseX > buttonSaveX && mouseX < buttonSaveX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        receta.nombre = inputNombre.value();
        receta.ingredientes = inputIngredientes.value();
        receta.instrucciones = inputInstrucciones.value();
        receta.editando = false;
        hideInputs();
        guardarRecetas(); // Guardar cambios en localStorage
      }

      // Clic en el botón de Borrar
      if (mouseX > buttonDeleteX && mouseX < buttonDeleteX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        recetas.splice(i, 1); // Borrar la receta
        resultadosBusqueda = recetas;
        guardarRecetas(); // Guardar los cambios en localStorage
        hideInputs();
        break; // Salir del bucle para evitar errores tras eliminar
      }

      // Clic en el botón de Descargar PDF
      if (mouseX > buttonDownloadX && mouseX < buttonDownloadX + buttonWidth + 20 && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        descargarPDF(receta);
      }
    }

    yOffset += altoBarra + 20;
  }
}

function agregarReceta() {
  let nuevaReceta = {
    nombre: "Nueva Receta",
    ingredientes: "",
    instrucciones: "",
    abierta: true,
    editando: true
  };
  recetas.push(nuevaReceta);
  resultadosBusqueda = recetas;
  guardarRecetas(); // Guardar nuevas recetas en localStorage
}

function dibujarBoton(x, y, width, height, texto, colorFondo) {
  fill(colorFondo);
  stroke(50);
  strokeWeight(2);
  rect(x, y, width, height, 8);
  fill(255);
  noStroke();
  textSize(14);
  text(texto, x + 10, y + 10);
}

function showInputs(yOffset) {
  inputNombre.position(20, yOffset);
  inputIngredientes.position(20, yOffset + 25);
  inputInstrucciones.position(20, yOffset + 50);
  inputNombre.show();
  inputIngredientes.show();
  inputInstrucciones.show();
}

function hideInputs() {
  inputNombre.hide();
  inputIngredientes.hide();
  inputInstrucciones.hide();
}

function buscarRecetas() {
  let query = inputSearch.value().toLowerCase();
  resultadosBusqueda = recetas.filter(receta =>
    receta.nombre.toLowerCase().includes(query) ||
    receta.ingredientes.toLowerCase().includes(query) ||
    receta.instrucciones.toLowerCase().includes(query)
  );
}

function descargarPDF(receta) {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Receta: ${receta.nombre}`, 10, 10);
  doc.setFontSize(12);
  doc.text(`Ingredientes: ${receta.ingredientes}`, 10, 30);
  doc.text(`Instrucciones: ${receta.instrucciones}`, 10, 50);
  doc.save(`${receta.nombre}.pdf`);
}

// Guardar recetas en localStorage
function guardarRecetas() {
  localStorage.setItem("recetas", JSON.stringify(recetas));
}

// Cargar recetas desde localStorage o usar ejemplos iniciales
function cargarRecetas() {
  let recetasGuardadas = localStorage.getItem("recetas");
  if (recetasGuardadas) {
    recetas = JSON.parse(recetasGuardadas);
  } else {
    recetas = [
      {
        nombre: "Tortilla de Patatas",
        ingredientes: "Patatas, Huevos, Aceite, Cebolla",
        instrucciones: "1. Cortar patatas y cebolla.\n2. Freír en aceite.\n3. Batir huevos y mezclar.\n4. Cocinar en sartén.",
        abierta: false,
        editando: false
      },
      {
        nombre: "Ensalada César",
        ingredientes: "Lechuga, Pollo, Queso, Croutones, Aderezo César",
        instrucciones: "1. Lavar la lechuga.\n2. Asar el pollo.\n3. Mezclar con queso y croutones.\n4. Añadir aderezo.",
        abierta: false,
        editando: false
      }
    ];
  }
}
