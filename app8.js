let whiteKeys = [];
let blackKeys = [];
let whiteKeyWidth;
let blackKeyWidth;
let keyHeight;
let notes = [];
let blackNotes = [];
let whiteKeySounds = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];
let blackKeySounds = ['LOOP1', 'LOOP2', '', 'LOOP3', 'LOOP4', 'LOOP5'];
let whiteKeyMap = ['A', 'S', 'D', 'F', 'G', 'H', 'J'];
let blackKeyMap = ['W', 'E', '', 'T', 'Y', 'U'];
let volumeSlider;
let isRecording = false;
let recordedNotes = [];
let recordButton, playButton;
let activeNotes = []; // Array para las notas activas

function preload() {
  for (let i = 0; i < whiteKeySounds.length; i++) {
    notes.push(loadSound('rec/sonidos/notes/' + whiteKeySounds[i] + '.mp3'));
  }
  for (let i = 0; i < blackKeySounds.length; i++) {
    if (blackKeySounds[i] !== '') {
      blackNotes.push(loadSound('rec/sonidos/notes/' + blackKeySounds[i] + '.mp3'));
    } else {
      blackNotes.push(null);
    }
  }
}

function setup() {
  createCanvas(1500, 769);  // Set the canvas size to 1500x769
  whiteKeyWidth = width / 7;
  blackKeyWidth = whiteKeyWidth * 0.6;
  keyHeight = height * 0.8;  // Adjust the key height based on the new canvas height

  // Crear teclas blancas
  for (let i = 0; i < 7; i++) {
    whiteKeys.push(new WhiteKey(i * whiteKeyWidth, 0, whiteKeyWidth, keyHeight, notes[i], whiteKeyMap[i]));
  }
  
  // Crear teclas negras
  for (let i = 0; i < 6; i++) {
    if (i !== 2) {
      blackKeys.push(new BlackKey((i + 1) * whiteKeyWidth - blackKeyWidth / 2, 0, blackKeyWidth, keyHeight * 0.6, blackNotes[i], blackKeyMap[i]));
    }
  }
  
  // Crear control de volumen
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(10, height - 50);
  volumeSlider.style('width', '180px');
  
  // Botón de grabar
  recordButton = createButton('Grabar');
  recordButton.position(10, height - 100);
  recordButton.mousePressed(toggleRecording);
  
  // Botón de reproducir
  playButton = createButton('Reproducir');
  playButton.position(100, height - 100);
  playButton.mousePressed(playRecording);
}


function draw() {
  background(220);
  
  // Dibujar teclas blancas
  for (let key of whiteKeys) {
    key.display();
  }
  
  // Dibujar teclas negras
  for (let key of blackKeys) {
    key.display();
  }
  
  // Ajustar volumen global
  let volume = volumeSlider.value();
  for (let sound of notes) {
    sound.setVolume(volume);
  }
  for (let sound of blackNotes) {
    if (sound !== null) {
      sound.setVolume(volume);
    }
  }
  
  // Mostrar estado de grabación fuera del piano
  if (isRecording) {
    fill(255, 0, 0);
    textSize(20);
    textAlign(LEFT);
    text('Grabando...', 20, height - 60);  // Mover el texto fuera del área del piano
  }

  // Visualización de notas activas
  drawActiveNotes();
}

// Manejo del ratón
function mousePressed() {
  let clickedOnBlackKey = false;
  for (let key of blackKeys) {
    if (key.isHovered()) {
      key.playSound();
      activeNotes.push(key.keyLabel); // Agregar nota activa
      if (isRecording) recordNote(key.keyLabel);
      clickedOnBlackKey = true;
      break;
    }
  }
  if (!clickedOnBlackKey) {
    for (let key of whiteKeys) {
      if (key.isHovered()) {
        key.playSound();
        activeNotes.push(key.keyLabel); // Agregar nota activa
        if (isRecording) recordNote(key.keyLabel);
        break;
      }
    }
  }
}

// Manejo del teclado
function keyPressed() {
  let keyIndex = whiteKeyMap.indexOf(key.toUpperCase());
  if (keyIndex !== -1) {
    whiteKeys[keyIndex].playSound();
    activeNotes.push(whiteKeys[keyIndex].keyLabel); // Agregar nota activa
    if (isRecording) recordNote(whiteKeys[keyIndex].keyLabel);
  }

  let blackKeyIndex = blackKeyMap.indexOf(key.toUpperCase());
  if (blackKeyIndex !== -1) {
    blackKeys[blackKeyIndex].playSound();
    activeNotes.push(blackKeys[blackKeyIndex].keyLabel); // Agregar nota activa
    if (isRecording) recordNote(blackKeys[blackKeyIndex].keyLabel);
  }
}

// Clase para teclas blancas
class WhiteKey {
  constructor(x, y, w, h, sound, keyLabel) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sound = sound;
    this.keyLabel = keyLabel;
  }

  display() {
    fill(255);
    stroke(0);
    rect(this.x, this.y, this.w, this.h);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(this.keyLabel, this.x + this.w / 2, this.y + this.h - 40);
  }

  isHovered() {
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.h;
  }

  playSound() {
    if (this.sound.isPlaying()) {
      this.sound.stop();
    }
    this.sound.play();
  }
}

// Clase para teclas negras
class BlackKey {
  constructor(x, y, w, h, sound, keyLabel) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sound = sound;
    this.keyLabel = keyLabel;
  }

  display() {
    fill(0);
    stroke(0);
    rect(this.x, this.y, this.w, this.h);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.keyLabel, this.x + this.w / 2, this.y + this.h - 20);
  }

  isHovered() {
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.h;
  }

  playSound() {
    if (this.sound && this.sound.isPlaying()) {
      this.sound.stop();
    }
    if (this.sound) {
      this.sound.play();
    }
  }
}

// Función para dibujar notas activas en el piano roll
function drawActiveNotes() {
  fill(50, 150, 50);
  noStroke();
  
  // Asegurarse de que la visualización sea clara
  for (let i = 0; i < activeNotes.length; i++) {
    let note = activeNotes[i];
    let keyIndex = whiteKeySounds.indexOf(note);
    let blackKeyIndex = blackKeySounds.indexOf(note);

    if (keyIndex !== -1) {
      // Nota blanca
      rect(keyIndex * whiteKeyWidth, height * 0.9, whiteKeyWidth, 10); // Dibuja un rectángulo por cada nota blanca tocada
    } else if (blackKeyIndex !== -1) {
      // Nota negra
      let x = (blackKeyIndex + 1) * whiteKeyWidth - blackKeyWidth / 2; // Ajusta la posición
      rect(x, height * 0.9, blackKeyWidth, 10); // Dibuja un rectángulo por cada nota negra tocada
    }
  }
}

// Grabación de notas
function recordNote(note) {
  if (isRecording) {
    let time = millis();
    recordedNotes.push({ key: note, time: time });
  }
}

// Alternar grabación
function toggleRecording() {
  isRecording = !isRecording;
  if (isRecording) {
    recordedNotes = []; // Limpiar grabaciones al comenzar nueva grabación
    activeNotes = []; // Limpiar notas activas
  }
}

// Reproducir grabación
function playRecording() {
  let startTime = millis();
  for (let note of recordedNotes) {
    let delay = note.time - startTime;
    setTimeout(() => {
      if (whiteKeySounds.includes(note.key)) {
        let index = whiteKeySounds.indexOf(note.key);
        whiteKeys[index].playSound();
      } else if (blackKeySounds.includes(note.key)) {
        let index = blackKeySounds.indexOf(note.key);
        blackKeys[index].playSound();
      }
    }, delay);
  }
}
