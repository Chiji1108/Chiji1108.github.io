let backgroundColor;
let playingKeyList = {};
let fft;
let toneType;

let state = 0;
let recording = false;
let recorder;
let soundFile;

let attackLevel = 1.0;
let releaseLevel = 0;
let attackTime = 0.001;
let decayTime = 0.2;
let susPercent = 0.2;
let releaseTime = 0.5;

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  cnv.mouseClicked(toggleToneType);

  backgroundColor = color(0,0,0);
  toneType = 'sine'

  fft = new p5.FFT();
  setKeys();
}

function setKeyList(key, freq) {
  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);
  note = new p5.Oscillator();
  note.setType(toneType);
  note.freq(freq);
  note.amp(env);
  note.start();
  playingKeyList[key] = [note, env];
}

function setKeys() {
  setKeyList('z', 261.6256);
  setKeyList('s', 277.1826);
  setKeyList('x', 293.6648);
  setKeyList('d', 311.1270);
  setKeyList('c', 329.6276);
  setKeyList('v', 349.2282);
  setKeyList('g', 369.9944);
  setKeyList('b', 391.9954);
  setKeyList('h', 415.3047);
  setKeyList('n', 440);
  setKeyList('j', 466.1638);
  setKeyList('m', 493.8833);
  setKeyList(',', 523.2511);
  setKeyList('q', 523.2511);
  setKeyList('l', 554.3653);
  setKeyList('2', 554.3653);
  setKeyList('.', 587.3295);
  setKeyList('w', 587.3295);
  setKeyList(';', 622.2540);
  setKeyList('3', 622.2540);
  setKeyList('/', 659.2551);
  setKeyList('e', 659.2551);
  setKeyList('r', 698.4565);
  setKeyList('5', 739.9888);
  setKeyList('t', 783.9909);
  setKeyList('6', 830.6094);
  setKeyList('y', 880.0000);
  setKeyList('7', 932.3275);
  setKeyList('u', 987.7666);
  setKeyList('i', 1046.502);
  setKeyList('g', 1108.731);
  setKeyList('o', 1174.659);
  setKeyList('0', 1244.508);
  setKeyList('p', 1318.510);
  setKeyList('[', 1396.913);
  setKeyList('=', 1479.978);
  setKeyList(']', 1567.982);
}

function draw() {
  background(backgroundColor);

  push();
  if (recording) {
    fill(255,0,0);
  }else{
    fill(255,255,255);
  }
  textAlign(CENTER);
  textSize(32);
  if (state == 0) {
    text('CLICK TO START', width/2, height/5);
  }else{
    text('SPECE MEANS RECODING', width/2, height/5);
  }
  pop();

  push();
  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255,255,255); // waveform is red
  strokeWeight(5);
  for (var i = 0; i< waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function toggleToneType() {
  if(toneType == 'sine') {
    toneType = 'triangle';
  }else if(toneType == 'triangle') {
    toneType = 'sawtooth';
  }else if(toneType == 'sawtooth') {
    toneType = 'square';
  }else if(toneType == 'square') {
    toneType = 'sine';
  }
  setKeys();
  state++;
}

function keyPressed() {
  if(key === ' ') {
    if(recording) {
      recording = false;
      recorder.stop();
      soundFile.play();
      save(soundFile, 'mySound.wav');
    }else{
      recording = true;
      recorder = new p5.SoundRecorder();
      soundFile = new p5.SoundFile();
      recorder.record(soundFile);
    }
  }
  if(playingKeyList[key]) {
    note = playingKeyList[key];
    note[1].triggerAttack();
    // playingKeyList[key] = [note[0], note[1]];
  }
}

function keyReleased() {
  if(playingKeyList[key]) {
    note = playingKeyList[key];
    note[1].triggerRelease();

  }
}