// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
    fitMargin: 0.5,
  },
  layout: {
    periodicity: "none",
    //translation: [0, 0, 0],
    viewCenter: "COC",
    viewRotation: {
      alignments: [
        ["up", "c"],
        ["right", "b"],
      ],
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
        phong: {
          shininess: 30,
        }
        //toon: {
          //tones: 3
        //}
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
        //toon: {
          //tones: 3
        //}
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
let positions = [
    [0, 0, 0],
];
let species = ["H"];
var bulk = {
    "species": species,
    "cell": [
        [1, 0, 0.0],
        [0.0, 1, 0],
        [0, 0.0, 1]
    ],
    "positions": positions,
    "fractional": true,
    "pbc": [true, true, true],
};

viewer.load(bulk);
