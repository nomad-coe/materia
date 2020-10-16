// Find the element in which the visualizer will be embedded into
let canvas = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
    fitMargin: 0.075,
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
    font: "Ubuntu",
    offset: 0.02,
    color: "#ffffff",
    a: {
      color: "#ff0000",
      size: 0.03,
    },
    b: {
      color: "#00ff00",
      size: 0.03,
    },
    c: {
      color: "#0000ff",
      size: 0.03,
    },
  },
  kpoints: {
    label: {
      color: "#ffffff",
      font: "Ubuntu",
      size: 0.03,
      offset2D: [0, -0.75],
      stroke: {
        width: 0.06,
        color: "#000000",
      },
    },
  },
  renderer: {
    backgroundColor: ["#fff", 1]
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
  segments: [
    [
      [0, 0, 0],
      [0.5, 0, 0.5],
      [0.5, 0.25, 0.75],
      [0.375, 0.375, 0.75],
      [0, 0, 0],
      [0.5, 0.5, 0.5],
      [0.625, 0.25, 0.625],
      [0.5, 0.25, 0.75],
      [0.5, 0.5, 0.5],
      [0.375, 0.375, 0.75]
    ],
    [
      [0.625, 0.25, 0.625],
      [0.5, 0, 0.5]
    ]
  ],
  kpoints: [
    ["A", [0.0, 0.0, 0.0]],
    ["B", [0.5, 0.0, 0.5]],
    ["C", [0.5, 0.25, 0.75]],
    ["D", [0.375, 0.375, 0.75]],
    ["E", [0.5, 0.5, 0.5]],
    ["F", [0.625, 0.25, 0.625]],
  ]
}

// Load structure into viewer
viewer.load(reciprocal);
