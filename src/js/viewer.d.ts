import * as THREE from "three";
/**
 * Abstract base class for visualizing 3D scenes with three.js.
 */
export declare abstract class Viewer {
    hostElement: any;
    camera: any;
    renderer: any;
    controlsObject: any;
    scenes: THREE.Scene[];
    objects: THREE.Object3D[];
    cameraWidth: number;
    rootElement: any;
    options: any;
    translation: THREE.Vector3;
    controlDefaults: any;
    rendererDefaults: any;
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
    constructor(hostElement: any, options?: any);
    /**
     * Saves the default options.
    */
    abstract setOptions(options: any): void;
    abstract setupLights(): void;
    abstract setupScenes(): void;
    /**
     * Can be used to download the current visualization as a jpg-image to the
     * browser's download location.
     */
    takeScreenShot(filename: string): void;
    /**
     * This will check if WegGL is available on the current browser.
     */
    webglAvailable(): boolean;
    /**
     * This will setup the three.js renderer object. Uses WebGL by default, can
     * use a canvas fallback is WegGL is not available.
     */
    setupRenderer(): void;
    /**
     * This will setup the three.js renderer object. Uses WebGL by default, can
     * use a canvas fallback is WegGL is not available.
     */
    setBackgroundColor(color: string, opacity: number): void;
    setupCamera(): void;
    /**
     * Used to setup a root DIV element that will contain the whole
     * visualization, and which will be placed inside the given target element.
     *
     * The root element should always fill the whole host element, and we try
     * to ensure this by setting width and height to 100%. The position is set
     * to relative, so that the child divs can be set relative to this root div
     * with absolute positioning.
     */
    setupRootElement(): void;
    /**
     * Used to setup the DOM element where the viewer will be displayed.
     *
     * @param {any} hostElement The HTML element into which this viewer is loaded.
     * @param {boolean} resize Whether to resize the canvas to fit the new host.
     */
    changeHostElement(hostElement: any, resize?: boolean): void;
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
    rotate(rotations: number[][]): void;
    /**
     * Sets the rotation of all the scenes.
     *
     * @param {number[]} rotation The rotation as a list. Rotation should be an
     * array containing four numbers: [x, y, z, angle]. E.g. [1, 0, 0, 90] would
     * set a 90 degree rotation with respect to the x-coordinate.
     */
    setRotation(rotation: number[]): void;
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
    setTranslation(translation: number[]): void;
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
    translate(translation: number[]): void;
    /**
     * Used to reset the original view.
     */
    saveCameraReset(): void;
    /**
     * Used to reset the original view.
     */
    resetCamera(): void;
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
    controls(options: any): void;
    /**
     * Creates 8 corner points for the given cuboid.
     *
     * @param origin - The origin of the cuboid.
     * @param basis - The vectors that define the cuboid.
     */
    createCornerPoints(origin: THREE.Vector3, basis: THREE.Vector3[]): THREE.BufferGeometry;
    /**
     * Center the camera so that the the given points fit the view with the
     * given margin.
     */
    fitViewToPoints(points: Array<THREE.Vector3>, margin: number): void;
    getZoom(): number;
    /**
     * Sets the zoom level for the visualization.
     *
     * @param zoom - The wanted zoom level as a floating point number.
     */
    zoom(zoom: number): void;
    /**
     * Resizes the WebGL canvas to the host element.
     */
    fitCanvas(): void;
    /**
     * Used to render all the scenes that are present. The scenes will be
     * rendered on top of each other, so make sure that they are in the right
     * order.
     *
     * This approach is copied from
     * http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs/12666937#12666937
     */
    render(): void;
    /**
     * Helper function for creating a cylinder mesh.
     *
     * @param pos1 - Start position
     * @param pos2 - End position
     * @param radius - Cylinder radius
     * @param material - Cylinder material
     */
    createCylinder(pos1: any, pos2: any, radius: any, nSegments: any, material: any): any;
    /**
     * Helper function for creating a text sprite that lives in 3D space.
     *
     * @param pos1 - Start position
     * @param pos2 - End position
     * @param radius - Cylinder radius
     * @param material - Cylinder material
     */
    createLabel(position: THREE.Vector3, label: string, color: string, fontFamily: string, fontSize: number, offset?: THREE.Vector2, strokeWidth?: number, strokeColor?: string): THREE.Object3D;
    /**
     * Rotate an object around an arbitrary axis in world space
     * @param obj - The Object3D to rotate
     * @param axis - The axis in world space
     * @param radians - The angle in radians
     */
    rotateAroundWorldAxis(obj: any, axis: any, radians: any): void;
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
    coordinateTransform(A: THREE.Matrix3, Bi: THREE.Matrix3, a: THREE.Vector3, copy?: boolean): THREE.Vector3;
    alignView(alignments: string[][], directions: any): void;
}
