let input;
let button;
let userName = "Usuario";  // Nombre por defecto
let botName = "Bot";
let messages = [
  "¡Hola! ¿Cómo te encuentras hoy?", 
  "¿En qué puedo ayudarte?", 
  "Cuéntame más sobre tu día.", 
  "¿Tienes alguna pregunta?", 
  "¡Gracias por usar este chat!"
];
let chatHistory = [];
let scrollOffset = 0;

function setup() {
  createCanvas(400, 400);
  
  // Crear cuadro de texto
  input = createInput();
  input.position(20, height - 40);
  
  // Crear botón de enviar
  button = createButton('Enviar');
  button.position(input.x + input.width + 10, height - 40);
  button.mousePressed(sendMessage);

  // Botón para cambiar el nombre del usuario
  let nameButton = createButton('Cambiar nombre');
  nameButton.position(20, height - 80);
  nameButton.mousePressed(changeUserName);
}

function draw() {
  background(240);

  // Mostrar historial de chat
  textSize(14);
  let yOffset = 20 - scrollOffset;
  for (let i = 0; i < chatHistory.length; i++) {
    if (chatHistory[i].startsWith(userName)) {
      fill(0, 0, 255);  // Color azul para el usuario
    } else {
      fill(0, 102, 51);  // Color verde para el bot
    }
    text(chatHistory[i], 20, yOffset);
    yOffset += 20;
  }

  // Controlar el scroll si el chat es largo
  if (yOffset > height - 50) {
    scrollOffset = yOffset - (height - 50);
  }
}

// Función para enviar mensajes
function sendMessage() {
  let userMessage = input.value();
  if (userMessage != "") {
    chatHistory.push(userName + ": " + userMessage);
    input.value('');

    // Respuesta automática
    let randomMessage = random(messages);
    setTimeout(() => {
      chatHistory.push(botName + ": " + randomMessage);
    }, 1000); // Simular un retraso de 1 segundo
  }
}

// Función para cambiar el nombre del usuario
function changeUserName() {
  let newName = prompt("Por favor ingresa tu nuevo nombre:");
  if (newName) {
    userName = newName;
  }
}
