import * as THREE from 'three';
/**
 * Abstract base class for visualizing 3D scenes with three.js.
 */
export declare abstract class Viewer {
    hostElement: any;
    camera: any;
    renderer: any;
    controls: any;
    scene: any;
    scenes: any[];
    cornerPoints: any;
    cameraWidth: number;
    rootElement: any;
    options: any;
    /**
     * @param {Object} hostElement is the html element where the
     *     visualization canvas will be appended.
     * @param {Object} options An object that can hold custom settings for the viewer.
     */
    constructor(hostElement: any, options?: {});
    setOptions(options: Object): void;
    /**
     * Used to recursively fill the target options with options stored in the
     * source object.
     */
    fillOptions(source: object, target: object): void;
    /**
     * This function will set up all the basics for visualization: scenes,
     * lights, camera and controls.
     */
    setup(): void;
    /**
     * Loads visuzalization data from a JSON url.
     *
     * @param {string} url Path to the json resource.
     */
    /**
     * This function can be used to setup any static assets in the
     * constructore, like dat.gui settings window.
     */
    setupStatic(): void;
    abstract setupLights(): void;
    setupScenes(): void;
    clear(): void;
    clearScenes(): void;
    /**
     * Can be used to download the current visualization as a jpg-image to the
     * browser's download location.
     */
    takeScreenShot(filename: any): void;
    /**
     * This will check if WegGL is available on the current browser.
     */
    webglAvailable(): boolean;
    /**
     * This will setup the three.js renderer object. Uses WebGL by default, can
     * use a canvas fallback is WegGL is not available.
     */
    setupRenderer(): void;
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
     */
    changeHostElement(hostElement: any, refit?: boolean, render?: boolean): void;
    /**
     * Used to reset the original view.
     */
    saveReset(): void;
    /**
     * Used to reset the original view.
     */
    reset(): void;
    setupControls(): void;
    /**
     * Creates 8 corner points for the given cuboid.
     *
     * @param origin - The origin of the cuboid.
     * @param basis - The vectors that define the cuboid.
     */
    createCornerPoints(origin: any, basis: any): THREE.Geometry;
    /**
     * This will automatically fit the structure to the given rendering area.
     * Will also leave a small margin.
     */
    fitToCanvas(): void;
    getZoom(): any;
    /**
     * Sets the zoom level for the visualization.
     *
     * @param zoom - The wanted zoom level as a floating point number.
     */
    setZoom(zoom: any): void;
    resizeCanvasToHostElement(): void;
    onWindowResize(): void;
    render(): void;
    /**
     * Helper function for creating a cylinder mesh.
     *
     * @param pos1 - Start position
     * @param pos2 - End position
     * @param radius - Cylinder radius
     * @param material - Cylinder material
     */
    createCylinder(pos1: any, pos2: any, radius: any, nSegments: any, material: any): THREE.Mesh<THREE.CylinderGeometry, any>;
    /**
     * Rotate an object around an arbitrary axis in world space
     * @param obj - The THREE.Object3D to rotate
     * @param axis - The axis in world space
     * @param radians - The angle in radians
     */
    rotateAroundWorldAxis(obj: any, axis: any, radians: any): void;
}
