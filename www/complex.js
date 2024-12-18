let mainVector;
let vectorBox, conjugateBox, inverseBox;
let slider, sliderText, selectOp;
let centerX, centerY; 
const gridSize = 50;
let radius = 150; 
let container;
let canvas;

function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('sketch-container'); 

  container = select('#sketch-container')
  centerX = width / 2;
  centerY = height / 2;

  mainVector = Vector.fromPolar(radius / gridSize, PI/4);

  ({ slider: slider, sliderText: sliderText } = newSlider("Circle radius", 15, 60, 50, 150, radius, radius/gridSize));
  vectorBox = newCheckBox(" Main vector", true, 15, 110);
  conjugateBox = newCheckBox(" Complex conjugate", false, 15, 140);
  inverseBox = newCheckBox(" Multiplicative inverse", false, 15, 170);
  selectOp = newSelect("Operation", 15, 200, ["", "Sum", "Multiplication", "Roots"])
}

function draw() {
  background(255);

  radius = slider.value();
  sliderText.html(`Circle radius: ${radius/gridSize} units`);

  drawGrid();

  stroke(200);
  strokeWeight(1);
  noFill();
  ellipse(centerX, centerY, radius * 2);

  mainVector = Vector.fromPolar(radius / gridSize, mainVector.angle());
  
  if (vectorBox.checked()) {
    drawVector(mainVector, 4, mainVector.angle(), 'blue');
  }
  
  if (conjugateBox.checked()) {
    vectorBox.checked(true);
    const conjugateVector = mainVector.conjugate();
    drawVector(conjugateVector, 3, conjugateVector.angle(), 'rgb(16,180,16)');
  }
  
  if (inverseBox.checked()) {
    vectorBox.checked(true);
    const inverseVector = mainVector.inverse();
    drawVector(inverseVector, 5, inverseVector.angle(), 'rgb(161, 165, 106)');
  }

  if(selectOp.selected() !== "") {
    const vector2 = Vector.fromPolar(1, radians(120));
    drawVector(vector2, 4, vector2.angle(), 'gray');
    
    switch (selectOp.selected()) {
      case "Sum":
        const sumVector = mainVector.add(vector2);
        drawVector(sumVector, 3, sumVector.angle(), 'red');
        break;
      
      case "Multiplication":
        const multVector = mainVector.multiply(vector2);
        drawVector(multVector, 3, multVector.angle(), 'red');
        break;
        
      default:
        break;
    }
  }

  noStroke();
  fill(0);
  textSize(16);
  text(`Angle: ${(mainVector.angle() * 180 / PI).toFixed(2)}°`, 15, 385);
}

function drawGrid() {
  stroke(225);
  strokeWeight(1);

  for (let x = 0; x <= width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += gridSize) {
    line(0, y, width, y);
  }

  // Ejes principales
  stroke(0);
  strokeWeight(1);
  line(centerX, 0, centerX, height); // Eje Y
  line(0, centerY, width, centerY); // Eje X

  // Etiquetas en los ejes
  fill(0);
  noStroke();
  textSize(12);
  for (let x = 0; x <= width; x += gridSize) {
    const labelX = (x - width / 2) / gridSize;
    if (labelX !== 0) {
      text(labelX, x + 2, height / 2 - 5);
    }
  }
  for (let y = 0; y <= height; y += gridSize) {
    const labelY = (height / 2 - y) / gridSize;
    if (labelY !== 0) {
      text(`${labelY}i`, width / 2 + 8, y - 2);
    }
  }
}

function mouseDragged() {
  if (isMouseInsideCanvas()) {
    let dx = mouseX - centerX;
    let dy = centerY - mouseY; 

    mainVector = Vector.fromPolar(1, atan2(dy, dx));
    exportToShiny();
  }
}

function exportToShiny() {

  const normalizedVector = Vector.fromPolar(1, mainVector.angle());
  const scaledX = normalizedVector.x * (radius / gridSize);
  const scaledY = normalizedVector.y * (radius / gridSize);

  Shiny.setInputValue('vector_coords', { 
    real: scaledX, 
    imaginary: scaledY 
  });
}

function isMouseInsideCanvas() {
  if (!container) return false;

  const rect = container.elt.getBoundingClientRect();
  return (
    mouseX >= 0 && mouseX <= rect.width &&
    mouseY >= 0 && mouseY <= rect.height
  );
}

function newCheckBox(label, set, x, y) {
  let check = createCheckbox(label, set);
  check.parent('sketch-settings');
  check.position(x, y);

  return check;
}

function newSlider(title, x, y, min, max, set, value) {
  let slider = createSlider(min, max, set); 
  slider.parent('sketch-settings');
  slider.style('width', '150px');
  slider.position(x, y + 25);    
  
  let sliderText = createP(`${title}: ${value} units`); 
  sliderText.parent('sketch-settings');
  sliderText.position(x, y);

  return { slider, sliderText };
}

function newSelect(title, x, y, opts) {
  let select = createSelect();
  select.parent('sketch-settings');
  select.position(x + 75, y);
  opts.map(opt => {select.option(opt)});

  let selectText = createP(`${title}:`); 
  selectText.parent('sketch-settings');
  selectText.position(x, y);

  return select;
}

function drawVector(vector, r, angle, color) {
  const x = centerX + vector.x * gridSize;
  const y = centerY - vector.y * gridSize;

  stroke(color);
  strokeWeight(2);
  line(centerX, centerY, x, y);
  fill(color);

  const size = 8;
  const angleOffset = PI / 6;

  const x1 = x - size * cos(angle - angleOffset);
  const y1 = y + size * sin(angle - angleOffset);
  const x2 = x - size * cos(angle + angleOffset);
  const y2 = y + size * sin(angle + angleOffset);

  triangle(x, y, x1, y1, x2, y2);
  noFill();
  arc(centerX, centerY, radius/r, radius/r, TAU - angle, TAU);
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static fromPolar(r, angle) {
    return new Vector(r * cos(angle), r * sin(angle));
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  multiply(v) {
    return Vector.fromPolar(
      this.modulus() * v.modulus(),
      this.angle() + v.angle()
    )
  }

  conjugate() {
    return new Vector(this.x, -this.y);
  }

  inverse() {
    return Vector.fromPolar(1/this.modulus(), this.angle());
  }

  angle() {
    let angle = atan2(this.y, this.x);
    angle = (angle < 0) ? 2 * PI + angle : angle;
    return angle;
  }

  modulus() {
    return sqrt(this.x * this.x + this.y * this.y);
  }
}