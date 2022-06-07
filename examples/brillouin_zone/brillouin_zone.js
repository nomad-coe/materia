// Initialize viewer
const canvas = document.getElementById("visualizationCanvas");
const viewer = new materia.BrillouinZoneViewer(canvas);

// Define structure and load into viewer
let reciprocal = {
  basis: [
    [-0.15735, 0.15735, 0.15735],
    [0.15735, -0.15735, 0.15735],
    [0.15735, 0.15735, -0.15735]
  ],
  segments: [
    [
      [0, 0, 0],
      [0.5, 0, 0.5],
      [0.5, 0.25, 0.75],
      [0.375, 0.375, 0.75],
      [0, 0, 0],
      [0.5, 0.5, 0.5],
      [0.625, 0.25, 0.625],
      [0.5, 0.25, 0.75],
      [0.5, 0.5, 0.5],
      [0.375, 0.375, 0.75]
    ],
    [
      [0.625, 0.25, 0.625],
      [0.5, 0, 0.5]
    ]
  ],
  kpoints: [
    ["A", [0.0, 0.0, 0.0]],
    ["B", [0.5, 0.0, 0.5]],
    ["C", [0.5, 0.25, 0.75]],
    ["D", [0.375, 0.375, 0.75]],
    ["E", [0.5, 0.5, 0.5]],
    ["F", [0.625, 0.25, 0.625]],
  ]
}
viewer.load(reciprocal)

// Setup viewer initial state
viewer.align([
  ["up", "a"],
  ["front", "segments"]
])
viewer.rotate([
  [0, 1, 0, 45],
  [1, 0, 0, 25],
])
viewer.fit(0.075)
viewer.controls()

// Render final result
viewer.render()