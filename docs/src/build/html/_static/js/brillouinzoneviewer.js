// Find the element in which the visualizer will be embedded into. It
// determines the visualization canvas size.
let canvas = document.getElementById("canvas");

// Viewer options
let options = {
  controls: {
      enablePan: false
  },
  view: {
    fitMargin: 0.02,
  },
  layout: {
    viewRotation: {
      align: {
          up: "a",
          segments: "front",
      },
      rotations: [
          [0, 1, 0, 45],
          [1, 0, 0, 25],
      ],
    }
  },
  basis: {
    color: "#fff",
  },
  kpoints: {
    label: {
      color: "#fff",
    }
  }
};

// Initialize viewer
let viewer = new materia.BrillouinZoneViewer(canvas, options);

// Define structure and load into viewer
let reciprocal = {
  basis: [
    [-0.15735, 0.15735, 0.15735],
    [0.15735, -0.15735, 0.15735],
    [0.15735, 0.15735, -0.15735]
  ],
  segments:[
    [[0.0, 0.0, 0.0], [0.5, 0.0, 0.5]],
    [[0.5, 0.0, 0.5], [0.0, 0.0, 0.5]],
    [[0.0, 0.5, 0.0], [0.0, 0.5, 0.5]],
  ],
  kpoints: {
    "A": [0.0, 0.0, 0.0],
    "B": [0.5, 0.0, 0.5],
    "C": [0.0, 0.0, 0.5],
    "D": [0.0, 0.5, 0.0],
    "E": [0.0, 0.5, 0.5],
  }
}

// Load structure into viewer
viewer.load(reciprocal);
