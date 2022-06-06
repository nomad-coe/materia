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

.. literalinclude :: ../_static/js/structureviewer.js
   :language: javascript

Overview
--------
The general workflow for producing a visualization is as follows:

 - Create an instance of the viewer, which is at some point attached to an HTML
   element.
 - Load an atomic structure using the :func:`StructureViewer.load`-method.
 - Modify the initial view using the functions documented in the API, this may
   contain e.g. translations, rotations, centerings, fitting, zooming etc.
 - Render the result on the HTML host element at any point using the
   :func:`Viewer.render` method.
 - Do any modifications dynamically according to your applications state, do not
   forget to render when you want the result to be displayed.

Constructor
-----------
In the constructor :class:`Viewer` you can define the host element (this can also be changed at
any point using the :func:`Viewer.changeHostElement` method) together
with a set of fixed options that control the rendering.

Loading a structure
-------------------
You can load a new atomic structure to the viewer by calling the
:func:`StructureViewer.load` method. Check the API for the supported parameters.
Notice that this method will simply create the atomic positions for the given
structure, and will not yet display anything. See configuration and render for
more information on how to display the structure.

Configuration
-------------
You can dynamically alter the visualization at any point by chaining the
provided functions calls. You can see the supported API at the bottom of the
page. Notice that all of these functions will change the visualization state
internally, but will not yet render the result on screen, see render on how to
produce the final result.

Render
------
You can control when the structure gets rendered on screen by manually calling
the :func:`Viewer.render` method. This way you can modify any number of options
without any screen flickering by only calling render when you are finished.

API
---
.. js:autoclass:: Viewer
.. js:autofunction:: StructureViewer#load
.. js:autofunction:: StructureViewer#atoms
.. js:autofunction:: StructureViewer#bonds
.. js:autofunction:: StructureViewer#cell
.. js:autofunction:: StructureViewer#latticeConstants
.. js:autofunction:: StructureViewer#center
.. js:autofunction:: StructureViewer#fit
.. js:autofunction:: StructureViewer#translate
.. js:autofunction:: StructureViewer#rotate
.. js:autofunction:: StructureViewer#align
.. js:autofunction:: Viewer#controls
.. js:autofunction:: Viewer#render
.. js:autofunction:: Viewer#zoom
.. js:autofunction:: Viewer#fitCanvas
.. js:autofunction:: Viewer#resetCamera
.. js:autofunction:: Viewer#saveCameraReset
.. js:autofunction:: Viewer#changeHostElement

