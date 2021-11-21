import * as THREE from "three";
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
    cameraWidth: number;
    rootElement: any;
    options: any;
    /**
     * @param {Object} hostElement is the html element where the
     *     visualization canvas will be appended.
     * @param {Object} options An object that can hold custom settings for the viewer.
     */
    constructor(hostElement: any, options?: {});
    setOptions(options: Record<string, unknown>): void;
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
    abstract setupLights(): void;
    abstract getCornerPoints(): any;
    setupScenes(): void;
    clear(): void;
    clearScenes(): void;
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
    createCornerPoints(origin: THREE.Vector3, basis: THREE.Vector3[]): THREE.BufferGeometry;
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
    alignView(alignments: string[][], directions: Object, objects: THREE.Object3D[], render?: boolean): void;
}
