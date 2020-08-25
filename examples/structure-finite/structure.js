// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
    fitMargin: 0.5,
  },
  layout: {
    periodicity: "none",
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

// Load finite molecule with cartesian positions and cell
var molecule = {
    "species": [8, 1],
    "positions": [
        [0.0, 0.5, 0.0],
        [0.0, 1.5, 0.0],
    ],
    "pbc": [false, false, false]
};
viewer.load(molecule);
