let story = [];
let currentNode = 0;
let bgImage;
let fade = 0; // Controla el efecto de desvanecimiento
let fadeSpeed = 3; // Velocidad del desvanecimiento
let transitioning = false; // Para verificar si estamos en transición

function preload() {
  // Cargar la imagen de fondo
  bgImage = loadImage('https://plus.unsplash.com/premium_photo-1661874079038-a75b2a1754e9?q=80&w=2099&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); // Cambia la URL por la de tu imagen
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  textSize(24);

  // Definir nodos de la historia
  story.push({
    text: "Estás caminando por un bosque oscuro. Oyes un ruido a lo lejos.",
    option1: "Investigarlo",
    option2: "Ignorarlo y seguir caminando",
    nextNode1: 1,
    nextNode2: 2
  });

  story.push({
    text: "Te acercas al ruido y encuentras a un lobo amigable. Parece herido.",
    option1: "Hacerte amigo del lobo y ayudarlo",
    option2: "Escapar del lobo, es mejor no arriesgarse",
    nextNode1: 3,
    nextNode2: 4
  });

  story.push({
    text: "Sigues caminando hasta que encuentras una casa misteriosa, pero sientes que es mejor no entrar.",
    option1: "Entrar en la casa y explorar",
    option2: "Seguir caminando hacia el claro del bosque",
    nextNode1: 5,
    nextNode2: 6
  });

  story.push({
    text: "El lobo se convierte en tu fiel compañero y juntos encuentran un camino hacia una antigua ciudad perdida llena de aventuras.",
    option1: "Explorar la ciudad juntos",
    option2: "Buscar tesoros antiguos",
    nextNode1: 7,
    nextNode2: 8
  });

  story.push({
    text: "Intentas escapar, pero el lobo te sigue. Te adentras en una cueva oscura y fría.",
    option1: "Seguir dentro de la cueva para encontrar una salida",
    option2: "Buscar otra salida a la luz del día",
    nextNode1: 9,
    nextNode2: 10
  });

  story.push({
    text: "La casa está vacía, pero encuentras un diario que habla de un tesoro oculto y sugiere que a menudo hay trampas.",
    option1: "Seguir el diario con cautela",
    option2: "Salir y explorar el bosque",
    nextNode1: 11,
    nextNode2: 12
  });

  story.push({
    text: "Sigues caminando, pero nunca encuentras nada interesante. A veces, lo que buscas no está en el exterior, sino en tu interior. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "Descubres que la ciudad perdida está llena de misterios y criaturas mágicas que pueden enseñarte mucho sobre el poder de la amistad.",
    option1: "Investigar más sobre las criaturas",
    option2: "Regresar con lo aprendido y compartirlo",
    nextNode1: 13,
    nextNode2: 14
  });

  story.push({
    text: "Encuentras un tesoro legendario, pero está protegido por un antiguo guardián que te ofrece un acertijo.",
    option1: "Luchar contra el guardián",
    option2: "Buscar una manera de negociar el tesoro",
    nextNode1: 15,
    nextNode2: 16
  });

  story.push({
    text: "La cueva parece no tener fin y sientes que te estás perdiendo más y más. A veces, es importante no rendirse y encontrar la luz al final del túnel.",
    option1: "Seguir adelante con determinación",
    option2: "Intentar volver y buscar ayuda",
    nextNode1: 17,
    nextNode2: 18
  });

  story.push({
    text: "Logras salir por una abertura oculta y encuentras una playa desierta, un lugar perfecto para reflexionar sobre tus decisiones.",
    option1: "Explorar la playa y buscar respuestas",
    option2: "Construir una balsa para escapar a nuevas aventuras",
    nextNode1: 19,
    nextNode2: 20
  });

  story.push({
    text: "Sigues el diario y descubres un mapa oculto que te guía hacia una cueva llena de sorpresas.",
    option1: "Entrar en la cueva con curiosidad",
    option2: "Ignorar el mapa y seguir tu propio camino",
    nextNode1: 21,
    nextNode2: 22
  });

  story.push({
    text: "Mientras exploras el bosque, encuentras una extraña criatura que parece amigable, recordando que no todos los extraños son peligrosos.",
    option1: "Interactuar con la criatura y hacer nuevos amigos",
    option2: "Alejarse lentamente y seguir tu camino",
    nextNode1: 23,
    nextNode2: 24
  });

  story.push({
    text: "Investigando más en la ciudad, descubres que tienes poderes mágicos y que con gran poder viene una gran responsabilidad.",
    option1: "Utilizar los poderes para ayudar a los habitantes",
    option2: "Usar los poderes para tu propio beneficio",
    nextNode1: 25,
    nextNode2: 26
  });

  story.push({
    text: "Regresas con lo aprendido y te conviertes en un sabio respetado, demostrando que el conocimiento es un gran tesoro. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "Luchas contra el guardián, pero es demasiado fuerte. Aprendiste que a veces es mejor la paz que la guerra. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "El guardián acepta negociar y te permite llevar una parte del tesoro, enseñándote que a veces la diplomacia puede ser más poderosa que la fuerza. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "Sigues adentrándote en la cueva y encuentras un lago subterráneo, recordando que siempre hay belleza en lo desconocido.",
    option1: "Nadar en el lago y disfrutar la experiencia",
    option2: "Buscar otro camino hacia la salida",
    nextNode1: 27,
    nextNode2: 28
  });

  story.push({
    text: "Vuelves por donde viniste, pero ya no puedes encontrar la salida. A veces, hay que arriesgarse para encontrar el camino correcto. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "Exploras la playa y encuentras señales de una antigua civilización, recordando que la curiosidad puede llevarte a grandes descubrimientos.",
    option1: "Investigar más sobre la civilización",
    option2: "Construir un refugio para descansar",
    nextNode1: 29,
    nextNode2: 30
  });

  story.push({
    text: "Construyes una balsa y navegas hacia lo desconocido, comprendiendo que cada aventura comienza con un paso valiente. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "La cueva está llena de trampas, pero logras esquivar la mayoría, aprendiendo que la astucia es vital para sobrevivir. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "Ignoras el mapa y sigues caminando, pero te pierdes en el bosque. A veces, hay que escuchar las señales del destino. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "La criatura resulta ser mágica y te guía hacia un lugar seguro, recordándote que la bondad puede venir de los lugares más inesperados.",
    option1: "Agradecer a la criatura y hacer un nuevo amigo",
    option2: "Explorar el lugar con la criatura",
    nextNode1: 31,
    nextNode2: 32
  });

  story.push({
    text: "Te alejas lentamente y sigues tu camino sin incidentes, recordando que a veces es mejor mantener la distancia. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "Usas tus poderes para mejorar la ciudad y te conviertes en un héroe, entendiendo que el verdadero valor está en ayudar a los demás. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });

  story.push({
    text: "Tus poderes se descontrolan y causan problemas en la ciudad, recordando que con gran poder debe venir una gran responsabilidad. Fin.",
    option1: "Reiniciar",
    option2: "Salir",
    nextNode1: 0,
    nextNode2: -1
  });
}
function draw() { 
  // Dibuja la imagen de fondo ajustando el tamaño sin distorsionar las proporciones
  background(255); // Fondo blanco en caso de que la imagen no cubra toda la pantalla
  let imgAspect = bgImage.width / bgImage.height; // Proporción de la imagen
  let canvasAspect = width / height; // Proporción del canvas

  if (canvasAspect > imgAspect) {
    let newHeight = width / imgAspect;
    image(bgImage, 0, (height - newHeight) / 2, width, newHeight);
  } else {
    let newWidth = height * imgAspect;
    image(bgImage, (width - newWidth) / 2, 0, newWidth, height);
  }

  // Solo mostrar el contenido cuando no estamos en transición
  if (!transitioning) {
    // Escala de la tarjeta y texto en función del tamaño de la pantalla
    let cardWidth = width * 0.8; // El 80% del ancho de la pantalla
    let cardHeight = height * 0.35; // Mayor altura para evitar que se corte el texto
    let cardX = (width - cardWidth) / 2; // Centrar la tarjeta en el ancho
    let cardY = height / 4; // Ubicación en la parte superior de la pantalla

    // Tarjeta de historia
    fill(255, 220, 185, 200); // Tarjeta semi-transparente
    rect(cardX, cardY, cardWidth, cardHeight, 20); // Tarjeta de historia

    // Configuración del texto
    fill(0); // Texto negro
    textAlign(LEFT, TOP); // Alineación del texto
    textSize(width / 30); // Tamaño del texto más pequeño para evitar cortes
    textWrap(WORD); // Ajustar el texto a las palabras

    // Definir el área del texto dentro de la tarjeta
    let textBoxX = cardX + 20; // Margen izquierdo de la tarjeta
    let textBoxY = cardY + 20; // Margen superior de la tarjeta
    let textBoxWidth = cardWidth - 40; // Ancho del área de texto
    let textBoxHeight = cardHeight - 40; // Altura del área de texto

    // Mostrar el texto de la historia actual dentro de la tarjeta
    text(story[currentNode].text, textBoxX, textBoxY, textBoxWidth, textBoxHeight);

    // Opciones
    let optionBoxHeight = height * 0.1; // Altura de las opciones ajustada
    let optionY1 = height / 2 + 20;
    let optionY2 = height / 2 + 20 + optionBoxHeight + 20; // Espacio entre las opciones

    fill(200, 255, 200, 200); // Tarjetas semi-transparente para opciones
    rect(cardX, optionY1, cardWidth, optionBoxHeight, 10); // Opción 1
    rect(cardX, optionY2, cardWidth, optionBoxHeight, 10); // Opción 2

    // Texto de las opciones
    fill(0); // Texto negro
    textAlign(CENTER, CENTER); // Centrar el texto de las opciones
    textSize(width / 35); // Texto más pequeño para opciones
    text(story[currentNode].option1, width / 2, optionY1 + optionBoxHeight / 2);
    text(story[currentNode].option2, width / 2, optionY2 + optionBoxHeight / 2);
  }

  // Transición de desvanecimiento
  if (transitioning) {
    fill(255, fade); // Color blanco con opacidad creciente
    rect(0, 0, width, height); // Cubrir la pantalla

    fade += fadeSpeed; // Aumentar la opacidad

    if (fade >= 255) {
      fade = 255;
      currentNode = nextNode;
      transitioning = false;
      fadeSpeed = -fadeSpeed;
    }
  } else if (fade > 0) {
    fill(255, fade);
    rect(0, 0, width, height);
    fade += fadeSpeed;
    if (fade <= 0) {
      fade = 0;
      fadeSpeed = -fadeSpeed;
    }
  }
}

function mousePressed() {
  if (transitioning) {
    return;
  }

  // Verificar si se presionó en las áreas de las opciones
  let optionBoxHeight = height * 0.1; // Ajustar altura de las opciones
  if (mouseY > height / 2 + 20 && mouseY < height / 2 + 20 + optionBoxHeight) {
    nextNode = story[currentNode].nextNode1;
    transitioning = true;
  } else if (mouseY > height / 2 + 100 && mouseY < height / 2 + 100 + optionBoxHeight) {
    nextNode = story[currentNode].nextNode2;
    transitioning = true;
  }

  // Si el nodo actual es -1 (Salir), detener el loop
  if (currentNode === -1) {
    noLoop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
