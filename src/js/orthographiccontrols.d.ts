export declare class OrthographicControls {
    enabled: boolean;
    enablePan: boolean;
    enableZoom: boolean;
    enableRotate: boolean;
    resetOnDoubleClick: boolean;
    staticMoving: boolean;
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
    dynamicDampingFactor: number;
    rotationCenter: any;
    target: any;
    object: any;
    minDistance: number;
    maxDistance: number;
    domElement: any;
    keys: any;
    screen: any;
    target0: any;
    rotationCenter0: any;
    position0: any;
    up0: any;
    zoom0: number;
    this: any;
    _state: number;
    _prevState: any;
    _eye: any;
    _movePrev: any;
    _moveCurr: any;
    _lastAxis: any;
    _lastAngle: any;
    _zoomStart: any;
    _zoomEnd: any;
    _zoomed: boolean;
    _touchZoomDistanceStart: any;
    _touchZoomDistanceEnd: any;
    _lastPosition: any;
    _listeners: any;
    _panEnd: any;
    _panStart: any;
    constructor(object: any, domElement: any);
    handleResize(): void;
    handleEvent(event: any): void;
    getMouseOnScreen(pageX: any, pageY: any): any;
    getMouseOnCircle(pageX: any, pageY: any): any;
    /**
      * Used to trigger rotation after a move has been detected and stored in
      * this.movePrev and this.moveCurr.
      */
    rotateCamera(): void;
    zoomCamera(): void;
    panCamera(): void;
    checkDistances(): void;
    /**
      * Used to update the controlled object after the user has manipulated the
      * scene. Will also request a new render if the manipulation has changed
      * the scene.
      */
    update(): void;
    /**
     * Saves the current configuration as the reset configuration.
     */
    saveReset(): void;
    /**
     * Loads the last saved reset state.
     */
    reset(): void;
    dispose(): void;
    mousedown(event: any): void;
    mousemove(event: any): void;
    mouseup(event: any): void;
    dblclick(event: any): void;
    mousewheel(event: any): void;
    touchstart(event: any): void;
    touchmove(event: any): void;
    touchend(event: any): void;
    contextmenu(event: any): void;
    addEventListener(type: any, listener: any): void;
    hasEventListener(type: any, listener: any): boolean;
    removeEventListener(type: any, listener: any): void;
    dispatchEvent(event: any): void;
}
