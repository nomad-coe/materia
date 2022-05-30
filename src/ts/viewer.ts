import { OrthographicControls } from "./orthographiccontrols"
import { isArray, merge, mergeWith, cloneDeep } from "lodash"
import * as THREE from "three"
/**
 * Abstract base class for visualizing 3D scenes with three.js.
 */
export abstract class Viewer {
    camera:any;                           // three.js camera
    renderer:any;                         // three.js renderer object
    controls:any;                         // Controller object for handling mouse interaction with the system
    scene:any;                            // The default scene
    scenes:any[] = [];                    // A list of scenes that are rendered
    cameraWidth = 10.0;                   // The default "width" of the camera
    rootElement:any;                      // A root html element that contains all visualization components
    options:any = {};                     // Options for the viewer. Can be e.g. used to control which settings are enabled

    /**
     * @param {Object} hostElement is the html element where the
     *     visualization canvas will be appended.
     * @param {Object} options An object that can hold custom settings for the viewer.
     */
    constructor(public hostElement, options={}) {
        // Check that OpenGL is available, otherwise throw an exception
        if ( !this.webglAvailable()  ) {
            throw Error("WebGL is not supported on this browser, cannot display viewer.")
        }
        this.setOptions(options);
        this.setupRootElement();
        this.setupRenderer();
        this.setupScenes();
        this.setupCamera();
        this.setupControls()
        this.changeHostElement(hostElement, false, false);
        if (this.options.view.autoResize) {
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
        }
    }

    setOptions(options: Record<string, unknown>): void {
        // The default settings object
        const defaultOptions =  {
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
        }

        // Save custom settings
        this.fillOptions(options, defaultOptions);
        this.options = defaultOptions;
    }

    /**
     * Used to recursively fill the target options with options stored in the
     * source object.
     */
    fillOptions(source: any, target: any): void {
        return merge(target, source)
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
     * Used to setup the lighting.
     */
    abstract setupLights(): void;

    /*
     * Used to query the corner points for the current view. This set of points
     * determines the visualization boundary.
     */
    abstract getCornerPoints();

    /*
     * Used to setup the scenes. This default implementation will create a
     * single scene. Override this function to create additional scenes and
     * push them all to the 'scenes' attribute.
     */
    setupScenes(): void {
        this.scenes = [];
        this.scene = new THREE.Scene();
        this.scenes.push(this.scene);
    }

    /*
     * Clears the entire visualization.
     */
    clear(): void {
        this.clearScenes();
        this.scenes = null;
        this.controls = null;
        this.camera = null;
    }
    /*
     * This function will clear everything inside the scenes. This should
     * ensure that memory is not leaked. Cameras, controls and lights are not
     * part of the scene, so they are reset elsewhere.
     */
    clearScenes(): void {
        for (let iScene=0; iScene<this.scenes.length; ++iScene) {
            const scene = this.scenes[iScene];
            scene.traverse( function(node) {

                const geometry = node.geometry;
                const material = node.material;
                const texture = node.texture;
                if (geometry) {
                    geometry.dispose();
                }
                if (material) {
                    material.dispose();
                }
                if (texture) {
                    texture.dispose();
                }
            })
            while (scene.children.length)
            {
                const child = scene.children[0];
                scene.remove(child);
            }
        }
    }

    /**
     * Can be used to download the current visualization as a jpg-image to the
     * browser's download location.
     */
    takeScreenShot(filename: string): void {
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
        } catch (e) {
            console.log(e);
            return;
        }
    }

    /**
     * This will check if WegGL is available on the current browser.
     */
    webglAvailable() : boolean {
        const w:any = window;
		try {
			const canvas = document.createElement( 'canvas' );
			return !!( w.WebGLRenderingContext && (
				canvas.getContext( 'webgl' ) ||
				canvas.getContext( 'experimental-webgl' ) )
			);
		} catch ( e ) {
			return false;
		}
	}

