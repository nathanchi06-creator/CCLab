let sep = 30;
let t = 0;

let cx, cy;       // creature center
let energy = 0;   // boosts when you click

function setup() {
  let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
  cx = width / 2;
  cy = height / 2;
}

function draw() {
  background(0);
  t += 0.02;

  // creature slowly follows mouse (simple easing, no vectors)
  cx += (mouseX - cx) * 0.05;
  cy += (mouseY - cy) * 0.05;

  // decay energy after feeding
  energy *= 0.92;

  // "breathing" pulse
  let breathe = 1 + 0.12 * sin(t * 2);

  // if space is held, creature "scared" -> contracts + jitters
  let scared = keyIsDown(32); // SPACE
  let shrink = scared ? 0.78 : 1.0;

  // slight jitter when scared
  let jitterX = scared ? random(-2, 2) : 0;
  let jitterY = scared ? random(-2, 2) : 0;

  // draw creature body made of rings
  for (let angle = 0; angle < TWO_PI; angle += PI / 10) {
    for (let r = sep; r < width; r += sep) {
      // wobble the radius a bit so it feels organic
      let wobble = map(noise(angle * 1.2, r * 0.03, t), 0, 1, -10, 10);

      let rr = (r + wobble) * breathe * shrink;

      let x = (cx + jitterX) + rr * cos(angle);
      let y = (cy + jitterY) + rr * sin(angle);

      // distance to mouse controls reaction
      let d = dist(mouseX, mouseY, x, y);

      // size: closer mouse = bigger rings; energy makes it bigger too
      let s = map(d, 0, width, 180, 8);
      s += energy * 120;
      s = constrain(s, 4, 260);

      // "shell pattern" using noise; changes over time
      let n = noise(angle * 0.8, r * 0.05, t);

      noFill();

      // make closer rings brighter (feels interactive)
      let bright = map(d, 0, width, 255, 60);
      stroke(bright);

      // only draw some rings to look like spots/scales
      if (n > 0.45) {
        circle(x, y, s);
      }
    }
  }

  // simple eyes so it reads as a creature
  drawEyes();
}

function drawEyes() {
  // eyes offset toward the mouse (so it "looks" at you)
  let lookX = map(mouseX - cx, -width, width, -12, 12);
  let lookY = map(mouseY - cy, -height, height, -12, 12);

  let blink = map(noise(t * 2.5), 0, 1, 2, 12);

  noStroke();
  fill(255);

  // whites
  ellipse(cx - 18, cy - 10, 18, blink);
  ellipse(cx + 18, cy - 10, 18, blink);

  // pupils
  fill(0);
  ellipse(cx - 18 + lookX * 0.3, cy - 10 + lookY * 0.3, 6, 6);
  ellipse(cx + 18 + lookX * 0.3, cy - 10 + lookY * 0.3, 6, 6);
}

function mousePressed() {
  // feed it
  energy = min(1, energy + 0.6);
}