export default function complexSketch(p5) {
  let vectorBox, conjugateBox, inverseBox;
  let slider, sliderText, powerSlider, powerText, selectOp;
  let mainVector, centerX, centerY;
  let gridSize = 50;
  let radius = 150;
  let container;
  let canvas;

  // ==============================
  // SETUP
  // ==============================
  p5.setup = function () {
    canvas = p5.createCanvas(400, 400);
    canvas.parent("sketch-container");

    container = p5.select("#sketch-container");
    centerX = p5.width / 2;
    centerY = p5.height / 2;

    mainVector = Vector.fromPolar(radius / gridSize, p5.PI / 4);
    setTimeout(exportToShiny, 100);

    ({ slider: slider, sliderText: sliderText } = newSlider(
      "Circle radius",
      15,
      60,
      50,
      150,
      radius,
      3
    ));
    vectorBox = newCheckBox(" Main vector", true, 15, 110);
    conjugateBox = newCheckBox(" Complex conjugate", false, 15, 140);
    inverseBox = newCheckBox(" Multiplicative inverse", false, 15, 170);
    selectOp = newSelect("Operation", 15, 200, [
      "",
      "Sum",
      "Multiplication",
      "Division",
      "Power",
    ]);
    ({ slider: powerSlider, sliderText: powerText } = newSlider(
      "Root number",
      15,
      230,
      3,
      10,
      5,
      5
    ));
    powerSlider.hide();
    powerText.hide();
  };

  // ==============================
  // DRAW
  // ==============================
  p5.draw = function () {
    p5.background(255);

    slider.changed(exportToShiny);
    radius = slider.value();
    sliderText.html(`Circle radius: ${radius / gridSize} units`);

    drawGrid();

    p5.stroke(200);
    p5.strokeWeight(1);
    p5.noFill();
    p5.ellipse(centerX, centerY, radius * 2);

    mainVector = Vector.fromPolar(radius / gridSize, mainVector.angle());

    if (vectorBox.checked()) {
      drawVector(mainVector, 4, mainVector.angle(), "blue");
    }

    if (conjugateBox.checked()) {
      vectorBox.checked(true);
      const conjugateVector = mainVector.conjugate();
      drawVector(conjugateVector, 3, conjugateVector.angle(), "rgb(16,180,16)");
    }

    if (inverseBox.checked()) {
      vectorBox.checked(true);
      const inverseVector = mainVector.inverse();
      drawVector(inverseVector, 5, inverseVector.angle(), "rgb(161, 165, 106)");
    }

    if (selectOp.selected() !== "") {
      const vector2 = Vector.fromPolar(1, p5.radians(120));
      switch (selectOp.selected()) {
        case "Sum":
          powerSlider.hide();
          powerText.hide();
          const sumVector = mainVector.add(vector2);
          drawVector(sumVector, 3, sumVector.angle(), "red");
          drawVector(vector2, 4, vector2.angle(), "gray");
          vectorBox.checked(true);
          gridSize = 50;
          break;

        case "Multiplication":
          powerSlider.hide();
          powerText.hide();
          const multVector = mainVector.multiply(vector2);
          drawVector(multVector, 3, multVector.angle(), "red");
          drawVector(vector2, 4, vector2.angle(), "gray");
          vectorBox.checked(true);
          gridSize = 50;
          break;

        case "Division":
          powerSlider.hide();
          powerText.hide();
          const divVector = mainVector.division(vector2);
          drawVector(divVector, 3, divVector.angle(), "red");
          drawVector(vector2, 4, vector2.angle(), "gray");
          vectorBox.checked(true);
          gridSize = 50;
          break;

        case "Power":
          powerSlider.show();
          powerText.show();
          powerSlider.changed(exportToShiny);
          const n = powerSlider.value();
          powerText.html(`Root numbers: ${n}`);
          const roots = mainVector.power(n);
          p5.strokeWeight(2);
          p5.stroke(0);

          p5.beginShape();
          roots.forEach((vec) => {
            const x = centerX + vec.x * gridSize;
            const y = centerY - vec.y * gridSize;
            p5.vertex(x, y);
          });
          p5.endShape(p5.CLOSE);

          gridSize = 150;
      }
    }

    p5.noStroke();
    p5.fill(0);
    p5.textSize(16);
    if (selectOp.selected() !== "Roots") {
      p5.text(
        `Angle: ${((mainVector.angle() * 180) / p5.PI).toFixed(2)}°`,
        15,
        385
      );
    }
  };

  // ==============================
  // GRID
  // ==============================
  function drawGrid() {
    p5.stroke(225);
    p5.strokeWeight(1);

    const start = gridSize == 50 ? 0 : centerX - 150 - 30;
    const step = gridSize == 50 ? gridSize : 30;

    for (let x = start; x <= p5.width; x += step) {
      p5.line(x, 0, x, p5.height);
    }
    for (let y = start; y <= p5.height; y += step) {
      p5.line(0, y, p5.width, y);
    }

    // Ejes principales
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.line(centerX, 0, centerX, p5.height); // Eje Y
    p5.line(0, centerY, p5.width, centerY); // Eje X

    // Etiquetas en los ejes
    p5.fill(0);
    p5.noStroke();
    p5.textSize(12);

    const stepLabel = gridSize == 50 ? gridSize : 150;
    const startLabel = gridSize == 50 ? 0 : centerX - 150;

    for (let x = startLabel; x <= p5.width; x += stepLabel) {
      const labelX = (x - p5.width / 2) / gridSize;
      if (labelX !== 0) {
        p5.text(labelX, x + 2, p5.height / 2 - 5);
      }
    }
    for (let y = startLabel; y <= p5.height; y += stepLabel) {
      const labelY = (p5.height / 2 - y) / gridSize;
      if (labelY !== 0) {
        p5.text(`${labelY}i`, p5.width / 2 + 8, y - 2);
      }
    }
  }

  // ==============================
  // MOUSE DRAGGED
  // ==============================
  p5.mouseDragged = function () {
    if (isMouseInsideCanvas()) {
      let dx = p5.mouseX - centerX;
      let dy = centerY - p5.mouseY;

      mainVector = Vector.fromPolar(1, p5.atan2(dy, dx));
      exportToShiny();
    }
  };

  // ==============================
  // SHINY EXPORT
  // ==============================
  function exportToShiny() {
    const normalizedVector = Vector.fromPolar(1, mainVector.angle());
    const scaledX = normalizedVector.x * (radius / gridSize);
    const scaledY = normalizedVector.y * (radius / gridSize);

    if (typeof Shiny !== "undefined" && Shiny.setInputValue) {
      Shiny.setInputValue("vector_coords", {
        real: scaledX,
        imaginary: scaledY,
        roots: powerSlider.value(),
      });
    }
  }

  // ==============================
  // UTILS
  // ==============================
  function isMouseInsideCanvas() {
    if (!container) return false;

    const rect = container.elt.getBoundingClientRect();
    return (
      p5.mouseX >= 0 &&
      p5.mouseX <= rect.width &&
      p5.mouseY >= 0 &&
      p5.mouseY <= rect.height
    );
  }

  function newCheckBox(label, set, x, y) {
    let check = p5.createCheckbox(label, set);
    check.parent("sketch-settings");
    check.position(x, y);
    return check;
  }

  function newSlider(title, x, y, min, max, set, value) {
    let slider = p5.createSlider(min, max, set);
    slider.parent("sketch-settings");
    slider.style("width", "150px");
    slider.position(x, y + 25);

    let sliderText = p5.createP(`${title}: ${value}`);
    sliderText.parent("sketch-settings");
    sliderText.position(x, y);

    return { slider, sliderText };
  }

  function newSelect(title, x, y, opts) {
    let select = p5.createSelect();
    select.parent("sketch-settings");
    select.position(x + 75, y);
    opts.map((opt) => {
      select.option(opt);
    });

    let selectText = p5.createP(`${title}:`);
    selectText.parent("sketch-settings");
    selectText.position(x, y);

    return select;
  }

  function drawVector(vector, r, angle, color) {
    const x = centerX + vector.x * gridSize;
    const y = centerY - vector.y * gridSize;

    p5.stroke(color);
    p5.strokeWeight(2);
    p5.line(centerX, centerY, x, y);
    p5.fill(color);

    const size = 8;
    const angleOffset = p5.PI / 6;

    const x1 = x - size * p5.cos(angle - angleOffset);
    const y1 = y + size * p5.sin(angle - angleOffset);
    const x2 = x - size * p5.cos(angle + angleOffset);
    const y2 = y + size * p5.sin(angle + angleOffset);

    p5.triangle(x, y, x1, y1, x2, y2);
    p5.noFill();
    p5.arc(centerX, centerY, radius / r, radius / r, p5.TAU - angle, p5.TAU);
  }

  // ==============================
  // VECTOR CLASS
  // ==============================
  class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    static fromPolar(r, angle) {
      return new Vector(r * p5.cos(angle), r * p5.sin(angle));
    }

    add(v) {
      return new Vector(this.x + v.x, this.y + v.y);
    }

    multiply(v) {
      return Vector.fromPolar(
        this.modulus() * v.modulus(),
        this.angle() + v.angle()
      );
    }

    division(v) {
      const angle = this.angle() - v.angle();
      return Vector.fromPolar(
        this.modulus() / v.modulus(),
        angle >= 0 ? angle : p5.TAU + angle
      );
    }

    power(n) {
      const angles = Array.from(
        { length: n },
        (_, k) => (this.angle() + p5.TAU * k) / n
      );
      return angles.map((theta) => Vector.fromPolar(1, theta));
    }

    conjugate() {
      return new Vector(this.x, -this.y);
    }

    inverse() {
      return Vector.fromPolar(1 / this.modulus(), -this.angle());
    }

    angle() {
      let angle = p5.atan2(this.y, this.x);
      angle = angle < 0 ? 2 * p5.PI + angle : angle;
      return angle;
    }

    modulus() {
      return p5.sqrt(this.x * this.x + this.y * this.y);
    }
  }
}
