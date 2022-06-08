Brillouin Zone Viewer
=====================

Try out the interactive visualizer below. Controls are as follows:

 - Rotate: Drag with left mouse button held down
 - Pan: Drag with right mouse button held down
 - Zoom: Mousewheel
 - Reset: Double click

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

Overview
--------
The general workflow for producing a visualization is as follows:

 - Create an instance of the viewer, which is at some point attached to an HTML
   element.
 - Load a structure using the :func:`BrillouinZoneViewer.load`-method.
 - Modify the initial view using the functions documented in the
   :ref:`viewers/brillouinzoneviewer:API`, this may contain e.g. translations,
   rotations, centerings, fits, zooming etc.
 - Render the result on the HTML host element at any point using the
   :func:`Viewer.render` method.
 - Do any modifications dynamically according to your applications state, do not
   forget to render when you want the result to be displayed.

Constructor
-----------
In the constructor :class:`BrillouinZoneViewer` you can define the host element (this can
also be changed at any point using the :func:`Viewer.changeHostElement` method)
together with a set of default options that control the rendering.

Loading a structure
-------------------
You can load a new structure to the viewer by calling the
:func:`BrillouinZoneViewer.load` method. Check the API for the supported
parameters.  Notice that this method will only create the internal
representation and will not yet display anything. See
:ref:`viewers/brillouinzoneviewer:Configuration` and
:ref:`viewers/brillouinzoneviewer:Render` for more information on how to display the
structure.

Configuration
-------------
You can dynamically alter the visualization at any point by chaining the
provided functions calls. Check out the :ref:`viewers/brillouinzoneviewer:API` for
the supported functions. Notice that all of these functions will change the
visualization state internally, but will not yet render the result on screen,
see :ref:`viewers/brillouinzoneviewer:Render` on how to produce the final result.

Render
------
You can control when the structure gets rendered on screen by manually calling
the :func:`Viewer.render` method. This way you can modify any number of options
without any screen flickering by only calling render when you are finished.

Tips
----
 - If you are not seeing your changes updated on the screen, or they are updated
   only after interacting with the structure, double check that you have called
   :func:`Viewer.render` after your changes.
 - If the interactive controls are not working, remember that you have to set
   them up by calling :func:`Viewer.controls`.
 - When the HTML element containing the canvas change size, you may want to
   refit the canvas to it using :func:`Viewer.fitCanvas`.
 - You can change the visualization canvas at any point by calling
   :func:`Viewer.changeHostElement`. Remember to refit the canvas after this
   with :func:`Viewer.fitCanvas`.

API
---
.. js:autoclass:: BrillouinZoneViewer
.. js:autofunction:: BrillouinZoneViewer#load
.. js:autofunction:: BrillouinZoneViewer#fit
.. js:autofunction:: BrillouinZoneViewer#align
.. js:autofunction:: Viewer#rotate
.. js:autofunction:: Viewer#setRotation
.. js:autofunction:: Viewer#translate
.. js:autofunction:: Viewer#setTranslation
.. js:autofunction:: Viewer#controls
.. js:autofunction:: Viewer#render
.. js:autofunction:: Viewer#zoom
.. js:autofunction:: Viewer#fitCanvas
.. js:autofunction:: Viewer#resetCamera
.. js:autofunction:: Viewer#saveCameraReset
.. js:autofunction:: Viewer#changeHostElement

