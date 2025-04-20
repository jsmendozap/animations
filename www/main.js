import orbitSketch from "./js/orbit.js";
import complexSketch from "./js/complex.js";

let sketches = {
  orbit: orbitSketch,
  complex: complexSketch,
};

let currentP5 = null;

Shiny.addCustomMessageHandler("loadSketch", function (message) {
  if (currentP5) {
    currentP5.remove();
    document.getElementById("sketch-settings").innerHTML = "";
  }

  if (sketches[message]) {
    currentP5 = new p5(sketches[message], "sketch-container");
  } else {
    console.error("Sketch no encontrado:", message);
  }
});
