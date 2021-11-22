// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
    fitMargin: 0.5,
  },
  layout: {
    periodicity: "none",
    viewCenter: "COC",
    viewRotation: {
      alignments: [
        ["right", "a"],
        ["up", "b"],
      ],
      rotations: [],
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
        phong: {
          shininess: 30,
        }
    },
    radius: 0.08,
    threshold: 1.0,
    smoothness: 155,
  },
  atoms: {
    material: {
        phong: {
          shininess: 30,
        }
    },
    colors: "Jmol",
    radii: "covalent",
    scale: 1,
    smoothness: 175,
  },
  renderer: {
    shadows: {
      enabled: true
    }
  }
};

// Initialize viewer and load structure
var viewer = new materia.StructureViewer(targetElem, options);

// Define structure and load it into the viewer
var a = 3
var bulk = {
    "species": ["C", "C"],
    "cell": [
        [a, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
    "positions": [
       [0, 0, 0],
       [0.5*a, 0, 0]
    ],
    "fractional": false,
    "pbc": [true, false, false],
};

viewer.load(bulk);
