// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
    fitMargin: 0.5,
  },
  layout: {
    //periodicity: "boundary",
    translation: [0, 0, 0],
    viewCenter: "COP",
    viewRotation: {
      //align: {
          //top: "c",
          //right: "b",
      //},
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
//let positions = [
    //[0.0, 0.5, 0.0],
    //[0.0, 0.5, 0.5],
    //[0.0, 0.0, 0.5],
    //[0.0, 0.0, 0.0],
    //[0.5, 0.5, 0.5],
    //[0.5, 0.5, 0.0],
    //[0.5, 0.0, 0.0],
    //[0.5, 0.0, 0.5]
//];
var bulk = {
    //"species": [11, 17, 11, 17, 11, 17, 11, 17],
    //"cell": [
        //[8, 0, 0.0],
        //[0.0, 8, 0],
        //[0, 0.0, 8]
    //],
    //"positions": positions,
    //"fractional": true,
    //"pbc": [true, true, true],
//};
"positions": [[0.0, 0.0, 0.0], [2.8199999999999994, 0.0, 0.0], [0.0, 2.8199999999999994, 2.8199999999999994], [2.8199999999999994, 2.8199999999999994, 2.8199999999999994], [2.8199999999999994, 0.0, 2.8199999999999994], [0.0, 0.0, 2.8199999999999994], [2.8199999999999994, 2.8199999999999994, 0.0], [0.0, 2.8199999999999994, 0.0]], "cell": [[5.64, 0.0, 0.0], [0.0, 5.64, 0.0], [0.0, 0.0, 5.64]], "species": [11, 17, 11, 17, 11, 17, 11, 17], "pbc": [true, true, true]}
////"positions": [[0.0, 0.0, 0.0], [2.8199999999999994, 5.640000000000001, 5.640000000000001], [2.8199999999999994, 2.8199999999999994, 0.0], [5.64, 8.459999999999999, 5.640000000000001], [0.0, 2.8199999999999994, 2.8199999999999994], [2.8199999999999994, 2.82, 2.82], [2.8199999999999994, 5.639999999999999, 2.8200000000000007], [5.64, 5.64, 2.8200000000000003]], "cell": [[0.0, 5.64, 5.64], [2.82, 0.0, 2.82], [5.64, 5.64, 0.0]], "species": [11, 17, 11, 17, 11, 17, 11, 17], "pbc": [true, true, true]}
////"positions": [[0.0, 0.0, 0.0], [2.82, 2.82, 2.8200000000000003], [2.8199999999999994, 0.0, 2.8199999999999994], [5.64, 2.82, 5.64]], "cell": [[0.0, 2.82, 2.82], [5.64, 0.0, 5.64], [2.82, 2.82, 0.0]], "species": [11, 17, 11, 17], "pbc": [true, true, true]}
////
var b = {
"positions": [[0.0, 0.0, 0.0], [2.8199999999999994, 5.640000000000001, 5.640000000000001], [2.8199999999999994, 2.8199999999999994, 0.0], [5.64, 8.459999999999999, 5.640000000000001], [0.0, 2.8199999999999994, 2.8199999999999994], [2.8199999999999994, 2.82, 2.82], [2.8199999999999994, 5.639999999999999, 2.8200000000000007], [5.64, 5.64, 2.8200000000000003]], "species": [11, 17, 11, 17, 11, 17, 11, 17]}

viewer.load(b);
viewer.load(bulk);
