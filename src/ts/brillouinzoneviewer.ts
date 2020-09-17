import { Viewer } from "./viewer"
import {
	MeshPhongMaterial,
	Group,
	Mesh,
	Object3D,
	Vector2,
	Vector3,
	Matrix3,
	Points,
	BackSide,
	FrontSide,
	Texture,
	CylinderGeometry,
	MeshBasicMaterial,
	Sprite,
	SpriteMaterial,
	Quaternion,
	Geometry,
	Scene,
    DirectionalLight,
    AmbientLight,
} from "three/build/three.module.js";
import { ConvexGeometry } from './ConvexGeometry';
import { MeshLine, MeshLineMaterial } from 'threejs-meshline'
import voronoi from 'voronoi-diagram'

/*
 * A 3D visualizer for the Brillouin Zone and the k-point path within it.
 */
export class BrillouinZoneViewer extends Viewer {
    private data:Object;       // The visualized structure
    private info:any;          // Object3D containing the information visuals
    private zone:any;          // Object3D containing the BZ mesh
    private sceneZone:any;     // The scene containing the Brillouin zone mesh
    private sceneInfo:any;     // The scene containing the information that is overlayed on top of the BZ
    private basis:any;         // The reciprocal cell basis
    private labelPoints:any;   // Contains the labels of special k-points
    private basisVectors:Vector3[];
    private B:Matrix3;

    /*
     * Overrides the implementation from the base class, as we need two scenes:
     * one for the BZ mesh and another for the information that is laid on top.
     */
    setupScenes(): void {
        this.scenes = [];
        this.sceneZone = new Scene();
        this.scenes.push(this.sceneZone);
        this.sceneInfo = new Scene();
        this.scenes.push(this.sceneInfo);
    }

    setupLights(): void {
        // White directional light shining from the top.
        const directionalLight = new DirectionalLight(0xffffff, 0.2);
        directionalLight.position.set(0, 0, 30)
        this.sceneZone.add( directionalLight );

        // White ambient light.
        const ambientLight = new AmbientLight( 0x404040, 4.1 ); // soft white light
        this.sceneZone.add( ambientLight );
    }

    /**
     * Used to initialize the viewer with data.
     *
     * @data {object} Data that describes the Brillouin Zone.
     */
    load(data: object): boolean {
        // Deep copy the structure for reloading
        this.data = data;

        // Clear all the old data
        this.clear();
        this.setup();

        // Reconstruct the visualization
        this.setupScenes();
        this.setupLights();
        this.setupCamera();
        this.setupControls();

        // Add the Brillouin zone and the k-point path
        const vertices = data["vertices"];
        const faces = data["faces"];
        const basis = data["basis"];
        const segments = data["segments"];
        const kpoints = data["kpoints"];
        this.basis = data["basis"];
        if (!basis || !segments) {
            console.log("The data given for the Brillouin zone viewer is incomplete.")
            return false;
        } else {
            this.createBrillouinZone(basis, segments, kpoints);
        }

        // Set view alignment and rotation
        if (this.B !== undefined) {
            this.alignView(this.options?.layout?.viewRotation?.align?.up, this.options?.layout?.viewRotation?.align?.segments);
        }
        this.rotateView(this.options?.layout?.viewRotation?.rotations);

        return true;
    }

