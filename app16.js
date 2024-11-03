let tasks = [];  // Lista de tareas
let input, addButton, charCount;
let backgroundImage;  // Variable para la imagen de fondo
let buttons = [];  // Lista de botones para las tareas
const maxChars = 40;  // Límite de caracteres
const taskSpacing = 70;  // Espaciado entre tareas (ajustado para mayor espacio)
let editingIndex = -1;  // Índice de la tarea que se está editando

function preload() {
  // Cargar la imagen de fondo
  backgroundImage = loadImage('rec/imagenes/fondo.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight - 10);
  
  input = createInput();
  input.attribute('maxlength', maxChars);
  input.style('font-size', '16px');
  input.style('padding', '10px');
  input.size(300);  // Ajustar el ancho del input
  
  // Indicador de límite de caracteres
  charCount = createP(`0/${maxChars} caracteres`);
  charCount.style('font-size', '14px');
  charCount.position(700, 100);  // Ajustar la posición

  // Escuchar cambios en el campo de entrada para actualizar el conteo de caracteres
  input.input(updateCharCount);

  addButton = createButton('Agregar tarea');
  addButton.mousePressed(addOrEditTask);
  
  styleButton(addButton);
}

function draw() {
  image(backgroundImage, 0, 0, windowWidth, windowHeight);
  
  let centerX = windowWidth / 2;
  
  textSize(32);
  textAlign(CENTER);
  fill(0);
  text("LISTA DE TAREAS", centerX, 80);
  
  // Posicionar el contador de caracteres justo más arriba del input
  charCount.position(centerX - input.width / 2, 95);  // Ajustar más arriba
  input.position(centerX - input.width / 2, 130);
  addButton.position(centerX - input.width / 2 + input.width + 15, 130);
  
  let taskY = 190;
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    
    fill(task.completed ? 'green' : 'black');
    textSize(16);
    textAlign(LEFT);
    let taskText = task.text;
    let maxLineLength = 25;  // Limitar a 25 caracteres por línea
    
    let taskLines = splitTextIntoLines(taskText, maxLineLength);
    
    for (let j = 0; j < taskLines.length; j++) {
      text(taskLines[j], centerX - 180, taskY + i * taskSpacing + j * 20);
    }
    
    if (task.completed && task.completedAt) {
      fill(100);
      textSize(12);
      textAlign(LEFT);
      text(`Hecho el: ${task.completedAt}`, centerX - 180, taskY + i * taskSpacing + taskLines.length * 20 + 5);
    }
  }
}

function addOrEditTask() {
  let taskText = input.value();
  if (taskText) {
    if (editingIndex === -1) {
      tasks.push({ text: taskText, completed: false, completedAt: null });
    } else {
      tasks[editingIndex].text = taskText;
      editingIndex = -1;
      addButton.html('Agregar tarea');
    }
    input.value('');
    updateTaskButtons();
    updateCharCount();  // Reiniciar el conteo de caracteres después de agregar
  }
}

function editTask(index) {
  input.value(tasks[index].text);
  editingIndex = index;
  addButton.html('Guardar cambios');
  updateCharCount();
}

function splitTextIntoLines(text, maxLength) {
  let lines = [];
  while (text.length > maxLength) {
    let line = text.substring(0, maxLength);
    let spaceIndex = line.lastIndexOf(' ');
    if (spaceIndex > -1) {
      line = line.substring(0, spaceIndex);
    }
    lines.push(line);
    text = text.substring(line.length).trim();
  }
  lines.push(text);
  return lines;
}

function updateTaskButtons() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].completeButton.remove();
    buttons[i].deleteButton.remove();
    buttons[i].editButton.remove();
  }
  
  buttons = [];
  
  let centerX = windowWidth / 2;
  let taskY = 190;
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let taskText = task.text;
    let taskLines = splitTextIntoLines(taskText, 25);  // Dividir en líneas si supera los 25 caracteres
    
    // Calcular la altura del texto para centrar los botones
    let buttonY = taskY + i * taskSpacing + (taskLines.length * 20) / 2 - 15;
    
    let completeButton = createButton(task.completed ? "✓" : "✔");
    completeButton.position(centerX + 80, buttonY);
    completeButton.mousePressed(() => toggleCompleteTask(i));
    styleButton(completeButton, task.completed ? 'green' : '#007BFF', false);

    let deleteButton = createButton("✖");
    deleteButton.position(centerX + 130, buttonY);
    deleteButton.mousePressed(() => deleteTask(i));
    styleButton(deleteButton, '#FF4C4C', false);
    
    let editButton = createButton("✏️");
    editButton.position(centerX + 180, buttonY);
    editButton.mousePressed(() => editTask(i));
    styleButton(editButton, '#572364', false);
    
    buttons.push({ completeButton, deleteButton, editButton });
  }
}

function toggleCompleteTask(index) {
  tasks[index].completed = !tasks[index].completed;
  
  if (tasks[index].completed) {
    tasks[index].completedAt = getCurrentDateTime();
  } else {
    tasks[index].completedAt = null;
  }
  
  updateTaskButtons();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  updateTaskButtons();
}

function styleButton(button, bgColor = '#007BFF', shadow = true) {
  button.style('font-size', '14px');
  button.style('padding', '8px 16px');
  button.style('border', 'none');
  button.style('border-radius', '8px');
  button.style('background-color', bgColor);
  button.style('color', 'white');
  button.style('cursor', 'pointer');
  
  if (shadow) {
    button.style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.1)');
  } else {
    button.style('box-shadow', 'none');
  }
  
  button.mouseOver(() => button.style('background-color', darkenColor(bgColor)));
  button.mouseOut(() => button.style('background-color', bgColor));
}

function updateCharCount() {
  let currentLength = input.value().length;
  charCount.html(`${currentLength}/${maxChars} caracteres`);
}

function getCurrentDateTime() {
  let now = new Date();
  let date = now.toLocaleDateString();
  let time = now.toLocaleTimeString();
  return `${date} a las ${time}`;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
