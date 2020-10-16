// Find the element in which the visualizer will be embedded into. It
// determines the visualization canvas size.
let canvas = document.getElementById("canvas");

// Viewer options
let options = {
  layout: {
    viewCenter: "COP",
    periodicity: "boundary",
    viewRotation: {
      align: {
          top: "c",
          right: "b",
      },
      rotations: [
          [0, 1, 0, 60],
          [1, 0, 0, 30],
      ],
    }
  },
  view: {
    autoFit: false,
    autoResize: false,
    fitMargin: 0.7
  },
  controls: {
    enableZoom: false,
    enablePan: false,
  },
  bonds: {
    enabled: true,
    threshold: 1.5,
  },
  cell: {
    enabled: false
  },
  latticeConstants: {
    enabled: false
  }
};

// Initialize viewer
let viewer = new materia.StructureViewer(canvas, options);

// Define structure and load into viewer
let nacl = {
    species: ["C", "Pb", "C", "Pb", "C", "Pb", "C", "Pb"],
    cell: [
        [7, 0.0, 0.0],
        [0.0, 7, 0.0],
        [0.0, 0.0, 7]
    ],
    positions: [
        [0.0, 0.5, 0.0],
        [0.0, 0.5, 0.5],
        [0.0, 0.0, 0.5],
        [0.0, 0.0, 0.0],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.0],
        [0.5, 0.0, 0.0],
        [0.5, 0.0, 0.5]
    ],
    fractional: true,
    pbc: [true, true, true],
};
viewer.load(nacl);
viewer.fitToCanvas()
setInterval(() => {
  viewer.rotateView([[1, 1, 0, 0.25]])
}, 50)
