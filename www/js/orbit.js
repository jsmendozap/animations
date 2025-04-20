export default function orbitSketch(p5) {
  const MU = 1.327e20; // Standard gravitational parameter
  const S = 1361; // Solar constant
  const a = 1.496e11; // Semi-major axis
  let M = 0; // Mean anomaly
  let SCALE, e, speed, step, slider, eLabel;

  const settings = document.getElementById("sketch-settings");
  settings.style.minWidth = "160px";
  settings.style.minHeight = "120px";

  p5.setup = function () {
    const container = document.getElementById("sketch-container");
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    SCALE = 1.2e-9 * (width / 500);

    p5.createCanvas(width, height).parent("sketch-container");
    p5.angleMode(p5.RADIANS);

    plotControls();
  };

  p5.draw = function () {
    p5.background(255);
    step = (speed.value() * 2 * p5.PI) / 365.25;
    e = slider.value();

    p5.push();
    p5.translate(0.45 * p5.width, 0.55 * p5.height);

    // Earth's orbit
    drawOrbit();

    const { x, y, v, theta, r } = earthPosition(M);
    p5.stroke(200);
    p5.line(0, 0, x, y);

    // Sun
    p5.fill("#ffe65d");
    p5.stroke("orange");
    p5.ellipse(0, 0, 25, 25);

    // Earth
    p5.fill("#2e84ce");
    p5.ellipse(x, y, 15, 15);
    p5.pop();

    // Text
    p5.fill(0);
    p5.noStroke();
    p5.text(`Earth-Sun distance: ${(r / 1000).toFixed(1)} Km`, 5, 10);
    p5.text(`Instantaneous speed: ${v.toFixed(1)} m/s`, 5, 25);
    p5.text(`Avg. radiation: ${avgRadiation(theta).toFixed(1)} W/m²`, 5, 40);
    p5.text(`Inst. radiation: ${radiation(r).toFixed(1)} W/m²`, 5, 55);
    eLabel.html(`Eccentricity: ${e}`);

    M = (M + step) % p5.TWO_PI;
  };

  p5.windowResized = function () {
    const container = document.getElementById("sketch-container");
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    p5.resizeCanvas(width, height);
    SCALE = 1.15e-9 * (width / 500);
  };

  function drawOrbit() {
    p5.stroke(160);
    p5.noFill();
    p5.beginShape();
    for (let theta = 0; theta < p5.TWO_PI; theta += 0.05) {
      const r = radius(theta);
      const x = -r * SCALE * p5.cos(theta);
      const y = r * SCALE * p5.sin(theta);
      p5.vertex(x, y);
    }
    p5.endShape(p5.CLOSE);
  }

  function plotControls() {
    eLabel = p5.createP().parent("sketch-settings").position(15, 55);

    slider = p5
      .createSlider(0.005, 0.4, 0.018, 0.001)
      .parent("sketch-settings")
      .position(15, 80)
      .size(120);

    const sLabel = p5
      .createP("Animation speed:")
      .parent("sketch-settings")
      .position(15, 110);

    speed = p5
      .createSlider(0.01, 1, 1, 0.01)
      .parent("sketch-settings")
      .position(15, 130)
      .size(80);

    return { slider, speed, eLabel };
  }

  function earthPosition(M) {
    const E = solveKeplerE(M);

    // prettier-ignore
    const theta =
      2 * p5.atan2(
        p5.sqrt(1 + e) * p5.sin(E / 2),
        p5.sqrt(1 - e) * p5.cos(E / 2)
      );

    const r = radius(theta);

    return {
      x: -r * SCALE * p5.cos(theta),
      y: r * SCALE * p5.sin(theta),
      v: p5.sqrt(MU * (2 / r - 1 / a)),
      theta: theta,
      r: r,
    };
  }

  function solveKeplerE(M, tol = 1e-6, maxIter = 50) {
    let E = M;
    let delta = 1;
    let iter = 0;

    while (p5.abs(delta) > tol && iter < maxIter) {
      let f = E - e * p5.sin(E) - M;
      let df = 1 - e * p5.cos(E);
      delta = f / df;
      E -= delta;
      iter++;
    }

    return E;
  }

  function avgRadiation(theta) {
    let s = 0;
    for (let i = 0; i < theta; i += step) {
      const r = radius(i);
      s += radiation(r) * step;
    }
    return s / theta;
  }

  function radiation(r) {
    return S * (a / r) ** 2;
  }

  function radius(theta) {
    return (a * (1 - e ** 2)) / (1 + e * p5.cos(theta));
  }
}
