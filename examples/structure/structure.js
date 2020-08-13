// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
      fitMargin: 0.5,
  },
  layout: {
      periodicity: "boundary",
      translation: [0, 0, 0],
      viewCenter: "COP",
  },
  outline: {
      enabled: true,
      color: "#000000",
      size: 0.025,
  },
  cell: {
      enabled: true,
  },
  latticeConstants: {
      enabled: true,
      font: "Arial",
      size: 0.8,
      a: {
          color: "#C52929",
      },
      b: {
          color: "#47A823",
      },
      c: {
          color: "#3B5796",
      },
      alpha: {
          color: "#ffffff",
      },
      beta: {
          color: "#ffffff",
      },
      gamma: {
          color: "#ffffff",
      },
  },
  bonds: {
      enabled: true,
      material: {
          shininess: 30,
      },
      radius: 0.08,
      threshold: 1,
      smoothness: 145,
  }, 
  atoms: {
      material: {
          shininess: 30,
      },
      colors: "Jmol",
      radii: "covalent",
      scale: 1,
      smoothness: 165,
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
//viewer.alignView();

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
