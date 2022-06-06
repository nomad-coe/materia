Brillouin Zone Viewer
=====================

Try out the interactive visualizer below. Controls are as follows:

 - Rotate: Drag with left mouse button held down
 - Zoom: Mousewheel

.. raw:: html

    <div>
        <div id="canvas" style="width: 100%; height: 25rem"></div>
        <script src="../_static/js/three.min.js" defer></script>
        <script src="../_static/js/materia.min.js" defer></script>
        <script src="../_static/js/brillouinzoneviewer.js" defer></script>
    </div>

Example
-------
This piece of Javascript code shows an example of loading the viewer into a an
HTML element that has been given the id :code:`canvas`. This example assumes
that the global variable installation has been used, but it can be very simply
changed to also work with the module installation by adding the proper imports
and changing the :code:`BrillouinZoneViewer` constructor call.

.. literalinclude :: ../_static/js/brillouinzoneviewer.js
   :language: javascript

Loading a structure
-------------------
You can load data to the viewer by calling the :func:`BrillouinZoneViewer.load`
method. Check the API for the supported parameters.

Options
-------
The options that are given in the constructor are passed to the
:func:`BrillouinZoneViewer.setOptions` method. These options are provided as a
nested Javascript object. Check the API for the supported parameters. At any
time you can also manually call this method to change the options. You can also
use this method to only update a subset of the options.

API
---
.. js:autofunction:: BrillouinZoneViewer#load

