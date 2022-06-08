// Initialize viewer
let targetElem = document.getElementById("visualizationCanvas")
var viewer = new materia.StructureViewer(targetElem)

// Define structure and load into viewer
var molecule = {
    "species": [8, 1],
    "positions": [
        [0.0, 0.5, 0.0],
        [0.0, 1.5, 0.0],
    ],
    "pbc": [false, false, false]
}
viewer.load(molecule)

// Setup viewer initial state
viewer.atoms()
viewer.bonds()
viewer.center('COP')
viewer.fit('full', 1)
viewer.controls()

// Render final result
viewer.render()