    /**
     * Used to setup the visualization options.
     *
     * @param {boolean} options A Javascript object containing the options. See
     *   below for the subparameters.
     * @param {string} options.segments.color Segment color
     * @param {number} options.segments.linewidth Segment linewidth
     *
     * @param {string} options.kpoints.label.color Label color
     * @param {number} options.kpoints.label.size Label size
     * @param {string} options.kpoints.label.font Label font
     * @param {boolean} options.kpoints.label.offset2D Offset of the labels in
     * the sprite's 2D coordinate system. The offset is relative to the font
     * size and the default [0, 0] corresponds to centered labels.
     * @param {string} options.kpoints.stroke.width.font Label outline stroke width
     * @param {string} options.kpoints.stroke.width.font Label outline stroke color
     * @param {string} options.kpoints.point.color Point color
     * @param {number} options.kpoints.point.size Point size
     *
     * @param {boolean} options.basis.enabled Show basis
     * @param {string} options.basis.font Font size for basis labels. Applied as
     * default to all labels, can be overridden individually for each basis.
     * @param {string} options.basis.a.color Color applied to the
     *   label of the first reciprocal lattice vector.
     * @param {string} options.basis.a.font Font family applied to the
     *   label of the first reciprocal lattice vector.
     * @param {number} options.basis.a.size Font size applied to the
     *   label of the first reciprocal lattice vector.
     * @param {string} options.basis.b.color Color applied to the
     *   label of the second reciprocal lattice vector.
     * @param {string} options.basis.b.font Font family applied to the
     *   label of the second reciprocal lattice vector.
     * @param {number} options.basis.b.size Font size applied to the
     *   label of the second reciprocal lattice vector.
     * @param {string} options.basis.c.color Color applied to the
     *   label of the third reciprocal lattice vector.
     * @param {string} options.basis.c.font Font family applied to the
     *   label of the third reciprocal lattice vector.
     * @param {number} options.basis.c.size Font size applied to the
     *   label of the third reciprocal lattice vector.
     */
    setOptions(options: Record<string, unknown>): void {
        // The default settings object
        const defaultOptions = {
            controls: {
                rotateSpeed: 40,
                enablePan: false
            },
            view: {
                fitMargin: 0.01,
            },
            basis: {
                enabled: true,
                offset: 0.02,
                font: "Arial",
                size: 0.03,
                stroke: {
                    width: 0.06,
                    color: "#000",
                },
                a: {
                    enabled: true,
                    color: "#C52929",
                    label: "a",
                    stroke: {
                        width: 0.06,
                        color: "#000",
                    },
                },
                b: {
                    enabled: true,
                    color: "#47A823",
                    label: "b",
                    stroke: {
                        width: 0.06,
                        color: "#000",
                    },
                },
                c: {
                    enabled: true,
                    color: "#3B5796",
                    label: "c",
                    stroke: {
                        width: 0.06,
                        color: "#000",
                    },
                },
            },
            segments: {
                color: "#E56400",
                linewidth: 0.0025,
            },
            kpoints: {
                point: {
                    enabled: true,
                    size: 0.01,
                    color: "#E56400",
                },
                label: {
                    enabled: true,
                    font: "Arial",
                    size: 0.03,
                    color: "#E56400",
                    offset2D: [0, -0.75],
                    stroke: {
                        width: 0.06,
                        color: "#000",
                    },
                }
            },
            faces: {
                color: "#eee",
                opacity: 0.7,
            },
            edges: {
                color: "#999",
                width: 0.001,
            },
            renderer: {
                background: {
                    color: "#ffffff",
                    transparency: 1,
                }
            }
        }

        this.fillOptions(options, defaultOptions);

        // Handle base class settings
        super.setOptions(defaultOptions);
    }

    setupInitialView(): void {
        // Rotate the scene so that the first basis vector is pointing up.
        const yAxis = new Vector3(0, 1, 0);
        const xAxis = new Vector3(1, 0, 0);
        const zAxis = new Vector3(0, 0, 1);
        const direction = new Vector3().fromArray(this.basis[0]);
        const quaternion = new Quaternion().setFromUnitVectors(
            yAxis,
            direction.clone().normalize()
        );
        quaternion.conjugate()
        this.info.quaternion.copy(quaternion);
        this.zone.quaternion.copy(quaternion);

        // Rotate the scene so that the segments are shown properly
        this.info.updateMatrixWorld();  // The positions are not otherwise updated properly
        this.zone.updateMatrixWorld();
        const average = new Vector3()
        const nLabelPoints = this.labelPoints.length;
        for (let iSegmentPoint=0; iSegmentPoint < nLabelPoints; ++iSegmentPoint) {
            const segmentPoint = this.labelPoints[iSegmentPoint];
            average.add(segmentPoint.getWorldPosition(new Vector3()));
        }
        average.multiplyScalar(1/nLabelPoints);
        average.y = 0
        const segmentQ = new Quaternion().setFromUnitVectors(
            zAxis,
            average.clone().normalize()
        );
        segmentQ.conjugate()
        this.info.quaternion.premultiply(segmentQ);
        this.zone.quaternion.premultiply(segmentQ);

        // Rotate the zone so that it is shown from slightly above
        const qX = new Quaternion();
        qX.setFromAxisAngle(xAxis, Math.PI/8);
        this.info.quaternion.premultiply( qX );
        this.zone.quaternion.premultiply( qX );
    }

