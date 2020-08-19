// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
    fitMargin: 0.5,
  },
  layout: {
    periodicity: "none",
    translation: [0, 0, 0],
    viewCenter: "COC",
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

// Define structure and load it into the viewer
let positions = [
    [0.0, 0.5, 0.0],
    [0.0, 0.5, 0.5],
    [0.0, 0.0, 0.5],
    [0.0, 0.0, 0.0],
    [0.5, 0.5, 0.5],
    [0.5, 0.5, 0.0],
    [0.5, 0.0, 0.0],
    [0.5, 0.0, 0.5]
];
var bulk = {
    "atomicNumbers": [11, 17, 11, 17, 11, 17, 11, 17],
    "cell": [
        [5.6402, 5.6402, 0.0],
        [0.0, 5.6402, 5.6402],
        [5.6402, 0.0, 5.6402]
    ],
    "scaledPositions": positions,
    "pbc": [true, true, true],
};
viewer.load(bulk);

setInterval(function() {
  positions[0][2] += 0.01;
  viewer.setPositions(positions, true, true)
}, 100);

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
