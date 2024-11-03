let currentMonth;
let currentYear;
let daysInMonth;
let dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
let selectedDay = null;
let events = {};  // Diccionario para almacenar eventos en días específicos
let cellWidth, cellHeight;
let eventDisplay = null;
let bgColorIndex = 0;  // Índice de color para cambiar entre fondos
let bgColors = [
  [240, 248, 255], [245, 245, 220], [255, 228, 225], [230, 230, 250],
  [240, 255, 240], [255, 255, 224], [255, 239, 213], [255, 250, 240],
  [240, 255, 255], [255, 240, 245]
];
let today = new Date();  // Fecha actual para marcar el día del evento

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  calculateCellSize();
  displayCalendar();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateCellSize();
  displayCalendar();
}

function calculateCellSize() {
  cellWidth = width / 7;
  cellHeight = (height - 100) / 7;
}

function draw() {
  if (eventDisplay) {
    fill(0);
    textSize(20);
    text(eventDisplay, width / 2, height - 50);
  }
}

function displayCalendar() {
  background(bgColors[bgColorIndex]);

  eventDisplay = null;

  // Colores
  let selectedColor = color(100, 200, 255);
  let eventColor = color(200, 100, 100);
  let todayEventColor = color(100, 255, 100);  // Verde para el día del evento
  let weekendColor = color(220, 220, 220);
  let weekdayDefaultColor = color(255);  // Blanco para lunes a viernes
  let dayColor = color(0);

  // Mostrar el mes y año actual
  textSize(24);
  fill(0);
  let monthName = getMonthName(currentMonth);
  text(`${monthName} ${currentYear}`, width / 2, 40);

  // Mostrar los nombres de los días de la semana
  textSize(18);
  for (let i = 0; i < dayNames.length; i++) {
    fill(0);
    text(dayNames[i], i * cellWidth + cellWidth / 2, 80);
  }

  // Calcular días del mes
  daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let startDay = new Date(currentYear, currentMonth, 1).getDay();

  // Mostrar los días
  let x = startDay * cellWidth;
  let y = 120;
  for (let i = 1; i <= daysInMonth; i++) {
    let isToday = (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear());
    
    if (isToday) {
      fill(todayEventColor);  // Color verde para el día actual con evento
    } else if (events[`${currentYear}-${currentMonth}-${i}`]) {
      fill(eventColor);  // Resaltar días con eventos
    } else if ((startDay + i - 1) % 7 === 0 || (startDay + i - 1) % 7 === 6) {
      fill(weekendColor);  // Resaltar fines de semana
    } else {
      fill(weekdayDefaultColor);  // Blanco para lunes a viernes
    }

    // Resaltar día seleccionado
    if (selectedDay === i) {
      fill(selectedColor);
    }

    rect(x, y, cellWidth, cellHeight, 5);

    fill(dayColor);
    textSize(18);
    text(i, x + cellWidth / 2, y + cellHeight / 2);

    x += cellWidth;
    if (x >= width) {
      x = 0;
      y += cellHeight;
    }
  }

  // Botones para navegar entre meses
  fill(0);
  textSize(20);
  text('<', 50, height - 50);
  text('>', width - 50, height - 50);

  // Botones para navegar entre años
  text('<<', 50, height - 80);
  text('>>', width - 50, height - 80);

  // Botón para cambiar el color de fondo
  textSize(16);
  fill(0);
  rect(width - 120, 20, 100, 30, 5);
  fill(255);
  text("Cambiar fondo", width - 70, 35);
}

function mousePressed() {
  // Navegación entre meses
  if (mouseX > 30 && mouseX < 70 && mouseY > height - 70 && mouseY < height - 30) {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    displayCalendar();
  } else if (mouseX > width - 70 && mouseX < width - 30 && mouseY > height - 70 && mouseY < height - 30) {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    displayCalendar();
  }

  // Navegación entre años
  if (mouseX > 30 && mouseX < 70 && mouseY > height - 100 && mouseY < height - 60) {
    currentYear--;
    displayCalendar();
  } else if (mouseX > width - 70 && mouseX < width - 30 && mouseY > height - 100 && mouseY < height - 60) {
    currentYear++;
    displayCalendar();
  }

  // Selección de un día
  let startDay = new Date(currentYear, currentMonth, 1).getDay();
  let x = startDay * cellWidth;
  let y = 120;
  for (let i = 1; i <= daysInMonth; i++) {
    if (mouseX > x && mouseX < x + cellWidth && mouseY > y && mouseY < y + cellHeight) {
      selectedDay = i;
      // Agregar evento en el día seleccionado (si se hace clic derecho)
      if (mouseButton === RIGHT) {
        let eventDate = `${currentYear}-${currentMonth}-${i}`;
        events[eventDate] = prompt('Introduce el evento para este día:');
      }
      displayCalendar();
      break;
    }

    x += cellWidth;
    if (x >= width) {
      x = 0;
      y += cellHeight;
    }
  }

  // Botón para cambiar color de fondo
  if (mouseX > width - 120 && mouseX < width - 20 && mouseY > 20 && mouseY < 50) {
    bgColorIndex = (bgColorIndex + 1) % bgColors.length;
    displayCalendar();
  }
}

function mouseMoved() {
  // Mostrar el nombre del evento si pasa el ratón sobre un día con evento
  let startDay = new Date(currentYear, currentMonth, 1).getDay();
  let x = startDay * cellWidth;
  let y = 120;
  for (let i = 1; i <= daysInMonth; i++) {
    if (mouseX > x && mouseX < x + cellWidth && mouseY > y && mouseY < y + cellHeight) {
      let eventDate = `${currentYear}-${currentMonth}-${i}`;
      if (events[eventDate]) {
        eventDisplay = events[eventDate];
      } else {
        eventDisplay = null;
      }
      break;
    }

    x += cellWidth;
    if (x >= width) {
      x = 0;
      y += cellHeight;
    }
  }
}

function getMonthName(month) {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return monthNames[month];
}
