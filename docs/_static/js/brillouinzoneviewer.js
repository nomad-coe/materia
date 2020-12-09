// Find the element in which the visualizer will be embedded into. It
// determines the visualization canvas size.
let canvas = document.getElementById("canvas");

// Viewer options
let options = {
  controls: {
      enablePan: false
  },
  view: {
    fitMargin: 0.075,
  },
  layout: {
    viewRotation: {
      alignments: [
          ["up", "a"],
          ["front", "segments"],
      ],
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
