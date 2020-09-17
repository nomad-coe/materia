import { OrthographicControls } from "./orthographiccontrols";
import { Mesh, Object3D, WebGLRenderer, PCFSoftShadowMap, OrthographicCamera, ArrowHelper, Matrix4, Vector2, Vector3, Texture, CylinderGeometry, Sprite, SpriteMaterial, Geometry, Scene, } from "three/build/three.module.js";
/**
 * Abstract base class for visualizing 3D scenes with three.js.
 */
export class Viewer {
    /**
     * @param {Object} hostElement is the html element where the
     *     visualization canvas will be appended.
     * @param {Object} options An object that can hold custom settings for the viewer.
     */
    constructor(hostElement, options = {}) {
        this.hostElement = hostElement;
        this.scenes = []; // A list of scenes that are rendered
        this.cameraWidth = 10.0; // The default "width" of the camera
        this.options = {}; // Options for the viewer. Can be e.g. used to control which settings are enabled
        this.setOptions(options);
        this.setupRootElement();
        this.setupRenderer();
        this.setupScenes();
        this.setupCamera();
        this.setupControls();
        this.changeHostElement(hostElement, false, false);
        if (this.options.view.autoResize) {
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
        }
    }
    setOptions(options) {
        // The default settings object
        const defaultOptions = {
            controls: {
                enableZoom: true,
                enableRotate: true,
                enablePan: true,
                panSpeed: 10,
                zoomSpeed: 0.2,
                rotateSpeed: 2.5,
                zoomLevel: 1,
            },
            view: {
                autoFit: true,
                autoResize: true,
                fitMargin: 0.5,
            },
            renderer: {
                background: {
                    color: "#ffffff",
                    opacity: 0,
                },
                shadows: {
                    enabled: false,
                },
            }
        };
        // Save custom settings
        this.fillOptions(options, defaultOptions);
        this.options = defaultOptions;
    }
    /**
     * Used to recursively fill the target options with options stored in the
     * source object.
     */
    fillOptions(source, target) {
        // Overrride with settings from user and child class
        function eachRecursive(source, target) {
            for (const k in source) {
                // Find variable in default settings
                if (source[k] !== null && Object.prototype.toString.call(source[k]) === "[object Object]") {
                    // If the current level is not defined in the target, it is
                    // initialized with empty object.
                    if (target[k] === undefined) {
                        target[k] = {};
                    }
                    eachRecursive(source[k], target[k]);
                }
                else {
                    // We store each leaf property into the default settings
                    target[k] = source[k];
                }
            }
        }
        eachRecursive(source, target);
    }
    /**
     * This function will set up all the basics for visualization: scenes,
     * lights, camera and controls.
     */
    setup() {
        // Reconstruct the visualization
        this.setupScenes();
        this.setupLights();
        this.setupCamera();
        this.setupControls();
    }
    /*
     * Used to setup the scenes. This default implementation will create a
     * single scene. Override this function to create additional scenes and
     * push them all to the 'scenes' attribute.
     */
    setupScenes() {
        this.scenes = [];
        this.scene = new Scene();
        this.scenes.push(this.scene);
    }
    /*
     * Clears the entire visualization.
     */
    clear() {
        this.clearScenes();
        this.scenes = null;
        this.controls = null;
        this.camera = null;
        this.cornerPoints = null;
    }
    /*
     * This function will clear everything inside the scenes. This should
     * ensure that memory is not leaked. Cameras, controls and lights are not
     * part of the scene, so they are reset elsewhere.
     */
    clearScenes() {
        for (let iScene = 0; iScene < this.scenes.length; ++iScene) {
            let scene = this.scenes[iScene];
            scene.traverse(function (node) {
                let geometry = node.geometry;
                let material = node.material;
                let texture = node.texture;
                if (geometry) {
                    geometry.dispose();
                }
                if (material) {
                    material.dispose();
                }
                if (texture) {
                    texture.dispose();
                }
            });
            while (scene.children.length) {
                let child = scene.children[0];
                scene.remove(child);
            }
        }
    }
    /**
     * Can be used to download the current visualization as a jpg-image to the
     * browser's download location.
     */
    takeScreenShot(filename) {
        let imgData;
        try {
            // Create headers and actual image contents
            let strMime = "image/png";
            let strDownloadMime = "image/octet-stream";
            this.render();
            imgData = this.renderer.domElement.toDataURL(strMime);
            let strData = imgData.replace(strMime, strDownloadMime);
            // Create link element for the data. Firefox requires the link to
            // be in the body
            filename = filename + ".png";
            let link = document.createElement('a');
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
        let w = window;
        try {
            let canvas = document.createElement('canvas');
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
        if (this.webglAvailable()) {
            this.renderer = new WebGLRenderer({
                alpha: true,
                antialias: true,
            });
        }
        else {
            console.log("WebGL is not supported on this browser, cannot display structure.");
        }
        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.setSize(this.rootElement.clientWidth, this.rootElement.clientHeight);
        this.renderer.setClearColor(this.options.renderer.background.color, this.options.renderer.background.opacity);
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
        let aspectRatio = this.rootElement.clientWidth / this.rootElement.clientHeight;
        let width = this.cameraWidth;
        let height = width / aspectRatio;
        this.camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -100, 1000);
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
     */
    changeHostElement(hostElement, refit = true, render = true) {
        // If no host element currently specified, don't do anything
        if (hostElement === undefined) {
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
        this.resizeCanvasToHostElement();
        if (refit) {
            this.fitToCanvas();
        }
        if (render) {
            this.render();
        }
    }
    /**
     * Used to reset the original view.
     */
    saveReset() {
        this.controls.saveReset();
    }
    /**
     * Used to reset the original view.
     */
    reset() {
        this.controls.reset();
    }
    /*
     * Used to setup the controls that allow interacting with the visualization
     * with mouse.
     */
    setupControls() {
        let controls = new OrthographicControls(this.camera, this.rootElement);
        controls.rotateSpeed = this.options.controls.rotateSpeed;
        controls.rotationCenter = new Vector3();
        controls.zoomSpeed = this.options.controls.zoomSpeed;
        controls.panSpeed = this.options.controls.panSpeed;
        controls.enableZoom = this.options.controls.enableZoom;
        controls.enablePan = this.options.controls.enablePan;
        controls.enableRotate = this.options.controls.enableRotate;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.25;
        controls.keys = [65, 83, 68];
        controls.addEventListener('change', this.render.bind(this));
        this.controls = controls;
    }
    /**
     * Creates 8 corner points for the given cuboid.
     *
     * @param origin - The origin of the cuboid.
     * @param basis - The vectors that define the cuboid.
     */
    createCornerPoints(origin, basis) {
        var geometry = new Geometry();
        geometry.vertices.push(origin);
        let opposite = origin.clone().add(basis[0]).add(basis[1]).add(basis[2]);
        geometry.vertices.push(opposite);
        for (let len = basis.length, i = 0; i < len; ++i) {
            // Corners close to origin
            let position1 = origin.clone().add(basis[i].clone());
            geometry.vertices.push(position1);
            // Corners close to opposite point of origin
            let position2 = opposite.clone().sub(basis[i].clone());
            geometry.vertices.push(position2);
        }
        return geometry;
    }
    /**
     * This will automatically fit the structure to the given rendering area.
     * Will also leave a small margin.
     */
    fitToCanvas() {
        // If cornerpoints have not yet been defined, do nothing
        if (this.cornerPoints === undefined) {
            return;
        }
        // Make sure that all transforms are updated
        this.scenes.forEach((scene) => scene.updateMatrixWorld());
        // Project all 8 corners of the normalized cell into screen space and
        // see how the system should be scaled to fit into screen
        let canvas = this.rootElement;
        let canvasWidth = canvas.clientWidth;
        let canvasHeight = canvas.clientHeight;
        let cornerPos = [];
        //console.log(canvas.clientWidth)
        //console.log(canvas.clientHeight)
        // Figure out the center in order to add margins in right direction
        let centerPos = new Vector3();
        for (let len = this.cornerPoints.geometry.vertices.length, i = 0; i < len; ++i) {
            let screenPos = this.cornerPoints.geometry.vertices[i].clone();
            this.cornerPoints.localToWorld(screenPos);
            centerPos.add(screenPos);
        }
        for (let len = this.cornerPoints.geometry.vertices.length, i = 0; i < len; ++i) {
            let screenPos = this.cornerPoints.geometry.vertices[i].clone();
            //console.log(screenPos)
            this.cornerPoints.localToWorld(screenPos);
            // Default the zoom to 1 for the projection
            let oldZoom = this.camera.zoom;
            this.camera.zoom = this.options.controls.zoomLevel;
            this.camera.updateProjectionMatrix();
            // Figure out the direction from center
            let diff = centerPos.sub(screenPos);
            diff.project(this.camera);
            let right = diff.x < 0 ? true : false;
            let up = diff.y < 0 ? true : false;
            // Map to corner coordinates to
            screenPos.project(this.camera);
            //console.log(screenPos)
            // Add a margin
            let margin = this.options.view.fitMargin;
            let cameraUp = new Vector3(0, margin, 0);
            let cameraRight = new Vector3(margin, 0, 0);
            cameraUp.applyQuaternion(this.camera.quaternion);
            cameraRight.applyQuaternion(this.camera.quaternion);
            if (up) {
                screenPos.add(cameraUp);
            }
            else {
                screenPos.sub(cameraUp);
            }
            if (right) {
                screenPos.add(cameraRight);
            }
            else {
                screenPos.sub(cameraRight);
            }
            // Map to 2D screen space
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
            let pos = cornerPos[i];
            let x = pos.x;
            let y = pos.y;
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
        // Determine new zoom that will ensure that all cornerpositions are
        // visible on screen, assuming that the zoom center is set to view
        // center.
        let centerX = (canvasWidth / 2);
        let centerY = (canvasHeight / 2);
        let zoomRight = centerX / Math.abs(maxX - centerX);
        let zoomLeft = centerX / Math.abs(minX - centerX);
        let zoomUp = centerY / Math.abs(minY - centerY);
        let zoomDown = centerY / Math.abs(maxY - centerY);
        let newZoom = Math.min(zoomRight, zoomLeft, zoomUp, zoomDown);
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
    setZoom(zoom) {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
    }
    /*
     * Callback function that is invoked when the window is resized.
     */
    resizeCanvasToHostElement() {
        let aspectRatio = this.rootElement.clientWidth / this.rootElement.clientHeight;
        let width = this.cameraWidth;
        let height = width / aspectRatio;
        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.rootElement.clientWidth, this.rootElement.clientHeight);
        this.controls.handleResize();
        this.render();
    }
    onWindowResize() {
        this.resizeCanvasToHostElement();
        if (this.options.view.autoFit) {
            this.fitToCanvas();
        }
        this.render();
    }
    /*
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
            let scene = this.scenes[iScene];
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
        var direction = new Vector3().subVectors(pos2, pos1);
        let dirLen = direction.length();
        let dirNorm = direction.clone().divideScalar(dirLen);
        var arrow = new ArrowHelper(dirNorm, pos1);
        var edgeGeometry = new CylinderGeometry(radius, radius, dirLen, nSegments, 0);
        var edge = new Mesh(edgeGeometry, material);
        edge.rotation.copy(arrow.rotation.clone());
        edge.position.copy(new Vector3().addVectors(pos1, direction.multiplyScalar(0.5)));
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
        const texture = new Texture(canvas);
        texture.needsUpdate = true;
        const material = new SpriteMaterial({ map: texture });
        const sprite = new Sprite(material);
        sprite.scale.set(fontSize, fontSize, 1);
        // Apply offset
        if (offset === undefined) {
            offset = new Vector2(0, 0);
        }
        const trueOffset = new Vector2();
        trueOffset.addVectors(offset, new Vector2(0.5, 0.5));
        sprite.center.copy(trueOffset);
        const labelRoot = new Object3D();
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
        let rotWorldMatrix = new Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(obj.matrix); // pre-multiply
        obj.matrix = rotWorldMatrix;
        obj.rotation.setFromRotationMatrix(obj.matrix);
    }
}
