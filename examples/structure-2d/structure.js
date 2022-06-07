// Initialize viewer
let targetElem = document.getElementById("visualizationCanvas")
var viewer = new materia.StructureViewer(targetElem)

// Define structure and load into viewer
var a = 3
var tan60 = Math.tan(Math.PI/3)
var bulk = {
    "species": ["C", "C"],
    "cell": [
        [a, 0, 0],
        [0.5*a, 0.5*tan60*a, 0],
        [0, 0, 0]
    ],
    "positions": [
       [0, 0, 0],
       [0.5*a, 1/6*tan60*a, 0]
    ],
    "fractional": false,
    "pbc": [true, true, false],
};
viewer.load(bulk);

// Setup viewer initial state
viewer.align([
  ["right", "a"],
  ["up", "b"],
])
viewer.atoms()
viewer.bonds()
viewer.cell()
viewer.latticeConstants()
viewer.center('COC')
viewer.fit('full', 1)
viewer.controls()

// Render final result
viewer.render()