const path = require('path');

module.exports = {
  mode: "development",
  entry: [
      './src/js/materia.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'materia.min.js',
    library: 'materia',
    libraryTarget: 'var'
  },
  externals: {
    "three": "THREE"
  }
};
