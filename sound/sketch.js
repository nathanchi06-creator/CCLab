let mySound;

function preload() {
  mySound = loadSound("assets/song.mp3");
}

function setup() {
  createCanvas(400, 400);
  //let canvas = createCanvas(400, 400);
  //canvas.parent("p5-canvas-container");

}

function draw() {
  background(220);
}

function mousePressed() {
  mySound.play();
}