    /*
     * Used to create the representation for the first Brillouin Zone.
     */
    createBrillouinZone(
        basis:number[][],
        segments:number[][][],
        labels:string[][]): void {

        // Create list of reciprocal lattice points
        const B = new Matrix3();
        const a = new Vector3().fromArray(basis[0])
        const b = new Vector3().fromArray(basis[1])
        const c = new Vector3().fromArray(basis[2])
        B.set(
            a.x, b.x, c.x,
            a.y, b.y, c.y,
            a.z, b.z, c.z,
        )
        this.basisVectors = [a, b, c]
        this.B = B
        const points = []
        const limit = 1
        for (let i=-limit; i <= limit; ++i) {
            for (let j=-limit; j <= limit; ++j) {
                for (let k=-limit; k <= limit; ++k) {
                    const multiplier = new Vector3(i, j, k)
                    const point = multiplier.applyMatrix3(B)
                    points.push(point.toArray())
                }
            }
        }
        
        // Create voronoi cells
        const res = voronoi(points)

        // Find the finite cell with center at origin, i.e. the first Brillouin
        // Zone
        for (const cell of res.cells) {
            
            // Check if cell is finite
            const vpoints = []
            let finite = true
            let finite2 = true
            for (const index of cell) {
                if (index === -1) {
                    finite = false
                    break
                }
                const vpoint = res.positions[index]
                for (let j=0; j<3; ++j) {
                    if (Number.isNaN(vpoint[j])) {
                        finite2 = false
                        break
                    }
                }
                vpoints.push(vpoint)
            }
            if (!finite || !finite2) {
                continue
            }

            // Find cell that is centered on origin 
            const center = new Vector3(0, 0, 0)
            const vertices = []
            for (let i=0; i < vpoints.length; ++i) {
                const vertex = new Vector3().fromArray(vpoints[i])
                vertices.push(vertex)
                center.add(vertex)
            }
            center.divideScalar(vertices.length)

            if (center.length() < 1e-7) {
                const pointGeometry = new Geometry();
                for (const vertex of vertices) {
                    pointGeometry.vertices.push(vertex.multiplyScalar(1E-10))
                }
                this.cornerPoints = new Points(pointGeometry)
                this.cornerPoints.visible = false;
                break
            }
        }

        this.zone = new Object3D();
        this.zone.name = "zone";
        this.sceneZone.add(this.zone);
        this.info = new Object3D();
        this.info.name = "info";
        this.sceneInfo.add(this.info);
        this.sceneInfo.add(this.cornerPoints);

        // Weird hack for achieving translucent surfaces. Setting
        // side=DoubleSide will not do.
        const group = new Group();
        const bzGeometry = new ConvexGeometry(this.cornerPoints.geometry.vertices);
        const meshMaterial = new MeshPhongMaterial( {
            color : this.options.faces.color,
            opacity: this.options.faces.opacity,
            transparent: true
        } );
        const mesh = new Mesh( bzGeometry, meshMaterial );
        mesh.material.side = BackSide; // back faces
        mesh.renderOrder = 0;
        group.add( mesh );
        const mesh2 = new Mesh( bzGeometry, meshMaterial.clone() );
        mesh2.material.side = FrontSide; // front faces
        mesh2.renderOrder = 1;
        group.add( mesh2 );

        // Create edges as closed loops around each face
        const edgeWidth = this.options.edges.width
        const edgeMaterial = new MeshLineMaterial({
            color: this.options.edges.color,
            lineWidth: edgeWidth,
            sizeAttenuation: true,
        });
        for (const face of bzGeometry.faceEdges) {
            const edgeGeometry = new Geometry();
            for (const vertex of face) {
                let scaledVertex = vertex.clone()
                const length = scaledVertex.length();
                scaledVertex = scaledVertex.multiplyScalar(1+0.5*edgeWidth/length);
                edgeGeometry.vertices.push(scaledVertex)
            }
            const edgeLine = new MeshLine();
            edgeLine.setVertices(edgeGeometry.vertices)
            const edgeMesh = new Mesh(edgeLine, edgeMaterial);
            this.zone.add(edgeMesh);
        }

        // Create the reciprocal space axes
        const basisLabels = [this.options.basis.a.label, this.options.basis.b.label, this.options.basis.c.label];
        const basisFonts = [];
        basisFonts.push(this.options.basis.a.font === undefined ? this.options.basis.font : this.options.basis.a.font);
        basisFonts.push(this.options.basis.b.font === undefined ? this.options.basis.font : this.options.basis.b.font);
        basisFonts.push(this.options.basis.c.font === undefined ? this.options.basis.font : this.options.basis.c.font);
        const basisFontSizes = [];
        basisFontSizes.push(this.options.basis.a.size === undefined ? this.options.basis.size : this.options.basis.a.size);
        basisFontSizes.push(this.options.basis.b.size === undefined ? this.options.basis.size : this.options.basis.b.size);
        basisFontSizes.push(this.options.basis.c.size === undefined ? this.options.basis.size : this.options.basis.c.size);
        const cellBasisColors = [];
        cellBasisColors.push(this.options.basis.a.color === undefined ? this.options.basis.color : this.options.basis.a.color);
        cellBasisColors.push(this.options.basis.b.color === undefined ? this.options.basis.color : this.options.basis.b.color);
        cellBasisColors.push(this.options.basis.c.color === undefined ? this.options.basis.color : this.options.basis.c.color);
        const strokeColors = [];
        strokeColors.push(this.options.basis.a.stroke.color === undefined ? this.options.basis.stroke.color : this.options.basis.a.stroke.color);
        strokeColors.push(this.options.basis.b.stroke.color === undefined ? this.options.basis.stroke.color : this.options.basis.b.stroke.color);
        strokeColors.push(this.options.basis.c.stroke.color === undefined ? this.options.basis.stroke.color : this.options.basis.c.stroke.color);
        const strokeWidths = [];
        strokeWidths.push(this.options.basis.a.stroke.width === undefined ? this.options.basis.stroke.width : this.options.basis.a.stroke.width);
        strokeWidths.push(this.options.basis.b.stroke.width === undefined ? this.options.basis.stroke.width : this.options.basis.b.stroke.width);
        strokeWidths.push(this.options.basis.c.stroke.width === undefined ? this.options.basis.stroke.width : this.options.basis.c.stroke.width);
        for (let iBasis=0; iBasis<3; ++iBasis) {
            const length = 0.7;
            const basisVector = basis[iBasis];
            const origin = new Vector3( 0, 0, 0 );
            const dir = new Vector3()
                .fromArray(basisVector)
                .multiplyScalar(1E-10)
                .multiplyScalar(length);

            // Add a dashed line
            const lineGeometry = new Geometry();
            lineGeometry.vertices.push(
                origin,
                dir
            );
            const lineMaterial = new MeshLineMaterial({
                color: "#000",
                lineWidth: 0.00075,
                sizeAttenuation: true,
                dashArray: 0.05,
                transparent: true,
                depthTest: false,
            });
            const kpathLine = new MeshLine();
            kpathLine.setVertices(lineGeometry.vertices)
            const line = new Mesh(kpathLine, lineMaterial);
            this.info.add( line );

            // Add an axis label
            const textPos = new Vector3()
                .copy(dir)
                .multiplyScalar(1+this.options.basis.offset/dir.length());
            const basisLabel = basisLabels[iBasis];
            const basisColor = cellBasisColors[iBasis];
            const basisFont = basisFonts[iBasis];
            const basisFontSize = basisFontSizes[iBasis];
            const strokeWidth = strokeWidths[iBasis];
            const strokeColor = strokeColors[iBasis];
            const basisSprite = this.createLabel(
                textPos,
                basisLabel,
                basisColor,
                basisFont,
                basisFontSize,
                new Vector2(0.0, 0.0),
                strokeWidth,
                strokeColor,
            );
            this.info.add(basisSprite)

            // Add axis arrow
            const arrowGeometry = new CylinderGeometry( 0, 0.003, 0.012, 12 );
            const arrowMaterial = new MeshBasicMaterial( {color: 0x000000} );
            const arrow = new Mesh(arrowGeometry, arrowMaterial);
            arrow.position.copy(dir)
            arrow.lookAt(new Vector3());
            arrow.rotateX(-Math.PI/2);
            this.info.add(arrow);
        }

        /*
         * For creating high symmetry points.
         */
        const merged = [].concat.apply([], basis);
        const basisMatrix = new Matrix3().fromArray(merged);
        const labelMap = {};
        const createCircle = (position:Vector3,
            diameter:number,
            color:string) => {
            // Configure canvas
            const canvas = document.createElement( 'canvas' );
            const size = 256;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Draw circle
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2, 0, 2*Math.PI);
            ctx.fillStyle = color;
            ctx.fill();

            const texture = new Texture(canvas);
            texture.needsUpdate = true;
            const material = new SpriteMaterial( { map: texture } );
            const sprite = new Sprite( material );
            sprite.scale.set(diameter, diameter, 1);

            const labelRoot = new Object3D();
            labelRoot.position.copy(position);
            labelRoot.add(sprite);

            return labelRoot;
        }

