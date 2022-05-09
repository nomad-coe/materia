import { Viewer } from "./viewer";
import * as THREE from "three";
import { getConvexGeometry } from './convexgeometry';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import voronoi from 'voronoi-diagram';
/*
 * A 3D visualizer for the Brillouin Zone and the k-point path within it.
 */
export class BrillouinZoneViewer extends Viewer {
    /*
     * Overrides the implementation from the base class, as we need two scenes:
     * one for the BZ mesh and another for the information that is laid on top.
     */
    setupScenes() {
        this.scenes = [];
        this.sceneZone = new THREE.Scene();
        this.scenes.push(this.sceneZone);
        this.sceneInfo = new THREE.Scene();
        this.scenes.push(this.sceneInfo);
    }
    setupLights() {
        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.45);
        keyLight.position.set(0, 0, 20);
        this.sceneZone.add(keyLight);
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-20, 0, -20);
        this.sceneZone.add(fillLight);
        // Back light
        const backLight = new THREE.DirectionalLight(0xffffff, 0.25);
        backLight.position.set(20, 0, -20);
        this.sceneZone.add(backLight);
        // White ambient light.
        const ambientLight = new THREE.AmbientLight(0x404040, 3.7); // soft white light
        this.sceneZone.add(ambientLight);
    }
    /**
     * Visualizes the first Brillouin zone of the given reciprocal lattice and
     * optional k-path segments and k-point labels within it.
     *
     * @param {object} data A Javascript object containing the visualized
     * structure. See below for the subparameters.
     * @param {number[][]} data.basis The basis vectors of the reciprocal cell as
     *   rows of a 3x3 array.
     * @param {number[][]} data.segments List containing lists of k-points,
     * each sublist indicating a continuous segment within the Brillouin zone.
     * @param {*} data.kpoints List of pairs of labels and reciprocal
     * lattice coordinates for specific k-points that should be shown.
     */
    load(data) {
        var _a, _b, _c, _d, _e, _f;
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
        const basis = data["basis"];
        const segments = data["segments"];
        const kpoints = data["kpoints"];
        this.basis = data["basis"];
        if (!basis || !segments) {
            console.log("The data given for the Brillouin zone viewer is incomplete.");
            return false;
        }
        else {
            this.createBrillouinZone(basis, segments, kpoints);
        }
        // Set view alignment and rotation
        if (this.B !== undefined) {
            this.alignView((_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.layout) === null || _b === void 0 ? void 0 : _b.viewRotation) === null || _c === void 0 ? void 0 : _c.alignments);
        }
        this.rotateView((_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.layout) === null || _e === void 0 ? void 0 : _e.viewRotation) === null || _f === void 0 ? void 0 : _f.rotations);
        if (this.options.view.autoFit) {
            super.fitToCanvas();
        }
        this.render();
        return true;
    }
    /**
     * Used to setup the visualization options.
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
     *
     * @param {string} options.renderer.background.color Color of the background.
     * @param {number} options.renderer.background.opacity Opacity of the background.
     *
     * @param {boolean} render Whether to perform a render after setting the
     * options. Defaults to true. You should only disable this setting if you
     * plan to do a render manually afterwards.
     */
    setOptions(options, render = true, reload = true) {
        var _a, _b, _c;
        // The default settings object
        const defaultOptions = {
            controls: {
                rotateSpeed: 40,
                enablePan: false
            },
            view: {
                fitMargin: 0.075,
            },
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
        // Upon first call, fill the missing values with default options
        if (Object.keys(this.options).length === 0) {
            this.fillOptions(options, defaultOptions);
            super.setOptions(defaultOptions);
            // On subsequent calls update only the given values and simply do a full
            // reload for the structure. This is not efficient by any means for most
            // settings but gets the job done for now.
        }
        else {
            this.fillOptions(options, this.options);
            super.setOptions(this.options);
            // Reload structure if requested. TODO: Implement smart partial updates.
            if (reload) {
                if (this.data !== undefined) {
                    this.load(this.data);
                }
            }
            if (((_a = options === null || options === void 0 ? void 0 : options.renderer) === null || _a === void 0 ? void 0 : _a.background) !== undefined) {
                this.setBackgroundColor((_b = options === null || options === void 0 ? void 0 : options.renderer) === null || _b === void 0 ? void 0 : _b.background.color, (_c = options === null || options === void 0 ? void 0 : options.renderer) === null || _c === void 0 ? void 0 : _c.background.opacity);
            }
            if (render) {
                this.render();
            }
        }
    }
    /*
     * Used to create the representation for the first Brillouin Zone.
     */
    createBrillouinZone(basis, segments, kpoints) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        // Create list of reciprocal lattice points
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
        this.zone = new THREE.Object3D();
        this.zone.name = "zone";
        this.sceneZone.add(this.zone);
        this.info = new THREE.Object3D();
        this.info.name = "info";
        this.sceneInfo.add(this.info);
        // A customised THREE.BufferGeometry object that will create the face
        // geometry and information about the face edges
        const { geometry, faces } = getConvexGeometry(bzVertices);
        // Weird hack for achieving translucent surfaces. Setting
        // side=DoubleSide on a single mesh will not do.
        const group = new THREE.Group();
        group.name = "group";
        const meshMaterial = new THREE.MeshPhongMaterial({
            color: this.options.faces.color,
            opacity: this.options.faces.opacity,
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
        this.zone.add(group);
        // Create edges as closed loops around each face
        const edgeWidth = this.options.faces.outline.width;
        const edgeMaterial = new MeshLineMaterial({
            color: this.options.faces.outline.color,
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
            this.zone.add(edgeMesh);
        }
        // Create the reciprocal space axes
        const basisLabels = [this.options.basis.a.label, this.options.basis.b.label, this.options.basis.c.label];
        const basisFonts = [];
        basisFonts.push(((_a = this.options.basis.a) === null || _a === void 0 ? void 0 : _a.font) === undefined ? this.options.basis.font : this.options.basis.a.font);
        basisFonts.push(((_b = this.options.basis.b) === null || _b === void 0 ? void 0 : _b.font) === undefined ? this.options.basis.font : this.options.basis.b.font);
        basisFonts.push(((_c = this.options.basis.c) === null || _c === void 0 ? void 0 : _c.font) === undefined ? this.options.basis.font : this.options.basis.c.font);
        const basisFontSizes = [];
        basisFontSizes.push(((_d = this.options.basis.a) === null || _d === void 0 ? void 0 : _d.size) === undefined ? this.options.basis.size : this.options.basis.a.size);
        basisFontSizes.push(((_e = this.options.basis.b) === null || _e === void 0 ? void 0 : _e.size) === undefined ? this.options.basis.size : this.options.basis.b.size);
        basisFontSizes.push(((_f = this.options.basis.c) === null || _f === void 0 ? void 0 : _f.size) === undefined ? this.options.basis.size : this.options.basis.c.size);
        const cellBasisColors = [];
        cellBasisColors.push(((_g = this.options.basis.a) === null || _g === void 0 ? void 0 : _g.color) === undefined ? this.options.basis.color : this.options.basis.a.color);
        cellBasisColors.push(((_h = this.options.basis.b) === null || _h === void 0 ? void 0 : _h.color) === undefined ? this.options.basis.color : this.options.basis.b.color);
        cellBasisColors.push(((_j = this.options.basis.c) === null || _j === void 0 ? void 0 : _j.color) === undefined ? this.options.basis.color : this.options.basis.c.color);
        const strokeColors = [];
        strokeColors.push(((_l = (_k = this.options.basis.a) === null || _k === void 0 ? void 0 : _k.stroke) === null || _l === void 0 ? void 0 : _l.color) === undefined ? this.options.basis.stroke.color : this.options.basis.a.stroke.color);
        strokeColors.push(((_o = (_m = this.options.basis.b) === null || _m === void 0 ? void 0 : _m.stroke) === null || _o === void 0 ? void 0 : _o.color) === undefined ? this.options.basis.stroke.color : this.options.basis.b.stroke.color);
        strokeColors.push(((_q = (_p = this.options.basis.c) === null || _p === void 0 ? void 0 : _p.stroke) === null || _q === void 0 ? void 0 : _q.color) === undefined ? this.options.basis.stroke.color : this.options.basis.c.stroke.color);
        const strokeWidths = [];
        strokeWidths.push(((_s = (_r = this.options.basis.a) === null || _r === void 0 ? void 0 : _r.stroke) === null || _s === void 0 ? void 0 : _s.width) === undefined ? this.options.basis.stroke.width : this.options.basis.a.stroke.width);
        strokeWidths.push(((_u = (_t = this.options.basis.b) === null || _t === void 0 ? void 0 : _t.stroke) === null || _u === void 0 ? void 0 : _u.width) === undefined ? this.options.basis.stroke.width : this.options.basis.b.stroke.width);
        strokeWidths.push(((_w = (_v = this.options.basis.c) === null || _v === void 0 ? void 0 : _v.stroke) === null || _w === void 0 ? void 0 : _w.width) === undefined ? this.options.basis.stroke.width : this.options.basis.c.stroke.width);
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
                .multiplyScalar(1 + this.options.basis.offset / dir.length());
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
            color: this.options.segments.color,
            lineWidth: this.options.segments.linewidth,
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
                if (this.options.kpoints.point.enabled) {
                    const kpointCircle = this.createCircle(kpointCartesian, this.options.kpoints.point.size, this.options.kpoints.point.color);
                    this.info.add(kpointCircle);
                }
                if (this.options.kpoints.label.enabled) {
                    const kpointLabel = this.createLabel(kpointCartesian, label, this.options.kpoints.label.color, this.options.kpoints.label.font, this.options.kpoints.label.size, new THREE.Vector2().fromArray(this.options.kpoints.label.offset2D), this.options.kpoints.label.stroke.width, this.options.kpoints.label.stroke.width);
                    this.info.add(kpointLabel);
                }
            }
        }
    }
    getCornerPoints() {
        // The corners of the BZ will be used as visualization boundaries
        const mesh = this.zone.getObjectByName("group").getObjectByName("outermesh");
        mesh.updateMatrixWorld();
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
        return {
            points: worldPos,
            margin: 0,
        };
    }
    /**
     * @param rotations The rotations as a list. Each rotation should be an
     * array containing four numbers: [x, y, z, angle]. The rotations are
     * applied in the given order.
     */
    rotateView(rotations, render = true) {
        if (rotations === undefined) {
            return;
        }
        for (const r of rotations) {
            const basis = new THREE.Vector3(r[0], r[1], r[2]);
            basis.normalize();
            const angle = r[3] / 180 * Math.PI;
            this.rotateAroundWorldAxis(this.zone, basis, angle);
            this.rotateAroundWorldAxis(this.info, basis, angle);
        }
        if (render) {
            this.render();
        }
    }
    alignView(alignments, render = true) {
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
        // List the objects whose matrix needs to be updated
        const objects = [this.zone, this.info];
        // Rotate
        super.alignView(alignments, directions, objects, render);
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
