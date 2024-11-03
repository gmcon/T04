let mic, fft, soundFile;
let audioSource = 'mic'; // 'mic', 'file', 'both'
let isPlaying = false;
let fileInput;
let playButton, pauseButton, stopButton;
let visualizationType = 'bars'; // 'bars', 'waveform', 'circles'
let visualizationSelect;
let startSlider, endSlider;
let startTime = 0;
let endTime = 0;
let duration = 0;

// Colores personalizados
let bgColor = '#000000'; // Color de fondo
let vizColor = '#00ffff'; // Color de visualización
let bassColor = '#ff0000'; // Color de los graves
let midColor = '#00ff00'; // Color de los medios
let trebleColor = '#0000ff'; // Color de los agudos

// Para controlar efectos visuales basados en bandas de frecuencia
let bassEffect = 1;
let midEffect = 1;
let trebleEffect = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Controles de selección de fuente de audio
  let micButton = createButton('Usar Micrófono');
  micButton.position(10, 10);
  micButton.mousePressed(() => selectAudioSource('mic'));

  let fileButton = createButton('Cargar Archivo de Audio');
  fileButton.position(150, 10);
  fileButton.mousePressed(() => selectAudioSource('file'));

  let bothButton = createButton('Combinación de Ambos');
  bothButton.position(320, 10);
  bothButton.mousePressed(() => selectAudioSource('both'));

  // Input para cargar archivo de audio
  fileInput = createFileInput(handleFile);
  fileInput.position(500, 10);
  fileInput.hide();

  // Controles de reproducción
  playButton = createButton('Reproducir');
  playButton.position(10, 50);
  playButton.mousePressed(playAudio);
  playButton.hide();

  pauseButton = createButton('Pausar');
  pauseButton.position(100, 50);
  pauseButton.mousePressed(pauseAudio);
  pauseButton.hide();

  stopButton = createButton('Detener');
  stopButton.position(190, 50);
  stopButton.mousePressed(stopAudio);
  stopButton.hide();

  // Selector de tipo de visualización
  visualizationSelect = createSelect();
  visualizationSelect.position(10, 90);
  visualizationSelect.option('Barras', 'bars');
  visualizationSelect.option('Forma de Onda', 'waveform');
  visualizationSelect.option('Círculos', 'circles');
  visualizationSelect.changed(() => {
    visualizationType = visualizationSelect.value();
  });
  visualizationSelect.hide();

  // Sliders para recorte del audio
  startSlider = createSlider(0, 0, 0, 0.01);
  startSlider.position(10, 130);
  startSlider.style('width', '200px');
  startSlider.input(updateStartTime);
  startSlider.hide();

  endSlider = createSlider(0, 0, 0, 0.01);
  endSlider.position(220, 130);
  endSlider.style('width', '200px');
  endSlider.input(updateEndTime);
  endSlider.hide();

  // Personalización de colores
  createP('Color de Fondo').position(10, 180);
  let bgColorPicker = createColorPicker(bgColor);
  bgColorPicker.position(150, 180);
  bgColorPicker.input(() => bgColor = bgColorPicker.value());

  createP('Color de Visualización').position(10, 220);
  let vizColorPicker = createColorPicker(vizColor);
  vizColorPicker.position(150, 220);
  vizColorPicker.input(() => vizColor = vizColorPicker.value());

  createP('Color de Graves').position(10, 260);
  let bassColorPicker = createColorPicker(bassColor);
  bassColorPicker.position(150, 260);
  bassColorPicker.input(() => bassColor = bassColorPicker.value());

  createP('Color de Medios').position(10, 300);
  let midColorPicker = createColorPicker(midColor);
  midColorPicker.position(150, 300);
  midColorPicker.input(() => midColor = midColorPicker.value());

  createP('Color de Agudos').position(10, 340);
  let trebleColorPicker = createColorPicker(trebleColor);
  trebleColorPicker.position(150, 340);
  trebleColorPicker.input(() => trebleColor = trebleColorPicker.value());

  // FFT para análisis de frecuencias
  fft = new p5.FFT();

  // Registrar el Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
      });
    });
  }
}