        // Create the k-point path from the given segments. Currently assumes
        // that the segments are linear and the segment path is determined by
        // the start and end point.
        const kpathMaterial = new MeshLineMaterial({
            color: this.options.segments.color,
            lineWidth: this.options.segments.linewidth,
            sizeAttenuation: true,
        });
        const kpathGeometry = new Geometry();
        this.labelPoints = [];
        for (let iSegment=0; iSegment<segments.length; ++iSegment) {
            const segment = segments[iSegment];
            const nKpoints = segment.length;
            const kPointIndices = [0, nKpoints-1];
            for (const iKpoint of kPointIndices) {
                const kpoint = new Vector3().fromArray(segment[iKpoint]).multiplyScalar(1E-10);
                kpoint.applyMatrix3(basisMatrix);
                kpathGeometry.vertices.push(kpoint);

                // Create the label for the first point in the segment
                if (labels) {
                    if (iKpoint === 0 || iKpoint === nKpoints-1) {
                        let label = "";
                        if (iKpoint === 0) {
                            label = labels[iSegment][0]
                        } else if (iKpoint === nKpoints-1) {
                            label = labels[iSegment][1];
                        }
                        // Check if this position has alread been marked
                        let labelExists = false
                        for (let iLabel=0; iLabel<this.labelPoints.length; ++iLabel) {
                            const testPos = this.labelPoints[iLabel].position;
                            const delta = new Vector3()
                                .copy(kpoint)
                                .addScaledVector(testPos, -1.0)
                                .length();
                            if (delta < 1E-5) {
                                labelExists = true;
                            }
                        }
                        // Add a label position if it wasn't marked already
                        if (!labelExists) {
                            labelMap[label] = true;
                            const kpointCircle = createCircle(
                                kpoint,
                                this.options.kpoints.point.size,
                                this.options.kpoints.point.color
                            );
                            const kpointLabel = this.createLabel(
                                kpoint,
                                label,
                                this.options.kpoints.label.color,
                                this.options.kpoints.label.font,
                                this.options.kpoints.label.size,
                                new Vector2().fromArray(this.options.kpoints.label.offset2D),
                                this.options.kpoints.label.stroke.width,
                                this.options.kpoints.label.stroke.width,
                            );
                            this.info.add(kpointCircle);
                            this.info.add(kpointLabel);
                            this.labelPoints.push(kpointLabel);
                        }
                    }
                }
            }
        }
        const kpathLine = new MeshLine();
        kpathLine.setVertices(kpathGeometry.vertices)
        const kpath = new Mesh(kpathLine, kpathMaterial);
        this.info.add(kpath);
        this.zone.add(group);
    }

    /**
     * @param rotations The rotations as a list. Each rotation should be an
     * array containing four numbers: [x, y, z, angle]. The rotations are
     * applied in the given order.
     */
    rotateView(rotations: number[], render=true): void {
        if (rotations === undefined) {
            return;
        }
        for (const r of rotations) {
            const basis = new Vector3(r[0], r[1], r[2]);
            basis.normalize();
            const angle = r[3]/180*Math.PI;
            this.rotateAroundWorldAxis(this.zone, basis, angle);
            this.rotateAroundWorldAxis(this.info, basis, angle);
        }
        if (render) {
            this.render();
        }
    }

    alignView(up: string, segments: string, render = true): void {
        if (up === undefined) {
            return;
        }
        
        // Determine the top direction
        let topVector;
        if (up === "c") {
            topVector = this.basisVectors[2];
        } else if (up === "-c") {
            topVector = this.basisVectors[2].negate();
        } else if (up === "b") {
            topVector = this.basisVectors[1];
        } else if (up === "-b") {
            topVector = this.basisVectors[1].negate();
        } else if (up === "a") {
            topVector = this.basisVectors[0];
        } else if (up === "-a") {
            topVector = this.basisVectors[0].negate();
        }

        // Determine the right direction
        let segmentVector;
        if (segments === "front") {
            segmentVector = new Vector3(0, 0, 1);
        } else if (segments === "back") {
            segmentVector = new Vector3(0, 0, -1);
        } else if (segments === "right") {
            segmentVector = new Vector3(1, 0, 0);
        } else if (segments === "left") {
            segmentVector = new Vector3(-1, 0, 0);
        } else if (segments === "up") {
            segmentVector = new Vector3(0, 1, 0);
        } else if (segments === "down") {
            segmentVector = new Vector3(0, -1, 0);
        }

        // Rotate the scene so that the first basis vector is pointing up.
        const quaternion = new Quaternion().setFromUnitVectors(
            new Vector3(0, 1, 0),
            topVector.clone().normalize()
        );
        quaternion.conjugate()
        this.info.quaternion.copy(quaternion);
        this.zone.quaternion.copy(quaternion);

        // Rotate the scene so that the segments are shown properly
        this.info.updateMatrixWorld();  // The positions are not otherwise updated properly
        this.zone.updateMatrixWorld();
        const average = new Vector3()
        const nLabelPoints = this.labelPoints.length;
        for (let iSegmentPoint=0; iSegmentPoint < nLabelPoints; ++iSegmentPoint) {
            const segmentPoint = this.labelPoints[iSegmentPoint];
            average.add(segmentPoint.getWorldPosition(new Vector3()));
        }
        average.multiplyScalar(1/nLabelPoints);
        average.y = 0
        const segmentQ = new Quaternion().setFromUnitVectors(
            segmentVector,
            average.clone().normalize()
        );
        segmentQ.conjugate()
        this.info.quaternion.premultiply(segmentQ);
        this.zone.quaternion.premultiply(segmentQ);

        this.info.updateMatrixWorld();
        this.zone.updateMatrixWorld();

        if (render) {
            this.render()
        }
    }
}
