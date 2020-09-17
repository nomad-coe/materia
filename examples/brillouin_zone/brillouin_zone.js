// Find the element in which the visualizer will be enbedded into
let targetElem = document.getElementById("visualizationCanvas");

// Viewer options
let options = {
  view: {
    fitMargin: 0.02,
  },
  layout: {
    viewRotation: {
      align: {
          up: "a",
          segments: "front",
      },
      rotations: [
          [0, 1, 0, 25],
          [1, 0, 0, 25],
      ],
    }
  },
  basis: {
    font: "Ubuntu",
    offset: 0.02,
    a: {
      color: "#ff0000",
      size: 0.03,
    },
    b: {
      color: "#00ff00",
      size: 0.03,
    },
    c: {
      color: "#0000ff",
      size: 0.03,
    },
  },
  kpoints: {
    label: {
      color: "#ffffff",
      font: "Ubuntu",
      size: 0.03,
      offset2D: [0, -0.75],
      stroke: {
        width: 0.06,
        color: "#000000",
      },
    }
  },
  renderer: {
    backgroundColor: ["#fff", 1]
  }
};

// Initialize viewer
let viewer = new materia.BrillouinZoneViewer(targetElem, options);

// The reciprocal cell basis vectors
let basis = [[-1573507798.3392656, 1573507798.3392656, 1573507798.3392656],
  [1573507798.3392656, -1573507798.3392656, 1573507798.3392656],
  [1573507798.3392656, 1573507798.3392656, -1573507798.3392656]
]

// k-path segments
let segments = [
  [[0.0,0.0,0.0], [0.5,0.0,0.5]],
  [[0.5,0.0,0.5], [0.0,0.0,0.5]],
];

// Segment labels
labels = [["A", "B"], ["B", "C"]];

// Load structure into viewer
viewer.load({basis: basis, kpoints: labels, segments: segments});
viewer.fitToCanvas();
viewer.render();
