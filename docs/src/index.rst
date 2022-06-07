materia
=======

.. raw:: html

    <div>
        <div id="container" style="margin-top: -2rem; width: 100%; height: 20rem; display: flex; justify-content: center; align-items: center">
            <div id="canvas" style="width: 20rem; height: 20rem"></div>
        </div>
        <script src="./_static/js/three.min.js" defer></script>
        <script src="./_static/js/materia.min.js" defer></script>
        <script src="./_static/js/frontpage.js" defer></script>
    </div>

Materia is a Javascript library for creating browser-based 3D visualizations
of atomistic structures and other material properties. Check the demos and
installation guide for further details.

Go Deeper
=========
The full source code with examples can be explored at `github
<https://github.com/nomad-coe/materia>`_.

.. toctree::
    :hidden:

    install
    viewers/viewers

Changelog
=========
 - 1.0.0:
    - Significant breaking change to the viewer API. The viewers are now
      controlled using newly exposed functions that allow for a very
      fine-grained control of the rendering and updates.

 - 0.0.11:
    - Updated dependencies used to build the 3D visualization.

 - 0.0.10:
    - Fixed issue in the detection of the visualization boundary for the
      BrillouinZoneViewer.

 - 0.0.7:
    - Fixed issue with automatic fitting to canvas.

 - 0.0.6:
    - Added BrillouinZoneViewer.
    - Added Toon material for StructureViewer.
    - Fixed issues with shadows.
