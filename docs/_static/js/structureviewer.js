// Find the element in which the visualizer will be embedded into. It
// determines the visualization canvas size.
let canvas = document.getElementById("canvas");

// Viewer options
let options = {
  structure: {
    showParam: true,
    showCell: true,
    showBonds: true,
    viewCenter: "COC",
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
