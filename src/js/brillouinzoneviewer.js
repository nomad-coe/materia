import { Viewer } from "./viewer";
import * as THREE from "three";
import { getConvexGeometry } from './convexgeometry';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { isNil, merge, cloneDeep } from "lodash";
import voronoi from 'voronoi-diagram';
/*
 * A 3D visualizer for the Brillouin Zone and the k-point path within it.
 */
export class BrillouinZoneViewer extends Viewer {
    /**
     * @param {any} hostElement is the html element where the visualization
     *   canvas will be appended.
     * @param {Object} options An object that can hold custom settings for the viewer.
     * @param {string} options.renderer.pixelRatioScale Scaling factor for the pixel ratio. Defaults to 1.
     * @param {string} options.renderer.antialias.enabled Whether antialiasing is enabled. Defaults to true.
     * @param {string} options.renderer.background.color Color of the background. Defaults to "#fff".
     * @param {number} options.renderer.background.opacity Opacity of the background. Defaults to 0.
     * @param {boolean} options.renderer.shadows.enabled Whether shows are cast
     *   by atoms onto others. Note that enabling this increases the computational
     *   cost for doing the visualization. Defaults to false
     * @param {Object} options.controls Default options for the controls-function. See
     *   the function for more information.
     */
    constructor(hostElement, options = {}) {
        super(hostElement, options);
        this.hostElement = hostElement;
    }
    /**
     * Saves the default options.
    */
    setOptions(options) {
        const controlDefaults = {
            zoom: {
                enabled: true,
                speed: 0.2
            },
            rotation: {
                enabled: true,
                speed: 40
            },
            pan: {
                enabled: true,
                speed: 10
            },
            resetOnDoubleClick: true
        };
        this.controlDefaults = merge(cloneDeep(controlDefaults), cloneDeep(options === null || options === void 0 ? void 0 : options.controls));
    }
    /*
     * Overrides the implementation from the base class, as we need two scenes:
     * one for the BZ mesh and another for the information that is laid on top.
     */
    setupScenes() {
        // Setup the scenes in rendering order
        this.scenes = [];
        this.sceneRoot = new THREE.Scene();
        this.scenes.push(this.sceneRoot);
        this.sceneInfo = new THREE.Scene();
        this.scenes.push(this.sceneInfo);
        this.root = new THREE.Object3D();
        this.sceneRoot.add(this.root);
        this.info = new THREE.Object3D();
        this.sceneInfo.add(this.info);
        // Setup the objects that are affected by rotations etc.
        this.objects = [this.root, this.info];
    }
    setupLights() {
        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.45);
        keyLight.position.set(0, 0, 20);
        this.sceneRoot.add(keyLight);
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-20, 0, -20);
        this.sceneRoot.add(fillLight);
        // Back light
        const backLight = new THREE.DirectionalLight(0xffffff, 0.25);
        backLight.position.set(20, 0, -20);
        this.sceneRoot.add(backLight);
        // White ambient light.
        const ambientLight = new THREE.AmbientLight(0x404040, 3.7); // soft white light
        this.sceneRoot.add(ambientLight);
    }
    /**
     * Used to create a visualization for the first Brillouin Zone together with
     * kpath and segment information.
     *
     * @param {object} data A Javascript object containing the visualized
     * structure. See below for the subparameters.
     * @param {number[][]} data.basis The basis vectors of the reciprocal cell as
     *   rows of a 3x3 array.
     * @param {number[][]} data.segments List containing lists of k-points,
     * each sublist indicating a continuous segment within the Brillouin zone.
     * @param {*} data.kpoints List of pairs of labels and reciprocal
     * lattice coordinates for specific k-points that should be shown.
     *
     * @param {object} options A Javascript object containing the options. See
     *   below for the subparameters.
     *
     * @param {string} options.segments.color Segment color
     * @param {number} options.segments.linewidth Segment linewidth
     *
     * @param {string} options.faces.color Face color
     * @param {number} options.faces.opacity Face opacity
     * @param {string} options.faces.outline.color Face outline color
     * @param {number} options.faces.outline.width Face outline width
     *
     * @param {string} options.kpoints.label.color Label color
     * @param {number} options.kpoints.label.size Label size
     * @param {string} options.kpoints.label.font Label font
     * @param {boolean} options.kpoints.label.offset2D Offset of the labels in
     * the sprite's 2D coordinate system. The offset is relative to the font
     * size and the default [0, 0] corresponds to centered labels.
     * @param {string} options.kpoints.point.color Point color
     * @param {number} options.kpoints.point.size Point size
     * @param {string} options.kpoints.stroke.width Label outline stroke width
     * @param {string} options.kpoints.stroke.color Label outline stroke color
     *
     * @param {string} options.basis.color Font colour for basis labels. Applied as
     * default to all labels, can be overridden individually for each basis.
     * @param {number} options.basis.font Font size for basis labels. Applied as
     * default to all labels, can be overridden individually for each basis.
     * @param {number} options.basis.offset Offset for basis labels.
     * @param {number} options.basis.stroke.width Label outline stroke width
     * @param {string} options.basis.stroke.color Label outline stroke color
     *
     * @param {string} options.basis.a.color Color applied to the
     *   label of the first reciprocal lattice vector.
     * @param {string} options.basis.a.font Font family applied to the
     *   label of the first reciprocal lattice vector.
     * @param {number} options.basis.a.size Font size applied to the
     *   label of the first reciprocal lattice vector.
     * @param {number} options.basis.a.stroke.width Outline stroke width
     * applied to the label of the first reciprocal lattice vector.
     * @param {string} options.basis.a.stroke.color Outline stroke color
     * applied to the label of the first reciprocal lattice vector.
     *
     * @param {string} options.basis.b.color Color applied to the
     *   label of the second reciprocal lattice vector.
     * @param {string} options.basis.b.font Font family applied to the
     *   label of the second reciprocal lattice vector.
     * @param {number} options.basis.b.size Font size applied to the
     *   label of the second reciprocal lattice vector.
     * @param {number} options.basis.b.stroke.width Outline stroke width
     * applied to the label of the second reciprocal lattice vector.
     * @param {string} options.basis.b.stroke.color Outline stroke color
     * applied to the label of the second reciprocal lattice vector.
     *
     * @param {string} options.basis.c.color Color applied to the
     *   label of the third reciprocal lattice vector.
     * @param {string} options.basis.c.font Font family applied to the
     *   label of the third reciprocal lattice vector.
     * @param {number} options.basis.c.size Font size applied to the
     *   label of the third reciprocal lattice vector.
     * @param {number} options.basis.c.stroke.width Outline stroke width
     * applied to the label of the third reciprocal lattice vector.
     * @param {string} options.basis.c.stroke.color Outline stroke color
     * applied to the label of the third reciprocal lattice vector.
     */
    load(data, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        // Read the Brillouin zone and the k-point path
        this.basis = data["basis"];
        this.segments = data["segments"];
        this.kpoints = data["kpoints"];
        if (!this.basis || !this.segments) {
            throw Error("The data given for the Brillouin zone viewer is incomplete.");
        }
        // Remove old viz
        if (!isNil(this.info)) {
            this.info.clear();
        }
        if (!isNil(this.root)) {
            this.root.clear();
        }
        // Define final options
        const def = {
            basis: {
                offset: 0.02,
                font: "Arial",
                size: 0.03,
                stroke: {
                    width: 0.06,
                    color: "#000",
                },
                a: {
                    label: "a",
                },
                b: {
                    label: "b",
                },
                c: {
                    label: "c",
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
                    size: 0.025,
                    color: "#E56400",
                    offset2D: [0, -0.75],
                    stroke: {
                        width: 0.06,
                        color: "#000",
                    },
                }
            },
            faces: {
                color: "#ddd",
                opacity: 0.7,
                outline: {
                    width: 0.002,
                    color: "#999",
                },
            },
        };
        const optionsFinal = merge(cloneDeep(def), cloneDeep(options || {}));
        // Create list of reciprocal lattice points
        const basis = this.basis;
        const segments = this.segments;
        const kpoints = this.kpoints;
        const B = new THREE.Matrix3();
        const a = new THREE.Vector3().fromArray(basis[0]);
        const b = new THREE.Vector3().fromArray(basis[1]);
        const c = new THREE.Vector3().fromArray(basis[2]);
        B.set(a.x, b.x, c.x, a.y, b.y, c.y, a.z, b.z, c.z);
        this.basisVectors = [a, b, c];
        this.B = B;
        const I = new THREE.Matrix3().identity();
        const points = [];
        const limit = 1;
        for (let i = -limit; i <= limit; ++i) {
            for (let j = -limit; j <= limit; ++j) {
                for (let k = -limit; k <= limit; ++k) {
                    const multiplier = new THREE.Vector3(i, j, k);
                    const point = this.coordinateTransform(this.B, I, multiplier, false);
                    points.push(point.toArray());
                }
            }
        }
        // Create voronoi cells
        const res = voronoi(points);
        // Find the finite cell with center at origin, i.e. the first Brillouin
        // Zone
        let bzVertices;
        for (const cell of res.cells) {
            // Check if cell is finite
            const vpoints = [];
            let finite = true;
            let finite2 = true;
            for (const index of cell) {
                if (index === -1) {
                    finite = false;
                    break;
                }
                const vpoint = res.positions[index];
                for (let j = 0; j < 3; ++j) {
                    if (Number.isNaN(vpoint[j])) {
                        finite2 = false;
                        break;
                    }
                }
                vpoints.push(vpoint);
            }
            if (!finite || !finite2) {
                continue;
            }
            // Find cell that is centered on origin 
            const center = new THREE.Vector3(0, 0, 0);
            const vertices = [];
            for (let i = 0; i < vpoints.length; ++i) {
                const vertex = new THREE.Vector3().fromArray(vpoints[i]);
                vertices.push(vertex);
                center.add(vertex);
            }
            center.divideScalar(vertices.length);
            if (center.length() < 1e-7) {
                bzVertices = vertices;
                break;
            }
        }
        // A customised THREE.BufferGeometry object that will create the face
        // geometry and information about the face edges
        const { geometry, faces } = getConvexGeometry(bzVertices);
        // Weird hack for achieving translucent surfaces. Setting
        // side=DoubleSide on a single mesh will not do.
        const group = new THREE.Group();
        group.name = "group";
        const meshMaterial = new THREE.MeshPhongMaterial({
            color: optionsFinal.faces.color,
            opacity: optionsFinal.faces.opacity,
            transparent: true
        });
        const mesh = new THREE.Mesh(geometry, meshMaterial);
        mesh.name = "innermesh";
        mesh.material.side = THREE.BackSide; // back faces
        mesh.renderOrder = 0;
        group.add(mesh);
        const mesh2 = new THREE.Mesh(geometry, meshMaterial.clone());
        mesh2.name = "outermesh";
        mesh2.material.side = THREE.FrontSide; // front faces
        mesh2.renderOrder = 1;
        group.add(mesh2);
        this.root.add(group);
        // Create edges as closed loops around each face
        const edgeWidth = optionsFinal.faces.outline.width;
        const edgeMaterial = new MeshLineMaterial({
            color: optionsFinal.faces.outline.color,
            lineWidth: edgeWidth,
            sizeAttenuation: true,
        });
        for (const face of faces) {
            const edgeVertices = [];
            for (const vertex of face) {
                let scaledVertex = vertex.clone();
                const length = scaledVertex.length();
                scaledVertex = scaledVertex.multiplyScalar(1 + 0.5 * edgeWidth / length);
                edgeVertices.push(scaledVertex);
            }
            //const edgeGeometry = new THREE.BufferGeometry().setFromPoints(edgeVertices);
            const edgeLine = new MeshLine();
            edgeLine.setPoints(edgeVertices);
            const edgeMesh = new THREE.Mesh(edgeLine, edgeMaterial);
            this.root.add(edgeMesh);
        }
        // Create the reciprocal space axes
        const basisLabels = [optionsFinal.basis.a.label, optionsFinal.basis.b.label, optionsFinal.basis.c.label];
        const basisFonts = [];
        basisFonts.push(((_a = optionsFinal.basis.a) === null || _a === void 0 ? void 0 : _a.font) === undefined ? optionsFinal.basis.font : optionsFinal.basis.a.font);
        basisFonts.push(((_b = optionsFinal.basis.b) === null || _b === void 0 ? void 0 : _b.font) === undefined ? optionsFinal.basis.font : optionsFinal.basis.b.font);
        basisFonts.push(((_c = optionsFinal.basis.c) === null || _c === void 0 ? void 0 : _c.font) === undefined ? optionsFinal.basis.font : optionsFinal.basis.c.font);
        const basisFontSizes = [];
        basisFontSizes.push(((_d = optionsFinal.basis.a) === null || _d === void 0 ? void 0 : _d.size) === undefined ? optionsFinal.basis.size : optionsFinal.basis.a.size);
        basisFontSizes.push(((_e = optionsFinal.basis.b) === null || _e === void 0 ? void 0 : _e.size) === undefined ? optionsFinal.basis.size : optionsFinal.basis.b.size);
        basisFontSizes.push(((_f = optionsFinal.basis.c) === null || _f === void 0 ? void 0 : _f.size) === undefined ? optionsFinal.basis.size : optionsFinal.basis.c.size);
        const cellBasisColors = [];
        cellBasisColors.push(((_g = optionsFinal.basis.a) === null || _g === void 0 ? void 0 : _g.color) === undefined ? optionsFinal.basis.color : optionsFinal.basis.a.color);
        cellBasisColors.push(((_h = optionsFinal.basis.b) === null || _h === void 0 ? void 0 : _h.color) === undefined ? optionsFinal.basis.color : optionsFinal.basis.b.color);
        cellBasisColors.push(((_j = optionsFinal.basis.c) === null || _j === void 0 ? void 0 : _j.color) === undefined ? optionsFinal.basis.color : optionsFinal.basis.c.color);
        const strokeColors = [];
        strokeColors.push(((_l = (_k = optionsFinal.basis.a) === null || _k === void 0 ? void 0 : _k.stroke) === null || _l === void 0 ? void 0 : _l.color) === undefined ? optionsFinal.basis.stroke.color : optionsFinal.basis.a.stroke.color);
        strokeColors.push(((_o = (_m = optionsFinal.basis.b) === null || _m === void 0 ? void 0 : _m.stroke) === null || _o === void 0 ? void 0 : _o.color) === undefined ? optionsFinal.basis.stroke.color : optionsFinal.basis.b.stroke.color);
        strokeColors.push(((_q = (_p = optionsFinal.basis.c) === null || _p === void 0 ? void 0 : _p.stroke) === null || _q === void 0 ? void 0 : _q.color) === undefined ? optionsFinal.basis.stroke.color : optionsFinal.basis.c.stroke.color);
        const strokeWidths = [];
        strokeWidths.push(((_s = (_r = optionsFinal.basis.a) === null || _r === void 0 ? void 0 : _r.stroke) === null || _s === void 0 ? void 0 : _s.width) === undefined ? optionsFinal.basis.stroke.width : optionsFinal.basis.a.stroke.width);
        strokeWidths.push(((_u = (_t = optionsFinal.basis.b) === null || _t === void 0 ? void 0 : _t.stroke) === null || _u === void 0 ? void 0 : _u.width) === undefined ? optionsFinal.basis.stroke.width : optionsFinal.basis.b.stroke.width);
        strokeWidths.push(((_w = (_v = optionsFinal.basis.c) === null || _v === void 0 ? void 0 : _v.stroke) === null || _w === void 0 ? void 0 : _w.width) === undefined ? optionsFinal.basis.stroke.width : optionsFinal.basis.c.stroke.width);
        for (let iBasis = 0; iBasis < 3; ++iBasis) {
            const length = 0.7;
            const basisVector = basis[iBasis];
            const origin = new THREE.Vector3(0, 0, 0);
            const dir = new THREE.Vector3()
                .fromArray(basisVector)
                .multiplyScalar(length);
            // Add a dashed line
            const lineVertices = [origin, dir];
            const lineMaterial = new MeshLineMaterial({
                color: "#000",
                lineWidth: 0.00075,
                sizeAttenuation: true,
                dashArray: 0.05,
                transparent: true,
                depthTest: false,
            });
            const kpathLine = new MeshLine();
            kpathLine.setPoints(lineVertices);
            const line = new THREE.Mesh(kpathLine, lineMaterial);
            this.info.add(line);
            // Add an axis label
            const textPos = new THREE.Vector3()
                .copy(dir)
                .multiplyScalar(1 + optionsFinal.basis.offset / dir.length());
            const basisLabel = basisLabels[iBasis];
            const basisColor = cellBasisColors[iBasis];
            const basisFont = basisFonts[iBasis];
            const basisFontSize = basisFontSizes[iBasis];
            const strokeWidth = strokeWidths[iBasis];
            const strokeColor = strokeColors[iBasis];
            const basisSprite = this.createLabel(textPos, basisLabel, basisColor, basisFont, basisFontSize, new THREE.Vector2(0.0, 0.0), strokeWidth, strokeColor);
            this.info.add(basisSprite);
            // Add axis arrow
            const arrowGeometry = new THREE.CylinderGeometry(0, 0.003, 0.012, 12);
            const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
            arrow.position.copy(dir);
            arrow.lookAt(new THREE.Vector3());
            arrow.rotateX(-Math.PI / 2);
            this.info.add(arrow);
        }
        // Create the k-point path from the given segments. Currently assumes
        // that the segments are linear and the segment path is determined by
        // the start and end point.
        const kpathMaterial = new MeshLineMaterial({
            color: optionsFinal.segments.color,
            lineWidth: optionsFinal.segments.linewidth,
            sizeAttenuation: true,
        });
        //let kpathGeometry;
        const labelPoints = [];
        for (let iSegment = 0; iSegment < segments.length; ++iSegment) {
            //kpathGeometry = new THREE.BufferGeometry();
            const kpathVertices = [];
            const segment = segments[iSegment];
            for (const kpoint of segment) {
                const kpointScaled = new THREE.Vector3().fromArray(kpoint);
                const kpointCart = this.coordinateTransform(this.B, I, kpointScaled, false);
                kpathVertices.push(kpointCart); // The point is pushed twice because it looks nicer that way for some reason...
                kpathVertices.push(kpointCart);
                labelPoints.push(kpointCart);
            }
            const kpathLine = new MeshLine();
            kpathLine.setPoints(kpathVertices);
            const kpath = new THREE.Mesh(kpathLine, kpathMaterial);
            this.info.add(kpath);
        }
        // Create dummy geometry that is used to orient the view to show the
        // segments nicely
        this.labelPoints = new THREE.Object3D();
        for (const point of labelPoints) {
            const labelObject = new THREE.Object3D();
            labelObject.position.copy(point);
            this.labelPoints.add(labelObject);
        }
        this.info.add(this.labelPoints);
        // Add k-point labels. Duplicate points are ignored.
        if (kpoints) {
            for (const kpoint of kpoints) {
                const label = kpoint[0];
                const kpointScaled = new THREE.Vector3().fromArray(kpoint[1]);
                const kpointCartesian = this.coordinateTransform(this.B, I, kpointScaled, false);
                if (optionsFinal.kpoints.point.enabled) {
                    const kpointCircle = this.createCircle(kpointCartesian, optionsFinal.kpoints.point.size, optionsFinal.kpoints.point.color);
                    this.info.add(kpointCircle);
                }
                if (optionsFinal.kpoints.label.enabled) {
                    const kpointLabel = this.createLabel(kpointCartesian, label, optionsFinal.kpoints.label.color, optionsFinal.kpoints.label.font, optionsFinal.kpoints.label.size, new THREE.Vector2().fromArray(optionsFinal.kpoints.label.offset2D), optionsFinal.kpoints.label.stroke.width, optionsFinal.kpoints.label.stroke.width);
                    this.info.add(kpointLabel);
                }
            }
        }
    }
    /**
     * Adjust the zoom so that the contents fit on the screen. Notice that is is
     * typically useful to center around a point of interest first.
     *
     * @param {number} margin - Margin to apply.
     */
    fit(margin = 0) {
        // The corners of the BZ will be used as visualization boundaries
        const mesh = this.root.getObjectByName("group").getObjectByName("outermesh");
        this.root.updateMatrixWorld(); // This update is required
        const vertices = [];
        const verticesArray = mesh.geometry.attributes.position.array;
        const nVertices = verticesArray.length / 3;
        for (let i = 0; i < nVertices; ++i) {
            vertices.push(new THREE.Vector3().fromArray(verticesArray, i * 3));
        }
        // Transform positions to world coordinates
        const worldPos = [];
        for (let i = 0; i < nVertices; ++i) {
            const pos = vertices[i];
            worldPos.push(mesh.localToWorld(pos));
        }
        this.fitViewToPoints(worldPos, margin);
    }
    /**
     * Used to rotate the contents based of the alignment of the basis cell
     * vectors or the segments with respect to the cartesian axes.
     *
     * @param alignments List of up to two alignments for any two axis vectors.
     * E.g. [["up", "c"], ["right", "segments"]] will force the third basis
     * vector to point exactly up, and the segments to as close to right as
     * possible. The alignments are applied in the given order.
     */
    align(alignments) {
        // Determine segment direction
        const segmentVector = new THREE.Vector3();
        const nPoints = this.labelPoints.children.length;
        for (let i = 0; i < nPoints; ++i) {
            const segmentPoint = this.labelPoints.children[i];
            segmentVector.add(segmentPoint.getWorldPosition(new THREE.Vector3()));
        }
        // Define available directions
        const directions = {
            "a": this.basisVectors[0].clone(),
            "-a": this.basisVectors[0].clone().negate(),
            "b": this.basisVectors[1].clone(),
            "-b": this.basisVectors[1].clone().negate(),
            "c": this.basisVectors[2].clone(),
            "-c": this.basisVectors[2].clone().negate(),
            "segments": segmentVector,
        };
        // Align
        super.alignView(alignments, directions);
    }
    createCircle(position, diameter, color) {
        // Configure canvas
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        // Draw circle
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(diameter, diameter, 1);
        const labelRoot = new THREE.Object3D();
        labelRoot.position.copy(position);
        labelRoot.add(sprite);
        return labelRoot;
    }
}
