Structure Viewer
================

Try out the interactive visualizer below. Controls are as follows:

 - Rotate: Drag with left mouse button held down
 - Pan: Drag with right mouse button held down
 - Zoom: Mousewheel

.. raw:: html

    <div>
        <div id="canvas" style="width: 100%; height: 25rem"></div>
        <script src="../_static/js/three.min.js" defer></script>
        <script src="../_static/js/materia.min.js" defer></script>
        <script src="../_static/js/structureviewer.js" defer></script>
    </div>

Example
-------
This piece of Javascript code shows an example of loading the viewer into a an
HTML element that has been given the id :code:`canvas`. This example assumes
that the global variable installation has been used, but it can be very simply
changed to also work with the module installation by adding the proper imports
and changing the :code:`StructureViewer` constructor call.

.. code:: javascript

    // Find the HTML element in which the visualizer will be embedded into. It
    // determines the visualization canvas size.
    let canvas = document.getElementById("canvas");

    // Viewer options
    let options = {
        structure: {
            showParam: true,
            showCell: true,
            showBonds: true,
            viewCenter: "COC",
        }
    };

    // Initialize viewer.
    let viewer = new materia.StructureViewer(canvas, options);

    // Define structure and load into viewer
    let nacl = {
        atomicNumbers: [11, 17, 11, 17, 11, 17, 11, 17],
        cell: [
            [5.6402, 0.0, 0.0],
            [0.0, 5.6402, 0.0],
            [0.0, 0.0, 5.6402]
        ],
        scaledPositions: [
            [0.0, 0.5, 0.0],
            [0.0, 0.5, 0.5],
            [0.0, 0.0, 0.5],
            [0.0, 0.0, 0.0],
            [0.5, 0.5, 0.5],
            [0.5, 0.5, 0.0],
            [0.5, 0.0, 0.0],
            [0.5, 0.0, 0.5]
        ],
        pbc: [true, true, true],
    };
    viewer.load(nacl);

Loading a structure
-------------------
You can load a new atomic structure to the viewer by calling the
:func:`StructureViewer.load` method. Check the API for the supported
parameters.

Setting the options
-------------------
The options that are given in the constructor are passed to the
:func:`StructureViewer.setOptions` method. Check the API for the supported
parameters.

Theming
-------
The visualizer suports several theming options that can be used to change the
appearance to better fit your needs. The theme is provided directly in the
options under the theme subsetting.

API
---
.. js:autofunction:: StructureViewer#setOptions
.. js:autofunction:: StructureViewer#setTheme
.. js:autofunction:: StructureViewer#load

