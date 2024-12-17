let vectorBox, conjugateBox, inverseBox;
let slider, sliderText, selectOp;
let vectorX, vectorY;
let centerX, centerY; 
const gridSize = 50;
let radius = 150; 
let angle = 3.1416/4; 
let container;
let canvas;

function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('sketch-container'); 

  container = select('#sketch-container')
  centerX = width / 2;
  centerY = height / 2;

  ({ slider: slider, sliderText: sliderText }= newSlider("Circle radius", 15, 60, 50, 150, radius, radius/gridSize));
  vectorBox = newCheckBox(" Main vector", true, 15, 110);
  conjugateBox = newCheckBox(" Complex conjugate", false, 15, 140);
  inverseBox = newCheckBox(" Multiplicative inverse", false, 15, 170);
  selectOp = newSelect("Operation", 15, 200, ["", "Sum", "Multiplication", "Roots"])
}

function draw() {
  background(255);
  
  radius = slider.value();
  sliderText.html(`Circle radius: ${radius/gridSize} units`);

  // Grilla
  drawGrid();

  // Círculo unitario
  stroke(0);
  strokeWeight(1);
  noFill();
  ellipse(centerX, centerY, radius * 2);

  // Vector
  vectorX = centerX + radius * cos(angle);
  vectorY = centerY - radius * sin(angle);
  
  vectorBox.checked() ? drawVector(vectorX, vectorY, 4, 4, angle, 'blue') : null;
  
  if (conjugateBox.checked()){
    vectorBox.checked() ? null : vectorBox.checked(true);
    const conjugateY = centerY + (centerY - vectorY);
    drawVector(vectorX, conjugateY, 3, 3, TAU - angle, 'rgb(16,180,16)')
  }
  
  if (inverseBox.checked()){
    vectorBox.checked() ? null : vectorBox.checked(true);
    let inverseX = centerX + gridSize**2/radius * cos(angle);
    let inverseY = centerY - gridSize**2/radius * sin(angle);
    drawVector(inverseX, inverseY, 5, 5, angle, 'rgb(161, 165, 106)');
  }

  noStroke();
  fill(0);
  textSize(16);
  text(`Angle: ${(angle * 180 / PI).toFixed(2)}°`, 15, 25);
}

function drawGrid() {
  const unit = 1;

  // Dibuja la grilla
  stroke(225);
  strokeWeight(1);
  for (let x = 0; x <= width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += gridSize) {
    line(0, y, width, y);
  }

  // Dibuja ejes principales
  stroke(0);
  strokeWeight(1);
  line(centerX, 0, centerX, height); // Eje Y
  line(0, centerY, width, centerY); // Eje X

  // Etiquetas en los ejes
  fill(0);
  noStroke();
  textSize(12);
  for (let x = 0; x <= width; x += gridSize) {
    const labelX = (x - width / 2) / gridSize * unit;
    if (labelX !== 0) {
      text(labelX, x + 2, height / 2 - 5);
    }
  }
  for (let y = 0; y <= height; y += gridSize) {
    const labelY = (height / 2 - y) / gridSize * unit;
    if (labelY !== 0) {
      text(`${labelY}i`, width / 2 + 8, y - 2);
    }
  }
}

function mouseDragged() {
  if (isMouseInsideCanvas()) {
    
    let dx = mouseX - centerX;
    let dy = centerY - mouseY; 
    
    angle = atan2(dy, dx);
    angle = (angle < 0) ? 2 * PI + angle : angle;

    exportToShiny();
  }
}

function exportToShiny() {

  let real = (vectorX - centerX) / gridSize; 
  let imaginary = (centerY - vectorY) / gridSize;

  Shiny.setInputValue('vector_coords', { real: real, imaginary: imaginary });
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

function newSelect(title, x, y, opts){

  let select = createSelect();
  select.parent('sketch-settings');
  select.position(x + 75, y);
  opts.map(opt => {select.option(opt)});

  let selectText = createP(`${title}:`); 
  selectText.parent('sketch-settings');
  selectText.position(x, y);

  return select;
}

function drawVector(x, y, rx, ry, angle, color) {
  stroke(color);
  strokeWeight(2);
  line(centerX, centerY, x, y);
  fill(color);
  circle(x, y, 10);

  noFill();
  arc(centerX, centerY, radius/rx, radius/ry, TAU - angle, TAU);
}