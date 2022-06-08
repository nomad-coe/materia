Installation
============
There are several installation options that are detailed below.

As a library under a global variable
------------------------------------
When using this method, you must ensure that the three.js library is available
as a global variable under the name :code:`THREE`. In the simplest form this
can be achieved by including the minified library code from a CDN by including
it in your html. For example to include the version 0.118.0 from CDNJS, include
the following script tag:

.. code-block:: html

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r118/three.min.js" integrity="sha512-ZoEQdcOJ16M20VnLaQxmZlthvLdTbF9CSAAyvZyzru+Em8NEY+7Xy0jdWdUjdOlo7hbPVmaobVBpUF9aqmXENA==" crossorigin="anonymous"></script>

After this script (order is important, also see the `defer
<https://www.w3schools.com/tags/att_script_defer.asp>`_ attribute for script
elements), you will want to include the minified library for :code:`materia`.
You can `get the newest version from the GitHub repository
<https://raw.githubusercontent.com/nomad-coe/materia/master/dist/materia.min.js>`_
or `install and use a specific version from npm
<https://www.npmjs.com/package/@lauri-codes/materia>`_. Then place the minified
file (:code:`materia.min.js`) in your server and include it as a script element:

.. code-block:: html

    <script src="/path/in/your/server/materia.min.js"></script>

All functionality will then be available under the
:code:`materia` variable, e.g.

.. code-block:: javascript

    let structureViewer = new materia.StructureViewer();

As a module
-----------
The library is distributed as an `npm package
<https://www.npmjs.com/package/@lauri-codes/materia>`_ and can be installed
with:

.. code-block:: sh

    npm install @lauri-codes/materia

This command will also install the `three.js <https://threejs.org/>`_ library
as a dependency. With the npm installation you have direct access to individual
modules that can also be tree-shaked in your own build. For example:

.. code-block:: javascript

    import { StructureViewer } from "@lauri-codes/materia"
