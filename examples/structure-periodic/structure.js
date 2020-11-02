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
    enabled: false,
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
    threshold: 1.5,
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
    "species": [11, 17, 11, 17, 11, 17, 11, 17],
    "cell": [
        [8, 0, 0.0],
        [0.0, 8, 0],
        [0, 0.0, 8]
    ],
    "positions": positions,
    "fractional": true,
    "pbc": [true, true, true],
};

viewer.load(bulk);
