// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
    autoResize: true,       // Automatically fit canvas to the root visualization element
    autoFit: true,          // Automatically set the zoom to fit the structure into the canvas
    fitMargin: 0.5,
  },
  controls: {
    enableZoom: true,       // Enable zoom with mouse wheel/pinch
    enablePan: true,        // Enable pan with mouse/touch
    enableRotate: true,     // Enable rotation
    zoomLevel: 1,           // Default zoom level
  },
  structure: {
    showParam: true,        // Show lattice parameters
    showShadows: true,      // Enable shadows: requires a bit more from GPU
    showCell: true,         // Show unit cell wireframe
    periodicity: [2,1,1],   // The way to deal with periodicity
    createLegend: false,    // Show atom labels
    showLegend: true,       // Show atom labels
    showOptions: true,      // Show the options toolbar
    showBonds: true,        // Show or hide bonds
    radiusScale: 0.8,       // Scaling factor for atomic radii
    bondScale: 1.2,         // Scaling factor for the automatic bond detection
    viewCenter: "COC",      // The rotation and view center position. Valid values are: "COP" (center of position), "COC" center of cell, or a custom position given as array of three cartesian coordinates.
  }
};

// Initialize viewer and load structure
var viewer = new materia.StructureViewer(targetElem, options);

// Define structure and load it into the viewer it
var bulk = {
    "atomicNumbers": [11, 17, 11, 17, 11, 17, 11, 17],
    "cell": [
        [5.6402, 0.0, 0.0],
        [0.0, 5.6402, 0.0],
        [0.0, 0.0, 5.6402]
    ],
    "scaledPositions": [
        [0.0, 0.5, 0.0],
        [0.0, 0.5, 0.5],
        [0.0, 0.0, 0.5],
        [0.0, 0.0, 0.0],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.0],
        [0.5, 0.0, 0.0],
        [0.5, 0.0, 0.5]
    ],
    "primitiveCell": [
        [0.0, 2.8201, 2.8201],
        [2.8201, 0.0, 2.8201],
        [2.8201, 2.8201, 0.0]
    ],
    "pbc": [true, true, true],
};
viewer.load(bulk);

// Load finite molecule with cartesian positions and cell
//var molecule = {
    //"atomicNumbers": [8, 1],
    //"cell": [
        //[1, 0.0, 0.0],
        //[0.0, 1, 0.0],
        //[0.0, 0.0, 1]
    //],
    //"positions": [
        //[0.0, 0.5, 0.0],
        //[0.0, 1.5, 0.0],
    //],
    //"pbc": [false, false, false]
//};
//viewer.load(molecule);
