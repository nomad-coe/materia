// Find the element in which the visualizer will be embedded into. It
// determines the visualization canvas size.
let canvas = document.getElementById("canvas");

// Viewer options
let options = {
  layout: {
    viewCenter: "COC",
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
  bonds: {
    enabled: true
  },
  cell: {
    enabled: true
  },
  latticeConstants: {
    enabled: true
  }
};

// Initialize viewer
let viewer = new materia.StructureViewer(canvas, options);

// Define structure and load into viewer
let nacl = {
    atomicNumbers: [11, 17, 11, 17, 11, 17, 11, 17],
    cell: [
        [5.6402, 0.0, 0.0],
        [0.0, 5.6402, 0.0],
        [0.0, 0.0, 5.6402]
    ],
    scaledPositions: [
        [0.0, 0.5, 0.0],
        [0.0, 0.5, 0.5],
        [0.0, 0.0, 0.5],
        [0.0, 0.0, 0.0],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.0],
        [0.5, 0.0, 0.0],
        [0.5, 0.0, 0.5]
    ],
    pbc: [true, true, true],
};
viewer.load(nacl);
