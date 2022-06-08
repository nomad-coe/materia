import { OrthographicControls } from "./orthographiccontrols";
import { merge, isNil, cloneDeep } from "lodash";
import * as THREE from "three";
/**
 * Abstract base class for visualizing 3D scenes with three.js.
 */
export class Viewer {
    /**
     * @param {any} hostElement is the html element where the visualization
     *   canvas will be appended.
     * @param {Object} options An object that can hold custom settings for the viewer.
     * @param {string} options.renderer.pixelRatioScale Scaling factor for the pixel ratio. Defaults to 1.
     * @param {string} options.renderer.antialias.enabled Whether antialiasing is enabled. Defaults to true.
     * @param {string} options.renderer.background.color Color of the background. Defaults to "#fff".
     * @param {number} options.renderer.background.opacity Opacity of the background. Defaults to 0.
     * @param {boolean} options.renderer.shadows.enabled Whether shows are cast
     * by atoms onto others. Note that enabling this increases the computational
     * cost for doing the visualization. Defaults to false
     */
    constructor(hostElement, options = {}) {
        this.hostElement = hostElement;
        this.scenes = []; // A list of scenes that are rendered
        this.objects = []; // A list of objects that are affected by rotations, translations etc.
        this.cameraWidth = 10.0; // The default "width" of the camera
        this.options = {}; // Options for the viewer. Can be e.g. used to control which settings are enabled
        this.translation = new THREE.Vector3(); // Translation vector that has been applied to shift the view
        // Check that OpenGL is available, otherwise throw an exception
        if (!this.webglAvailable()) {
            throw Error("WebGL is not supported on this browser, cannot display viewer.");
        }
        // Save default settings
        const controlDefaults = {
            zoom: {
                enabled: true,
                speed: 0.2
            },
            rotation: {
                enabled: true,
                speed: 2.5
            },
            pan: {
                enabled: true,
                speed: 10
            },
            resetOnDoubleClick: true
        };
        const rendererDefaults = {
            pixelRatioScale: 1,
            antialias: {
                enabled: true,
            },
            background: {
                color: "#fff",
                opacity: 0,
            },
            shadows: {
                enabled: false,
            }
        };
        this.rendererDefaults = merge(cloneDeep(rendererDefaults), cloneDeep(options === null || options === void 0 ? void 0 : options.renderer));
        this.controlDefaults = merge(cloneDeep(controlDefaults), cloneDeep(options === null || options === void 0 ? void 0 : options.controls));
        this.setOptions(options);
        this.setupRootElement();
        this.setupRenderer();
        this.setupScenes();
        this.setupLights();
        this.setupCamera();
        this.changeHostElement(hostElement);
    }
    /**
     * Can be used to download the current visualization as a jpg-image to the
     * browser's download location.
     */
    takeScreenShot(filename) {
        let imgData;
        try {
            // Create headers and actual image contents
            const strMime = "image/png";
            const strDownloadMime = "image/octet-stream";
            this.render();
            imgData = this.renderer.domElement.toDataURL(strMime);
            const strData = imgData.replace(strMime, strDownloadMime);
            // Create link element for the data. Firefox requires the link to
            // be in the body
            filename = filename + ".png";
            const link = document.createElement('a');
            link.style.display = "none";
            document.body.appendChild(link);
            link.download = filename;
            link.href = strData;
            // Force click the link and remove it afterwards.
            link.click();
            document.body.removeChild(link);
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
    /**
     * This will check if WegGL is available on the current browser.
     */
    webglAvailable() {
        const w = window;
        try {
            const canvas = document.createElement('canvas');
            return !!(w.WebGLRenderingContext && (canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl')));
        }
        catch (e) {
            return false;
        }
    }
    /**
     * This will setup the three.js renderer object. Uses WebGL by default, can
     * use a canvas fallback is WegGL is not available.
     */
    setupRenderer() {
        // Create the renderer. The "alpha: true" enables to set a background color.
        this.renderer = new THREE.WebGLRenderer({
            // Alpha channel is disabled whenever a non-opaque background is in
            // use. Performance optimization.
            alpha: this.rendererDefaults.background.opacity !== 1,
            // Antialiasing incurs a small performance penalty.
            antialias: this.rendererDefaults.antialias.enabled,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance'
        });
        // pixelRatio directly affects the number of pixels that the canvas is
        // rendering.
        this.renderer.setPixelRatio(window.devicePixelRatio * this.rendererDefaults.pixelRatioScale);
        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.rootElement.clientWidth, this.rootElement.clientHeight);
        this.renderer.setClearColor(this.rendererDefaults.background.color, this.rendererDefaults.background.opacity);
        this.rootElement.appendChild(this.renderer.domElement);
        // This is set so that multiple scenes can be used, see
        // http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs/12666937#12666937
        this.renderer.autoClear = false;
    }
    /**
     * This will setup the three.js renderer object. Uses WebGL by default, can
     * use a canvas fallback is WegGL is not available.
     */
    setBackgroundColor(color, opacity) {
        // Create the renderer. The "alpha: true" enables to set a background color.
        this.renderer.setClearColor(color, opacity);
    }
    /*
     * Used to setup and position the camera.
     */
    setupCamera() {
        const aspectRatio = this.rootElement.clientWidth / this.rootElement.clientHeight;
        const width = this.cameraWidth;
        const height = width / aspectRatio;
        this.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -100, 1000);
        this.camera.name = "camera";
        this.camera.position.z = 20;
    }
    /**
     * Used to setup a root DIV element that will contain the whole
     * visualization, and which will be placed inside the given target element.
     *
     * The root element should always fill the whole host element, and we try
     * to ensure this by setting width and height to 100%. The position is set
     * to relative, so that the child divs can be set relative to this root div
     * with absolute positioning.
     */
    setupRootElement() {
        this.rootElement = document.createElement("div");
        this.rootElement.style.width = "100%";
        this.rootElement.style.height = "100%";
        this.rootElement.style.position = "relative";
    }
    /**
     * Used to setup the DOM element where the viewer will be displayed.
     *
     * @param {any} hostElement The HTML element into which this viewer is loaded.
     * @param {boolean} resize Whether to resize the canvas to fit the new host.
     */
    changeHostElement(hostElement, resize = true) {
        // If no host element currently specified, don't do anything
        if (isNil(hostElement)) {
            return;
        }
        // If a previous target element is set, remove it
        if (this.hostElement) {
            while (this.hostElement.firstChild) {
                this.hostElement.removeChild(this.hostElement.firstChild);
            }
        }
        // Setup the new targetElement
        hostElement.appendChild(this.rootElement);
        if (resize) {
            this.fitCanvas();
        }
    }
    /**
     * Rotates the scenes.
     *
     * @param {number[][]} rotations The rotations as a list. Each rotation
     * should be an array containing four numbers: [x, y, z, angle]. E.g. [[1,
     * 0, 0, 90]] would apply a 90 degree rotation with respect to the
     * x-coordinate. If multiple rotations are specified, they will be applied
     * in the given order. Notice that these rotations are applied with respect
     * to a global coordinate system, not the coordinate system of the
     * structure. In this global coordinate system [1, 0, 0] points to the
     * right, [0, 1, 0] points upwards and [0, 0, 1] points away from the
     * screen. The rotations are applied in the given order.
     */
    rotate(rotations) {
        if (rotations === undefined) {
            return;
        }
        for (const r of rotations) {
            const basis = new THREE.Vector3(r[0], r[1], r[2]);
            basis.normalize();
            const angle = r[3] / 180 * Math.PI;
            for (const obj of this.objects) {
                this.rotateAroundWorldAxis(obj, basis, angle);
            }
        }
    }
    /**
     * Sets the rotation of all the scenes.
     *
     * @param {number[]} rotation The rotation as a list. Rotation should be an
     * array containing four numbers: [x, y, z, angle]. E.g. [1, 0, 0, 90] would
     * set a 90 degree rotation with respect to the x-coordinate.
     */
    setRotation(rotation) {
        const basis = new THREE.Vector3(rotation[0], rotation[1], rotation[2]);
        basis.normalize();
        const angle = rotation[3] / 180 * Math.PI;
        for (const obj of this.objects) {
            obj.setRotationFromAxisAngle(basis, angle);
        }
    }
    /**
     * Translates the objects.
     *
     * @param {number[][]} rotations The rotations as a list. Each rotation
     * should be an array containing four numbers: [x, y, z, angle]. E.g. [[1,
     * 0, 0, 90]] would apply a 90 degree rotation with respect to the
     * x-coordinate. If multiple rotations are specified, they will be applied
     * in the given order. Notice that these rotations are applied with respect
     * to a global coordinate system, not the coordinate system of the
     * structure. In this global coordinate system [1, 0, 0] points to the
     * right, [0, 1, 0] points upwards and [0, 0, 1] points away from the
     * screen. The rotations are applied in the given order.
     */
    setTranslation(translation) {
        this.translation = translation;
        for (const obj of this.objects) {
            obj.position.copy(translation);
        }
    }
    /**
     * Translates the objects.
     *
     * @param {number[][]} rotations The rotations as a list. Each rotation
     * should be an array containing four numbers: [x, y, z, angle]. E.g. [[1,
     * 0, 0, 90]] would apply a 90 degree rotation with respect to the
     * x-coordinate. If multiple rotations are specified, they will be applied
     * in the given order. Notice that these rotations are applied with respect
     * to a global coordinate system, not the coordinate system of the
     * structure. In this global coordinate system [1, 0, 0] points to the
     * right, [0, 1, 0] points upwards and [0, 0, 1] points away from the
     * screen. The rotations are applied in the given order.
     */
    translate(translation) {
        this.translation.add(translation);
        for (const obj of this.objects) {
            obj.position.add(translation);
        }
    }
    /**
     * Used to reset the original view.
     */
    saveCameraReset() {
        if (isNil(this.controlsObject)) {
            throw Error("Could not save camera reset as controls are not set. Please call the controls()-method first.");
        }
        this.controlsObject.saveReset();
    }
    /**
     * Used to reset the original view.
     */
    resetCamera() {
        if (isNil(this.controlsObject)) {
            throw Error("Could not reset as controls are not set. Please call the controls()-method first.");
        }
        this.controlsObject.reset();
        // For some reason a render is required here...
        this.render();
    }
    /**
     * Used to setup the controls that allow interacting with the visualization
     * with mouse.
     *
     * @param {Object} options An object containing the control options. See
     *   below for the subparameters.
     * @param {string} options.zoom.enabled Is zoom enabled
     * @param {string} options.zoom.speed Zoom speed
     * @param {string} options.rotation.enabled Is rotation enabled
     * @param {string} options.rotation.speed Rotation speed
     * @param {string} options.pan.enabled Is panning enabled
     * @param {string} options.pan.speed Pan speed
     * @param {string} options.resetOnDoubleClick Whether to reset the camera on double click.
     */
    controls(options) {
        // Merge with default options
        const optionsFinal = merge(cloneDeep(this.controlDefaults), cloneDeep(options));
        // Setup new controls object
        const controls = new OrthographicControls(this.camera, this.rootElement);
        controls.rotateSpeed = optionsFinal.rotation.speed;
        controls.rotationCenter = new THREE.Vector3();
        controls.zoomSpeed = optionsFinal.zoom.speed;
        controls.panSpeed = optionsFinal.pan.speed;
        controls.enableZoom = optionsFinal.zoom.enabled;
        controls.enablePan = optionsFinal.pan.enabled;
        controls.enableRotate = optionsFinal.rotation.enabled;
        controls.resetOnDoubleClick = optionsFinal.resetOnDoubleClick;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.25;
        controls.keys = [65, 83, 68];
        controls.addEventListener('change', this.render.bind(this));
        this.controlsObject = controls;
    }
    /**
     * Creates 8 corner points for the given cuboid.
     *
     * @param origin - The origin of the cuboid.
     * @param basis - The vectors that define the cuboid.
     */
    createCornerPoints(origin, basis) {
        const opposite = origin.clone().add(basis[0]).add(basis[1]).add(basis[2]);
        const vertices = [origin, opposite];
        for (let len = basis.length, i = 0; i < len; ++i) {
            // Corners close to origin
            vertices.push(origin.clone().add(basis[i].clone()));
            // Corners close to opposite point of origin
            vertices.push(opposite.clone().sub(basis[i].clone()));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        return geometry;
    }
    /**
     * Center the camera so that the the given points fit the view with the
     * given margin.
     */
    fitViewToPoints(points, margin) {
        // Make sure that all transforms are updated
        this.scenes.forEach((scene) => scene.updateMatrixWorld());
        // Project all 8 corners of the normalized cell into screen space and
        // see how the system should be scaled to fit into screen
        const canvas = this.rootElement;
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        const cornerPos = [];
        const nPos = points.length;
        // Default the zoom to 1 for the projection
        this.camera.zoom = 1;
        this.camera.updateProjectionMatrix();
        // Calculate margin size in screen space
        const screenOrigin = new THREE.Vector3(0, 0, 0);
        screenOrigin.project(this.camera);
        screenOrigin.x = Math.round((screenOrigin.x + 1) * canvasWidth / 2);
        screenOrigin.y = Math.round((-screenOrigin.y + 1) * canvasHeight / 2);
        screenOrigin.z = 0;
        const screenMargin = new THREE.Vector3(margin, margin, 0);
        screenMargin.project(this.camera);
        screenMargin.x = Math.round((screenMargin.x + 1) * canvasWidth / 2);
        screenMargin.y = Math.round((-screenMargin.y + 1) * canvasHeight / 2);
        screenMargin.sub(screenOrigin);
        screenMargin.x = Math.abs(screenMargin.x);
        screenMargin.y = Math.abs(screenMargin.y);
        screenMargin.z = 0;
        // Calculate the boundary positions in screen space
        for (let i = 0; i < nPos; ++i) {
            const screenPos = points[i].clone();
            screenPos.project(this.camera);
            screenPos.x = Math.round((screenPos.x + 1) * canvasWidth / 2);
            screenPos.y = Math.round((-screenPos.y + 1) * canvasHeight / 2);
            screenPos.z = 0;
            cornerPos.push(screenPos);
        }
        // Find the minimum and maximum in both screen dimensions
        let minX = cornerPos[0].x;
        let maxX = cornerPos[0].x;
        let minY = cornerPos[0].y;
        let maxY = cornerPos[0].y;
        for (let len = cornerPos.length, i = 0; i < len; ++i) {
            const pos = cornerPos[i];
            const x = pos.x;
            const y = pos.y;
            if (x > maxX) {
                maxX = x;
            }
            else if (x < minX) {
                minX = x;
            }
            if (y > maxY) {
                maxY = y;
            }
            else if (y < minY) {
                minY = y;
            }
        }
        minX -= screenMargin.x;
        maxX += screenMargin.x;
        minY -= screenMargin.y;
        maxY += screenMargin.y;
        // Determine new zoom that will ensure that all cornerpositions are
        // visible on screen, assuming that the zoom center is set to view
        // center.
        const centerX = (canvasWidth / 2);
        const centerY = (canvasHeight / 2);
        const zoomRight = centerX / Math.abs(maxX - centerX);
        const zoomLeft = centerX / Math.abs(minX - centerX);
        const zoomUp = centerY / Math.abs(minY - centerY);
        const zoomDown = centerY / Math.abs(maxY - centerY);
        const newZoom = Math.min(zoomRight, zoomLeft, zoomUp, zoomDown);
        this.camera.zoom = newZoom;
        this.camera.updateProjectionMatrix();
    }
    /*
     * Get the current zoom level for the visualization.
     */
    getZoom() {
        return this.camera.zoom;
    }
    /**
     * Sets the zoom level for the visualization.
     *
     * @param zoom - The wanted zoom level as a floating point number.
     */
    zoom(zoom) {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
    }
    /**
     * Resizes the WebGL canvas to the host element.
     */
    fitCanvas() {
        const aspectRatio = this.rootElement.clientWidth / this.rootElement.clientHeight;
        const width = this.cameraWidth;
        const height = width / aspectRatio;
        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.rootElement.clientWidth, this.rootElement.clientHeight);
        if (!isNil(this.controlsObject)) {
            this.controlsObject.handleResize();
        }
    }
    /**
     * Used to render all the scenes that are present. The scenes will be
     * rendered on top of each other, so make sure that they are in the right
     * order.
     *
     * This approach is copied from
     * http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs/12666937#12666937
     */
    render() {
        this.renderer.clear();
        for (let iScene = 0; iScene < this.scenes.length; ++iScene) {
            const scene = this.scenes[iScene];
            this.renderer.render(scene, this.camera);
            if (iScene !== this.scenes.length - 1) {
                this.renderer.clearDepth();
            }
        }
    }
    /**
     * Helper function for creating a cylinder mesh.
     *
     * @param pos1 - Start position
     * @param pos2 - End position
     * @param radius - Cylinder radius
     * @param material - Cylinder material
     */
    createCylinder(pos1, pos2, radius, nSegments, material) {
        const direction = new THREE.Vector3().subVectors(pos2, pos1);
        const dirLen = direction.length();
        const dirNorm = direction.clone().divideScalar(dirLen);
        const arrow = new THREE.ArrowHelper(dirNorm, pos1);
        const edgeGeometry = new THREE.CylinderGeometry(radius, radius, dirLen, nSegments);
        const edge = new THREE.Mesh(edgeGeometry, material);
        edge.rotation.copy(arrow.rotation.clone());
        edge.position.copy(new THREE.Vector3().addVectors(pos1, direction.multiplyScalar(0.5)));
        return edge;
    }
    /**
     * Helper function for creating a text sprite that lives in 3D space.
     *
     * @param pos1 - Start position
     * @param pos2 - End position
     * @param radius - Cylinder radius
     * @param material - Cylinder material
     */
    createLabel(position, label, color, fontFamily, fontSize, offset = undefined, strokeWidth = 0, strokeColor = "#000") {
        // Configure canvas
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        // Draw label
        const fontFactor = 0.90;
        ctx.fillStyle = color;
        ctx.font = `${fontFactor * size}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (strokeWidth > 0) {
            ctx.lineWidth = strokeWidth * size;
            ctx.strokeStyle = strokeColor;
            ctx.strokeText(label, size / 2, size / 2);
        }
        ctx.fillText(label, size / 2, size / 2);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(fontSize, fontSize, 1);
        // Apply offset
        if (offset === undefined) {
            offset = new THREE.Vector2(0, 0);
        }
        const trueOffset = new THREE.Vector2();
        trueOffset.addVectors(offset, new THREE.Vector2(0.5, 0.5));
        sprite.center.copy(trueOffset);
        const labelRoot = new THREE.Object3D();
        labelRoot.position.copy(position);
        labelRoot.add(sprite);
        return labelRoot;
    }
    /**
     * Rotate an object around an arbitrary axis in world space
     * @param obj - The Object3D to rotate
     * @param axis - The axis in world space
     * @param radians - The angle in radians
     */
    rotateAroundWorldAxis(obj, axis, radians) {
        const rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(obj.matrix); // pre-multiply
        obj.matrix = rotWorldMatrix;
        obj.rotation.setFromRotationMatrix(obj.matrix);
    }
    /**
     * Performs a coordinate transform:
     *
     * B*b = A*a
     * b = Bi*A*a
     *
     * @param A - The original basis matrix
     * @param a - Vector in original basis
     * @param Bi - Inverse of target basis matrix
     *
     * @return b - The original vector a in the target basis
     */
    coordinateTransform(A, Bi, a, copy = true) {
        const result = copy ? a.clone() : a;
        return result.applyMatrix3(A).applyMatrix3(Bi);
    }
    alignView(alignments, directions) {
        // Check alignment validity
        if (alignments === undefined) {
            return;
        }
        if (alignments.length > 2) {
            throw "At most two alignments can be performed.";
        }
        const alignedDirections = [];
        const rotate = (alignment) => {
            const direction = alignment[0];
            const target = alignment[1];
            let targetVector;
            switch (direction) {
                case "up":
                    targetVector = new THREE.Vector3(0, 1, 0);
                    break;
                case "down":
                    targetVector = new THREE.Vector3(0, -1, 0);
                    break;
                case "right":
                    targetVector = new THREE.Vector3(1, 0, 0);
                    break;
                case "left":
                    targetVector = new THREE.Vector3(-1, 0, 0);
                    break;
                case "front":
                    targetVector = new THREE.Vector3(0, 0, 1);
                    break;
                case "back":
                    targetVector = new THREE.Vector3(0, 0, -1);
                    break;
            }
            // Determine the top direction
            const finalVector = directions[target];
            for (const alignedDirection of alignedDirections) {
                finalVector[alignedDirection] = 0;
            }
            // Rotate the scene according to the selected top direction
            if (finalVector.length() > 1e-8) {
                const quaternion = new THREE.Quaternion().setFromUnitVectors(finalVector.clone().normalize(), targetVector);
                // Rotate the given directions so that their direction will be
                // correct for the next aligment
                for (const direction in directions) {
                    directions[direction].applyQuaternion(quaternion);
                }
                // Rotate the objects
                for (const obj of this.objects) {
                    obj.applyQuaternion(quaternion);
                    obj.updateMatrixWorld();
                }
                if (direction == "right" || direction == "left") {
                    alignedDirections.push("x");
                }
                else if (direction == "up" || direction == "down") {
                    alignedDirections.push("y");
                }
                else if (direction == "front" || direction == "back") {
                    alignedDirections.push("z");
                }
            }
        };
        for (const alignment of alignments) {
            rotate(alignment);
        }
    }
}
