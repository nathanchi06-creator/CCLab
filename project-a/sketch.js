let creature;
let particles = [];
let stars = [];
let dreams = [];

function setup() {
  createCanvas(800, 800);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");

  creature = new Creature(width/2, height/2);

  // star background
  for(let i=0;i<120;i++){
    stars.push(new Star());
  }

  // floating dream particles
  for(let i=0;i<40;i++){
    dreams.push(new Dream());
  }
}

function draw() {
  background(8,10,25);

  drawStars();
  drawDreamcatcher();

  for(let d of dreams){
    d.move();
    d.display();
  }

  creature.move();
  creature.display();

  for (let i = particles.length-1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    if (particles[i].life < 0) {
      particles.splice(i,1);
    }
  }
}

function mousePressed(){
  if(creature.clicked(mouseX, mouseY)){
    creature.react();
  }
}

////////////////////////////////////////////
// STARFIELD
////////////////////////////////////////////

class Star{

  constructor(){
    this.x = random(width);
    this.y = random(height);
    this.size = random(1,3);
    this.speed = random(0.1,0.5);
  }

  move(){
    this.y += this.speed;

    if(this.y > height){
      this.y = 0;
      this.x = random(width);
    }
  }

  display(){
    noStroke();
    fill(255);
    circle(this.x,this.y,this.size);
  }
}

function drawStars(){

  for(let s of stars){
    s.move();
    s.display();
  }

}

////////////////////////////////////////////
// DREAMCATCHER WEB
////////////////////////////////////////////

function drawDreamcatcher(){

  push();
  translate(width/2,height/2);

  stroke(180,180,255,120);
  strokeWeight(2);
  noFill();

  let rings = 5;
  let radius = 220;

  for(let r=0;r<rings;r++){
    circle(0,0,radius - r*30);
  }

  // web lines
  let spokes = 12;

  for(let i=0;i<spokes;i++){

    let angle = map(i,0,spokes,0,TWO_PI);

    let x = cos(angle)*radius;
    let y = sin(angle)*radius;

    line(0,0,x,y);
  }

  drawFeathers(radius);

  pop();
}

////////////////////////////////////////////
// FEATHERS
////////////////////////////////////////////

function drawFeathers(radius){

  for(let i=0;i<5;i++){

    let angle = map(i,0,5,PI*0.6,PI*1.4);

    let x = cos(angle)*radius;
    let y = sin(angle)*radius;

    stroke(200,200,255,120);
    line(x,y,x,y+70);

    noStroke();
    fill(180,180,255,150);

    ellipse(x,y+85,10,30);
  }

}

////////////////////////////////////////////
// DREAM PARTICLES
////////////////////////////////////////////

class Dream{

  constructor(){

    this.x = random(width);
    this.y = random(height);

    this.size = random(3,7);

    this.seed = random(1000);
  }

  move(){

    this.x += map(noise(frameCount*0.01 + this.seed),0,1,-0.6,0.6);
    this.y += map(noise(frameCount*0.01 + this.seed + 50),0,1,-0.6,0.6);

  }

  display(){

    noStroke();
    fill(180,150,255,120);

    circle(this.x,this.y,this.size);
  }

}

////////////////////////////////////////////
// CREATURE
////////////////////////////////////////////

class Creature {

  constructor(x,y){

    this.x = x;
    this.y = y;

    this.size = random(80,100);
    this.seed = random(1000);

    this.color = color(200,150,255);
  }

  move(){

    this.x += map(noise(frameCount*0.01 + this.seed),0,1,-1,1);
    this.y += map(noise(frameCount*0.01 + this.seed + 100),0,1,-1,1);

    this.pulse = sin(frameCount*0.05) * 6;
  }

  display(){

    push();
    translate(this.x,this.y);

    let body = this.size + this.pulse;

    noStroke();
    fill(this.color);

    ellipse(0,0,body,body*0.8);

    // tentacles

    for(let i=0;i<10;i++){

      let angle = map(i,0,10,0,TWO_PI);

      let wiggle = sin(frameCount*0.1 + i)*15;

      let tx = cos(angle)*(body/2);
      let ty = sin(angle)*(body/2);

      stroke(this.color);
      strokeWeight(3);

      line(tx,ty,tx+wiggle,ty+30+wiggle);
    }

    // eye
    noStroke();
    fill(255);
    ellipse(0,-5,25,25);

    fill(0);
    ellipse(0,-5,10,10);

    pop();
  }

  clicked(mx,my){

    let d = dist(mx,my,this.x,this.y);

    return d < this.size/2;
  }

  react(){

    this.color = color(random(180,255), random(120,200), random(220,255));

    for(let i=0;i<25;i++){
      particles.push(new Particle(this.x,this.y));
    }
  }

}

class Particle{

  constructor(x,y){

    this.x = x;
    this.y = y;

    this.vx = random(-3,3);
    this.vy = random(-3,3);

    this.life = 120;
  }

  update(){

    this.x += this.vx;
    this.y += this.vy;

    this.life -= 3;
  }

  display(){

    noStroke();
    fill(255, this.life*2);

    circle(this.x,this.y,4);
  }

}