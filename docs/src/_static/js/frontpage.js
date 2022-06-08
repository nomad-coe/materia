// Initialize viewer
let targetElem = document.getElementById("canvas")
var viewer = new materia.StructureViewer(targetElem)

// Define structure and load into viewer
let nacl = {
    species: ["C", "Pb", "C", "Pb", "C", "Pb", "C", "Pb"],
    cell: [
        [7, 0.0, 0.0],
        [0.0, 7, 0.0],
        [0.0, 0.0, 7]
    ],
    positions: [
        [0.0, 0.5, 0.0],
        [0.0, 0.5, 0.5],
        [0.0, 0.0, 0.5],
        [0.0, 0.0, 0.0],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, 0.0],
        [0.5, 0.0, 0.0],
        [0.5, 0.0, 0.5]
    ],
    fractional: true,
    pbc: [true, true, true],
    wrap: {type: 'boundary'}
};
viewer.load(nacl);

// Setup viewer initial state
// viewer.align([
//   ["top", "c"],
//   ["right", "b"],
// ])
viewer.rotate([
  [0, 1, 0, 60],
  [1, 0, 0, 30],
])
viewer.atoms()
viewer.bonds({threshold: 1.5})
viewer.center('COP')
viewer.fit('full', 0.7)
viewer.controls()

// Render final result
viewer.render()

setInterval(() => {
  viewer.rotate([[1, 1, 0, 0.25]])
  viewer.render()
}, 50)