function draw() {
  background(bgColor);

  if (isPlaying) {
    let spectrum = fft.analyze();
    let bass = fft.getEnergy(20, 200); // Graves
    let mid = fft.getEnergy(200, 2000); // Medios
    let treble = fft.getEnergy(2000, 20000); // Agudos

    // Dibujar la visualización basada en el tipo seleccionado
    if (visualizationType === 'bars') {
      drawBars(spectrum, bass, mid, treble);
    } else if (visualizationType === 'waveform') {
      drawWaveform();
    } else if (visualizationType === 'circles') {
      drawCircles(spectrum, bass, mid, treble);
    }

    // Actualizar efectos visuales según la energía de cada banda de frecuencia
    bassEffect = map(bass, 0, 255, 1, 2); // Escala de graves
    midEffect = map(mid, 0, 255, 1, 1.5); // Escala de medios
    trebleEffect = map(treble, 0, 255, 1, 1.2); // Escala de agudos
  }
}

function drawBars(spectrum, bass, mid, treble) {
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);

    // Color personalizado y efectos según bandas de frecuencia
    if (i < spectrum.length / 3) {
      fill(bassColor);
      rect(x, height, width / spectrum.length, h * bassEffect);
    } else if (i < 2 * spectrum.length / 3) {
      fill(midColor);
      rect(x, height, width / spectrum.length, h * midEffect);
    } else {
      fill(trebleColor);
      rect(x, height, width / spectrum.length, h * trebleEffect);
    }
  }
}

function drawWaveform() {
  let waveform = fft.waveform();
  noFill();
  stroke(vizColor);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
}

function drawCircles(spectrum, bass, mid, treble) {
  translate(width / 2, height / 2);
  for (let i = 0; i < spectrum.length; i++) {
    let amp = spectrum[i];
    let r = map(amp, 0, 256, 10, 200);

    // Sincronización con bandas de frecuencia y colores
    let angle = map(i, 0, spectrum.length, 0, TWO_PI);
    let x = r * cos(angle) * bassEffect;
    let y = r * sin(angle) * midEffect;

    fill(i < spectrum.length / 3 ? bassColor : i < 2 * spectrum.length / 3 ? midColor : trebleColor);
    ellipse(x, y, 5 * trebleEffect, 5 * trebleEffect);
  }
}

// Funciones para la selección de audio, control de reproducción y edición de audio
function selectAudioSource(source) {
  audioSource = source;
  if (source === 'mic') {
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);
  } else if (source === 'file') {
    fileInput.show();
  } else if (source === 'both') {
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);
    fileInput.show();
  }
  playButton.show();
  pauseButton.show();
  stopButton.show();
  visualizationSelect.show();
  startSlider.show();
  endSlider.show();
}

function handleFile(file) {
  if (file.type === 'audio') {
    soundFile = loadSound(file.data, () => {
      soundFile.disconnect();
      soundFile.connect(fft);
      duration = soundFile.duration();
      endSlider.elt.max = duration;
      endSlider.value(duration);
      endTime = duration;
      startSlider.value(0);
      startTime = 0;
    });
  } else {
    soundFile = null;
  }
}

function playAudio() {
  if (audioSource === 'file' && soundFile) {
    soundFile.play();
    isPlaying = true;
    fft.setInput(soundFile);
  } else if (audioSource === 'mic') {
    isPlaying = true;
  }
}

function pauseAudio() {
  if (soundFile) {
    soundFile.pause();
    isPlaying = false;
  }
}

function stopAudio() {
  if (soundFile) {
    soundFile.stop();
    isPlaying = false;
  }
}

// Funciones para actualizar tiempo de recorte
function updateStartTime() {
  startTime = startSlider.value();
}

function updateEndTime() {
  endTime = endSlider.value();
}

// Permitir que la ventana sea responsiva
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
