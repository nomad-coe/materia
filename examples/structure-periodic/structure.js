// Initialize viewer
let targetElem = document.getElementById("visualizationCanvas")
var viewer = new materia.StructureViewer(targetElem)

// Define structure and load into viewer
let structure = {
    species: [11, 17, 11, 17, 11, 17, 11, 17],
    cell: [
        [5.6402, 0.0, 0.0],
        [0.0, 5.6402, 0.0],
        [0.0, 0.0, 5.6402]
    ],
    positions: [
        [0.0, 1.5, 0.0],
        [0.0, 1.5, 0.5],
        [0.0, 0.0, 0.5],
        [0.0, 0.0, 0.0],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.0],
        [0.5, 0.0, 0.0],
        [0.5, 0.0, 0.5]
    ],
    fractional: true,
    pbc: [true, true, true]
};
viewer.load(structure)

// Setup viewer initial state
viewer.atoms()
viewer.wrap(true)
viewer.bonds()
viewer.cell()
viewer.latticeConstants()
viewer.align([
    ["up", "c"],
    ["right", "b"],
])
viewer.rotate([
    [0, 1, 0, 60],
    [1, 0, 0, 30],
])
viewer.center('COC')
viewer.fit('full', 0.5)
viewer.controls()

// Render final result
viewer.render()