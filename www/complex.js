let vectorBox, conjugateBox, inverseBox;
let slider, sliderText, powerSlider, powerText, selectOp;
let mainVector, centerX, centerY; 
let gridSize = 50;
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
  setTimeout(exportToShiny, 100); 

  ({ slider: slider, sliderText: sliderText } = newSlider("Circle radius", 15, 60, 50, 150, radius, 3));
  vectorBox = newCheckBox(" Main vector", true, 15, 110);
  conjugateBox = newCheckBox(" Complex conjugate", false, 15, 140);
  inverseBox = newCheckBox(" Multiplicative inverse", false, 15, 170);
  selectOp = newSelect("Operation", 15, 200, ["", "Sum", "Multiplication", "Division", "Power"]);
  ({ slider: powerSlider, sliderText: powerText } = newSlider("Root number", 15, 230, 3, 10, 5, 5));
  powerSlider.hide(); powerText.hide();
}

function draw() {
  background(255);

  slider.changed(exportToShiny);
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
    switch (selectOp.selected()) {  
      case "Sum":
        powerSlider.hide(); powerText.hide();
        const sumVector = mainVector.add(vector2);
        drawVector(sumVector, 3, sumVector.angle(), 'red');
        drawVector(vector2, 4, vector2.angle(), 'gray');
        vectorBox.checked(true);
        gridSize = 50;
        break;
      
      case "Multiplication":
        powerSlider.hide(); powerText.hide();
        const multVector = mainVector.multiply(vector2);
        drawVector(multVector, 3, multVector.angle(), 'red');
        drawVector(vector2, 4, vector2.angle(), 'gray');
        vectorBox.checked(true);
        gridSize = 50;
        break;

      case "Division":
        powerSlider.hide(); powerText.hide();
        const divVector = mainVector.division(vector2);
        drawVector(divVector, 3, divVector.angle(), 'red');
        drawVector(vector2, 4, vector2.angle(), 'gray');
        vectorBox.checked(true);
        gridSize = 50;
        break;

      case "Power":
        powerSlider.show(); powerText.show();
        powerSlider.changed(exportToShiny);;
        const n = powerSlider.value(); 
        powerText.html(`Root numbers: ${n}`);
        const roots = mainVector.power(n);
        strokeWeight(2);
        stroke(0);

        beginShape();
        roots.forEach(vec => {
          const x = centerX + vec.x * gridSize;
          const y = centerY - vec.y * gridSize;
          vertex(x, y)
        });
        endShape(CLOSE);
        
        gridSize = 150;
    } 
  } 

  noStroke();
  fill(0);
  textSize(16);
  if(selectOp.selected() !== 'Roots'){
    text(`Angle: ${(mainVector.angle() * 180 / PI).toFixed(2)}°`, 15, 385);
  }
}

function drawGrid() {
  stroke(225);
  strokeWeight(1);

  const start = gridSize == 50 ? 0 : centerX - 150 - 30;
  const step = gridSize == 50 ? gridSize : 30;

  for (let x = start; x <= width; x += step) {
    line(x, 0, x, height);
  }
  for (let y = start; y <= height; y += step) {
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
  
  const stepLabel = gridSize == 50 ? gridSize : 150;
  const startLabel = gridSize == 50 ? 0 : centerX - 150

  for (let x = startLabel; x <= width; x += stepLabel) {
    const labelX = (x - width / 2) / gridSize;
    if (labelX !== 0) {
      text(labelX, x + 2, height / 2 - 5);
    }
  }
  for (let y = startLabel; y <= height; y += stepLabel) {
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
    imaginary: scaledY,
    roots: powerSlider.value()
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
  
  let sliderText = createP(`${title}: ${value}`); 
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

  division(v) {
    const angle = this.angle() - v.angle();
    return Vector.fromPolar(
      this.modulus()/ v.modulus(),
      angle >= 0 ? angle : TAU + angle
    )
  }

  power(n) {
    const angles = Array.from({ length: n }, (_, k) => (this.angle() + TAU * k) / n);
    return angles.map(theta => Vector.fromPolar(1, theta));
  }

  conjugate() {
    return new Vector(this.x, -this.y);
  }

  inverse() {
    return Vector.fromPolar(1/this.modulus(), -this.angle());
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