    /**
     * This will setup the three.js renderer object. Uses WebGL by default, can
     * use a canvas fallback is WegGL is not available.
     */
    setupRenderer() : void {
        // Create the renderer. The "alpha: true" enables to set a background color.
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    setBackgroundColor(color:string, opacity:number): void {
        // Create the renderer. The "alpha: true" enables to set a background color.
        this.renderer.setClearColor(color, opacity);
    }

    /*
     * Used to setup and position the camera.
     */
    setupCamera() : void {
        const aspectRatio = this.rootElement.clientWidth/this.rootElement.clientHeight;
        const width = this.cameraWidth;
        const height = width/aspectRatio;
        this.camera = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, -100, 1000 );
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
    setupRootElement() : void {
        this.rootElement = document.createElement("div");
        this.rootElement.style.width = "100%"
        this.rootElement.style.height = "100%"
        this.rootElement.style.position = "relative"
    }

    /**
     * Used to setup the DOM element where the viewer will be displayed.
     */
    changeHostElement(hostElement:any, refit=true, render=true) : void {

        // If no host element currently specified, don't do anything
        if (hostElement === undefined) {
            return
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
            this.fitViewToContent();
        }
        if (render) {
            this.render();
        }
    }

    /**
     * Used to reset the original view.
     */
    saveCameraReset() : void {
        this.controls.saveReset();
    }

    /**
     * Used to reset the original view.
     */
    resetCamera() : void {
        this.controls.reset();
        // For some reason a render is required here...
        this.render()
    }

    /*
     * Used to setup the controls that allow interacting with the visualization
     * with mouse.
     */
    setupControls() : void {
        const controls = new OrthographicControls(this.camera, this.rootElement);
        controls.rotateSpeed = this.options.controls.rotateSpeed;
        controls.rotationCenter = new THREE.Vector3();
        controls.zoomSpeed = this.options.controls.zoomSpeed;
        controls.panSpeed = this.options.controls.panSpeed;

        controls.enableZoom = this.options.controls.enableZoom;
        controls.enablePan = this.options.controls.enablePan;
        controls.enableRotate = this.options.controls.enableRotate;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.25;
        controls.keys = [ 65, 83, 68 ];
        controls.addEventListener('change', this.render.bind(this) );
        this.controls = controls;
    }

    /**
     * Creates 8 corner points for the given cuboid.
     *
     * @param origin - The origin of the cuboid.
     * @param basis - The vectors that define the cuboid.
     */
    createCornerPoints(origin: THREE.Vector3, basis: THREE.Vector3[]): THREE.BufferGeometry {
        const opposite = origin.clone().add(basis[0]).add(basis[1]).add(basis[2])
        const vertices = [origin, opposite]

        for (let len=basis.length, i=0; i<len; ++i) {
            // Corners close to origin
            vertices.push(origin.clone().add(basis[i].clone()))

            // Corners close to opposite point of origin
            vertices.push(opposite.clone().sub(basis[i].clone()))
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(vertices)
        return geometry
    }

    /**
     * Center the camera so that the the given points fit the view with the
     * given margin.
     */
    fitViewToPoints(points:Array<THREE.Vector3>, margin:number, render=true): void {
        // Make sure that all transforms are updated
        this.scenes.forEach((scene) => scene.updateMatrixWorld());

        // Project all 8 corners of the normalized cell into screen space and
        // see how the system should be scaled to fit into screen
        const canvas = this.rootElement;
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        const cornerPos = [];
        const nPos = points.length

        // Default the zoom to 1 for the projection
        this.camera.zoom = this.options.controls.zoomLevel;
        this.camera.updateProjectionMatrix();

        // Calculate margin size in screen space
        const screenOrigin = new THREE.Vector3(0, 0, 0);
        screenOrigin.project( this.camera );
        screenOrigin.x = Math.round( (   screenOrigin.x + 1 ) * canvasWidth  / 2 );
        screenOrigin.y = Math.round( ( - screenOrigin.y + 1 ) * canvasHeight / 2 );
        screenOrigin.z = 0;
        const screenMargin = new THREE.Vector3(margin, margin, 0);
        screenMargin.project( this.camera );
        screenMargin.x = Math.round( (   screenMargin.x + 1 ) * canvasWidth  / 2 );
        screenMargin.y = Math.round( ( - screenMargin.y + 1 ) * canvasHeight / 2 );
        screenMargin.sub(screenOrigin)
        screenMargin.x = Math.abs(screenMargin.x)
        screenMargin.y = Math.abs(screenMargin.y)
        screenMargin.z = 0;

        // Calculate the boundary positions in screen space
        for (let i=0; i < nPos; ++i) {
            const screenPos = points[i].clone();
            screenPos.project( this.camera );
            screenPos.x = Math.round( (   screenPos.x + 1 ) * canvasWidth  / 2 );
            screenPos.y = Math.round( ( - screenPos.y + 1 ) * canvasHeight / 2 );
            screenPos.z = 0;
            cornerPos.push(screenPos);
        }

        // Find the minimum and maximum in both screen dimensions
        let minX = cornerPos[0].x;
        let maxX = cornerPos[0].x;
        let minY = cornerPos[0].y;
        let maxY = cornerPos[0].y;
        for (let len=cornerPos.length, i=0; i<len; ++i) {
            const pos = cornerPos[i];
            const x =  pos.x;
            const y =  pos.y;
            if (x > maxX) {
                maxX = x;
            } else if (x < minX) {
                minX = x;
            }
            if (y > maxY) {
                maxY = y;
            } else if (y < minY) {
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
        const centerX = (canvasWidth/2)
        const centerY = (canvasHeight/2)
        const zoomRight = centerX/Math.abs(maxX-centerX)
        const zoomLeft = centerX/Math.abs(minX-centerX)
        const zoomUp = centerY/Math.abs(minY-centerY)
        const zoomDown = centerY/Math.abs(maxY-centerY)
        const newZoom = Math.min(zoomRight, zoomLeft, zoomUp, zoomDown)
        this.camera.zoom = newZoom
        this.camera.updateProjectionMatrix();
        render && this.render()
    }

    /**
     * This will automatically fit the structure to the given rendering area.
     * Will also leave a small margin.
     */
    fitViewToContent(render=true): void {
        const {points, margin} = this.getCornerPoints()
        const finalMargin = this.options.view.fitMargin + margin
        this.fitViewToPoints(points, finalMargin, render)
    }

    /*
     * Get the current zoom level for the visualization.
     */
    getZoom() : number {
        return this.camera.zoom;
    }

    /**
     * Sets the zoom level for the visualization.
     *
     * @param zoom - The wanted zoom level as a floating point number.
     */
    setZoom(zoom:number) : void {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
    }

    /*
     * Callback function that is invoked when the window is resized.
     */
    resizeCanvasToHostElement() : void {
        const aspectRatio = this.rootElement.clientWidth/this.rootElement.clientHeight;
        const width = this.cameraWidth;
        const height = width/aspectRatio;
        this.camera.left = -width/2
        this.camera.right = width/2
        this.camera.top = height/2
        this.camera.bottom = -height/2
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.rootElement.clientWidth, this.rootElement.clientHeight);
        this.controls.handleResize();
        this.render();
    }

    onWindowResize() : void {
        this.resizeCanvasToHostElement();
        if (this.options.view.autoFit) {
            this.fitViewToContent();
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
    render() : void {
        this.renderer.clear();
        for (let iScene=0; iScene<this.scenes.length; ++iScene) {
            const scene = this.scenes[iScene];
            this.renderer.render(scene, this.camera);
            if (iScene !== this.scenes.length -1) {
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
        const direction = new THREE.Vector3().subVectors( pos2, pos1 );
        const dirLen = direction.length();
        const dirNorm = direction.clone().divideScalar(dirLen);
        const arrow = new THREE.ArrowHelper( dirNorm, pos1 );
        const edgeGeometry = new THREE.CylinderGeometry(radius, radius, dirLen, nSegments);
        const edge = new THREE.Mesh(edgeGeometry, material);
        edge.rotation.copy(arrow.rotation.clone());
        edge.position.copy(new THREE.Vector3().addVectors( pos1, direction.multiplyScalar(0.5) ));

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
    createLabel(
        position:THREE.Vector3,
        label:string,
        color:string,
        fontFamily:string,
        fontSize:number,
        offset:THREE.Vector2=undefined,
        strokeWidth=0,
        strokeColor="#000",
        ): THREE.Object3D {

        // Configure canvas
        const canvas = document.createElement( 'canvas' );
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Draw label
        const fontFactor = 0.90;
        ctx.fillStyle = color;
        ctx.font = `${fontFactor*size}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; 
        if (strokeWidth > 0) {
            ctx.lineWidth = strokeWidth*size;
            ctx.strokeStyle=strokeColor;
            ctx.strokeText(label, size/2, size/2);
        }
        ctx.fillText(label, size/2, size/2);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.SpriteMaterial( { map: texture } );
        const sprite = new THREE.Sprite( material );
        sprite.scale.set(fontSize, fontSize, 1);

        // Apply offset
        if (offset === undefined) {
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
    rotateAroundWorldAxis(obj, axis, radians): void {
        const rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(obj.matrix);        // pre-multiply
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
    coordinateTransform(
        A:THREE.Matrix3,
        Bi:THREE.Matrix3,
        a:THREE.Vector3,
        copy = true): THREE.Vector3
    {
        const result = copy ? a.clone() : a
        return result.applyMatrix3(A).applyMatrix3(Bi);
    }

    alignView(alignments:string[][], directions:any, objects:THREE.Object3D[], render = true): void {
        // Check alignment validity
        if (alignments === undefined) {
            return
        }
        if (alignments.length > 2) {
            throw "At most two alignments can be performed.";
        }

        const alignedDirections:Array<string> = []
        const rotate = (alignment) => {
            const direction = alignment[0]
            const target = alignment[1]
            let targetVector
            switch(direction) {
                case "up":
                    targetVector = new THREE.Vector3(0, 1, 0);
                    break
                case "down":
                    targetVector = new THREE.Vector3(0, -1, 0);
                    break
                case "right":
                    targetVector = new THREE.Vector3(1, 0, 0);
                    break
                case "left":
                    targetVector = new THREE.Vector3(-1, 0, 0);
                    break
                case "front":
                    targetVector = new THREE.Vector3(0, 0, 1);
                    break
                case "back":
                    targetVector = new THREE.Vector3(0, 0, -1);
                    break
            }
            // Determine the top direction
            const finalVector = directions[target];
            for (const alignedDirection of alignedDirections) {
                finalVector[alignedDirection] = 0
            }

            // Rotate the scene according to the selected top direction
            if (finalVector.length() > 1e-8) {
                const quaternion = new THREE.Quaternion().setFromUnitVectors(
                    finalVector.clone().normalize(),
                    targetVector,
                );

                // Rotate the given directions so that their direction will be
                // correct for the next aligment
                for (const direction in directions) {
                    directions[direction].applyQuaternion(quaternion)
                }
                
                // Rotate the given objects
                for (const obj of objects) {
                    obj.applyQuaternion(quaternion);
                    obj.updateMatrixWorld()
                }

                if (direction == "right" || direction == "left") {
                    alignedDirections.push("x");
                } else if (direction == "up" || direction == "down") {
                    alignedDirections.push("y");
                } else if (direction == "front" || direction == "back") {
                    alignedDirections.push("z");
                }
            }
        }

        for (const alignment of alignments) {
            rotate(alignment)
        }
        
        if (render) {
            this.render()
        }
    }
}
