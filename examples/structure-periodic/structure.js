// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas")

// Viewer options
let options = {
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
  }
}

// Initialize viewer
var viewer = new materia.StructureViewer(targetElem)

// Define structure and load it into the viewer
let positions = [
    [0, 0, 0],
    [0.60, 0.60, 0.60],
    [1, 1, 1],
];
let species = ['H', 'O', 'H'];
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
    "wrap": 'none'
};
viewer.load(bulk)

// Setup viewer initial state
viewer.align([
  ["up", "c"],
  ["right", "b"],
])
viewer.rotate([
    [0, 1, 0, 60],
    [1, 0, 0, 30],
])
viewer.atoms()
viewer.bonds()
viewer.cell()
viewer.latticeConstants({
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
})
viewer.center('COC')
viewer.fit('full', 0.5)
viewer.controls()

// Render final result
viewer.render()