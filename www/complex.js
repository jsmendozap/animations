let vectorBox, conjugateBox;
let slider, sliderText, selectOp;
let vectorX, vectorY;
let centerX, centerY; 
const gridSize = 50;
let radius = 150; 
let angle = 45; 
let container;
let canvas;

function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('sketch-container'); 

  container = select('#sketch-container')
  centerX = width / 2;
  centerY = height / 2;

  ({ slider: slider, sliderText: sliderText }= newSlider("Circle radius", 15, 60, 50, radius, 100, radius/gridSize));
  vectorBox = newCheckBox("<strong> Main vector</strong>", true, 15, 110);
  conjugateBox = newCheckBox("<strong> Conjugate</strong>", false, 15, 140);
  selectOp = newSelect("Operation", 15, 170, ["Sum", "Multiplication", "Roots"])
}

function draw() {
  background(255);
  
  radius = slider.value();
  sliderText.html(`<strong>Circle radius:</strong> ${radius/gridSize} units`);

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
  
  vectorBox.checked() ? drawVector(vectorX, vectorY, 'blue') : null;
  
  if (conjugateBox.checked()){
    vectorBox.checked() ? null : vectorBox.checked(true);
    const conjugateY = centerY + (centerY - vectorY);
    drawVector(vectorX, conjugateY, 'rgb(16,180,16)')
  }
  
  noStroke();
  fill(0);
  textSize(16);
  let arg = (angle < 0) ? 2 * PI + angle : angle;
  text(`Angle: ${(arg * 180 / PI).toFixed(2)}°`, 15, 25);
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
    angle = atan2(dy, dx); // Ángulo en radianes
    
    exportToShiny();
  }
}

function exportToShiny() {

  let real = (vectorX - centerX) / 50; 
  let imaginary = (centerY - vectorY) / 50;

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
  
  let sliderText = createP(`<strong>${title}:</strong> ${value} units`); 
  sliderText.parent('sketch-settings');
  sliderText.position(x, y);

  return { slider, sliderText };
}

function newSelect(title, x, y, opts){

  let select = createSelect();
  select.parent('sketch-settings');
  select.position(x + 75, y);
  opts.map(opt => {select.option(opt)});

  let selectText = createP(`<strong>${title}:</strong>`); 
  selectText.parent('sketch-settings');
  selectText.position(x, y);

  return select;
}

function drawVector(x, y, color) {
  stroke(color);
  strokeWeight(2);
  line(centerX, centerY, x, y);
  fill(color);
  circle(x, y, 10);
}