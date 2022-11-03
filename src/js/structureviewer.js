import { Viewer } from "./viewer";
import objectHash from '../js/object_hash.js';
import { isNumber, isArray, isPlainObject, isNil, range, merge, cloneDeep } from "lodash";
import * as THREE from "three";
/**
 * Class for visualizing an atomic structure.
 */
export class StructureViewer extends Viewer {
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
     * @param {Object} options.atoms Default options for the atoms-function. See
     *   the function for more information.
     * @param {Object} options.bonds Default options for the bonds-function. See
     *   the function for more information.
     * @param {Object} options.cell Default options for the cell-function. See
     *   the function for more information.
     * @param {Object} options.latticeConstants Default options for the
     *   latticeConstants-function. See the function for more information.
     */
    constructor(hostElement, options = {}) {
        super(hostElement, options);
        this.hostElement = hostElement;
        this.atomicRadii = []; // Contains the atomic radii
        this.elementColors = []; // Contains the element colors
        this.meshMap = {}; // Contains mappings from hashes to THREE.js meshes.
        this.atomConfigMap = {}; // Contains mappings from atom indices to config hashes
        this.configMap = {}; // Contains mappings from config hashes to configs
        this.lights = []; // Contains the lights in the scene
        this.bondFills = []; // Contains the bulk of the bonds
        this.atomFills = []; // Contains the bulk of the atoms
        this.atomOutlines = []; // Contains the outlines of the atoms
        this.axisLabels = []; // List of all labels in the view.
        this.label_missing = 'X';
        this.elementNames = [
            this.label_missing, 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si',
            'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni',
            'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb',
            'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
            'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho',
            'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
            'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np',
            'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg',
            'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og' // Og = 118
        ];
        this.elementNumbers = {
            [this.label_missing]: 0, 'H': 1, 'He': 2, 'Li': 3, 'Be': 4,
            'B': 5, 'C': 6, 'N': 7, 'O': 8, 'F': 9,
            'Ne': 10, 'Na': 11, 'Mg': 12, 'Al': 13, 'Si': 14,
            'P': 15, 'S': 16, 'Cl': 17, 'Ar': 18, 'K': 19,
            'Ca': 20, 'Sc': 21, 'Ti': 22, 'V': 23, 'Cr': 24,
            'Mn': 25, 'Fe': 26, 'Co': 27, 'Ni': 28, 'Cu': 29,
            'Zn': 30, 'Ga': 31, 'Ge': 32, 'As': 33, 'Se': 34,
            'Br': 35, 'Kr': 36, 'Rb': 37, 'Sr': 38, 'Y': 39,
            'Zr': 40, 'Nb': 41, 'Mo': 42, 'Tc': 43, 'Ru': 44,
            'Rh': 45, 'Pd': 46, 'Ag': 47, 'Cd': 48, 'In': 49,
            'Sn': 50, 'Sb': 51, 'Te': 52, 'I': 53, 'Xe': 54,
            'Cs': 55, 'Ba': 56, 'La': 57, 'Ce': 58, 'Pr': 59,
            'Nd': 60, 'Pm': 61, 'Sm': 62, 'Eu': 63, 'Gd': 64,
            'Tb': 65, 'Dy': 66, 'Ho': 67, 'Er': 68, 'Tm': 69,
            'Yb': 70, 'Lu': 71, 'Hf': 72, 'Ta': 73, 'W': 74,
            'Re': 75, 'Os': 76, 'Ir': 77, 'Pt': 78, 'Au': 79,
            'Hg': 80, 'Tl': 81, 'Pb': 82, 'Bi': 83, 'Po': 84,
            'At': 85, 'Rn': 86, 'Fr': 87, 'Ra': 88, 'Ac': 89,
            'Th': 90, 'Pa': 91, 'U': 92, 'Np': 93, 'Pu': 94,
            'Am': 95, 'Cm': 96, 'Bk': 97, 'Cf': 98, 'Es': 99,
            'Fm': 100, 'Md': 101, 'No': 102, 'Lr': 103, 'Rf': 104,
            'Db': 105, 'Sg': 106, 'Bh': 107, 'Hs': 108, 'Mt': 109,
            'Ds': 110, 'Rg': 111, 'Cn': 112, 'Nh': 113, 'Fl': 114,
            'Mc': 115, 'Lv': 116, 'Ts': 117, 'Og': 118,
        };
        //  Covalent radii revisited,
        //  Beatriz Cordero, Verónica Gómez, Ana E. Platero-Prats, Marc Revés,
        //  Jorge Echeverría, Eduard Cremades, Flavia Barragán and Santiago Alvarez,
        //  Dalton Trans., 2008, 2832-2838 DOI:10.1039/B801115J
        this.radii_unknown = 0.1;
        this.covalentRadii = [
            this.radii_unknown,
            0.31,
            0.28,
            1.28,
            0.96,
            0.84,
            0.76,
            0.71,
            0.66,
            0.57,
            0.58,
            1.66,
            1.41,
            1.21,
            1.11,
            1.07,
            1.05,
            1.02,
            1.06,
            2.03,
            1.76,
            1.7,
            1.6,
            1.53,
            1.39,
            1.39,
            1.32,
            1.26,
            1.24,
            1.32,
            1.22,
            1.22,
            1.2,
            1.19,
            1.2,
            1.2,
            1.16,
            2.2,
            1.95,
            1.9,
            1.75,
            1.64,
            1.54,
            1.47,
            1.46,
            1.42,
            1.39,
            1.45,
            1.44,
            1.42,
            1.39,
            1.39,
            1.38,
            1.39,
            1.4,
            2.44,
            2.15,
            2.07,
            2.04,
            2.03,
            2.01,
            1.99,
            1.98,
            1.98,
            1.96,
            1.94,
            1.92,
            1.92,
            1.89,
            1.9,
            1.87,
            1.87,
            1.75,
            1.7,
            1.62,
            1.51,
            1.44,
            1.41,
            1.36,
            1.36,
            1.32,
            1.45,
            1.46,
            1.48,
            1.4,
            1.5,
            1.5,
            2.6,
            2.21,
            2.15,
            2.06,
            2.0,
            1.96,
            1.9,
            1.87,
            1.8,
            1.69,
            this.radii_unknown,
            this.radii_unknown,
            this.radii_unknown,
            this.radii_unknown,
            this.radii_unknown,
            this.radii_unknown,
            this.radii_unknown,
        ];
        // Jmol colors. See: http://jmol.sourceforge.net/jscolors/#color_U
        this.color_unknown = "#ff1493";
        this.jmolColors = [
            this.color_unknown,
            "#ffffff",
            "#d9ffff",
            "#cc80ff",
            "#c2ff00",
            "#ffb5b5",
            "#909090",
            "#3050f8",
            "#ff0d0d",
            "#90e050",
            "#b3e3f5",
            "#ab5cf2",
            "#8aff00",
            "#bfa6a6",
            "#f0c8a0",
            "#ff8000",
            "#ffff30",
            "#1ff01f",
            "#80d1e3",
            "#8f40d4",
            "#3dff00",
            "#e6e6e6",
            "#bfc2c7",
            "#a6a6ab",
            "#8a99c7",
            "#9c7ac7",
            "#e06633",
            "#f090a0",
            "#50d050",
            "#c88033",
            "#7d80b0",
            "#c28f8f",
            "#668f8f",
            "#bd80e3",
            "#ffa100",
            "#a62929",
            "#5cb8d1",
            "#702eb0",
            "#00ff00",
            "#94ffff",
            "#94e0e0",
            "#73c2c9",
            "#54b5b5",
            "#3b9e9e",
            "#248f8f",
            "#0a7d8c",
            "#006985",
            "#c0c0c0",
            "#ffd98f",
            "#a67573",
            "#668080",
            "#9e63b5",
            "#d47a00",
            "#940094",
            "#429eb0",
            "#57178f",
            "#00c900",
            "#70d4ff",
            "#ffffc7",
            "#d9ffc7",
            "#c7ffc7",
            "#a3ffc7",
            "#8fffc7",
            "#61ffc7",
            "#45ffc7",
            "#30ffc7",
            "#1fffc7",
            "#00ff9c",
            "#00e675",
            "#00d452",
            "#00bf38",
            "#00ab24",
            "#4dc2ff",
            "#4da6ff",
            "#2194d6",
            "#267dab",
            "#266696",
            "#175487",
            "#d0d0e0",
            "#ffd123",
            "#b8b8d0",
            "#a6544d",
            "#575961",
            "#9e4fb5",
            "#ab5c00",
            "#754f45",
            "#428296",
            "#420066",
            "#007d00",
            "#70abfa",
            "#00baff",
            "#00a1ff",
            "#008fff",
            "#0080ff",
            "#006bff",
            "#545cf2",
            "#785ce3",
            "#8a4fe3",
            "#a136d4",
            "#b31fd4",
            "#b31fba",
            "#b30da6",
            "#bd0d87",
            "#c70066",
            "#cc0059",
            "#d1004f",
            "#d90045",
            "#e00038",
            "#e6002e",
            "#eb0026",
        ];
    }
    /**
     * Saves the default options.
    */
    setOptions(options) {
        // Save default settings
        const atomDefaults = {
            material: {
                phong: {
                    shininess: 30,
                }
            },
            outline: {
                enabled: true,
                color: "#000000",
                size: 0.025,
            },
            opacity: 1,
            color: "Jmol",
            radius: "covalent",
            scale: 1,
            smoothness: 165,
        };
        const bondDefaults = {
            enabled: true,
            material: {
                phong: {
                    shininess: 30,
                }
            },
            outline: {
                enabled: true,
                color: "#000000",
                size: 0.025,
            },
            color: "#ffffff",
            radius: 0.08,
            threshold: 1,
            smoothness: 145
        };
        const cellDefaults = {
            enabled: true,
            color: "#000000",
            linewidth: 1.5,
            dashSize: 0,
            gapSize: 0,
            periodicity: [true, true, true],
        };
        const latticeConstantDefaults = {
            enabled: true,
            periodicity: [true, true, true],
            font: "Arial",
            size: 0.7,
            stroke: {
                width: 0.06,
                color: "#000",
            },
            a: {
                enabled: true,
                color: "#C52929",
                label: "a",
            },
            b: {
                enabled: true,
                color: "#47A823",
                label: "b",
            },
            c: {
                enabled: true,
                color: "#3B5796",
                label: "c",
            },
            alpha: {
                enabled: true,
                color: "#ffffff",
                label: "α",
            },
            beta: {
                enabled: true,
                color: "#ffffff",
                label: "β",
            },
            gamma: {
                enabled: true,
                color: "#ffffff",
                label: "γ",
            }
        };
        this.atomDefaults = merge(cloneDeep(atomDefaults), cloneDeep(options === null || options === void 0 ? void 0 : options.atoms));
        this.bondDefaults = merge(cloneDeep(bondDefaults), cloneDeep(options === null || options === void 0 ? void 0 : options.bonds));
        this.cellDefaults = merge(cloneDeep(cellDefaults), cloneDeep(options === null || options === void 0 ? void 0 : options.cell));
        this.latticeConstantDefaults = merge(cloneDeep(latticeConstantDefaults), cloneDeep(options === null || options === void 0 ? void 0 : options.latticeConstants));
    }
    /*
     * Overrides the implementation from the base class, as we need two scenes:
     * one for the structure and another for the information that is laid on
     * top.
     */
    setupScenes() {
        // Setup the scenes in rendering order
        this.scenes = [];
        this.sceneStructure = new THREE.Scene();
        this.scenes.push(this.sceneStructure);
        this.sceneInfo = new THREE.Scene();
        this.scenes.push(this.sceneInfo);
        this.root = new THREE.Object3D();
        this.container = new THREE.Object3D();
        this.info = new THREE.Object3D();
        this.atomsObject = new THREE.Object3D();
        this.bondsObject = new THREE.Object3D();
        this.container.add(this.atomsObject);
        this.container.add(this.bondsObject);
        this.angleArcs = new THREE.Object3D();
        this.root.add(this.container);
        this.sceneStructure.add(this.root);
        this.sceneInfo.add(this.info);
        this.latticeConstantsGroup = new THREE.Object3D();
        this.container.add(this.latticeConstantsGroup);
        // Setup the objects that are affected by rotations etc.
        this.objects = [this.root, this.info];
    }
    /**
     * Returns information about the elements included in the structure.
     * @returns {Object} The current options.
     */
    getElementInfo() {
        return this.elements;
    }
    /**
     * Hides or shows the shadows.
     */
    toggleShadows(value) {
        this.renderer.shadowMap.enabled = value;
        for (let i = 0; i < this.lights.length; ++i) {
            const light = this.lights[i];
            light.castShadow = value;
        }
        for (let i = 0; i < this.atomFills.length; ++i) {
            const atom = this.atomFills[i];
            atom.receiveShadow = value;
            atom.castShadow = value;
            atom.material.needsUpdate = true;
        }
        for (let i = 0; i < this.bondFills.length; ++i) {
            const bond = this.bondFills[i];
            bond.receiveShadow = value;
            bond.castShadow = value;
            bond.material.needsUpdate = true;
        }
        // For some reason double rendering is required... Maybe delay()?
        // this.render();
        // this.render();
    }
    /**
     * Visualizes the given atomic structure.
     *
     * @param {object} structure A Javascript object containing the structure. See
     *   below for the subparameters.
     * @param {number[][]} structure.positions Atomic positions. Default
     *   interpretation is as cartesian positions, but you can specify whether they
     *   are cartesial or fractional with the "fractional" attribute.
     * @param {boolean} structure.fractional Whether the given positions are
     *   fractional or not. Defaults to false if not specified.
     * @param {string[]|number[]} structure.species Atomic numbers or chemical symbols of the atoms.
     * @param {number[]} structure.cell The lattice vectors of the unit cell as
     *   rows of a 3x3 array.
     * @param {boolean[]} structure.pbc The periodic boundary conditions for
     *   the structure as a list of three boolean values for each lattice
     *   vector direction. Defaults to [false, false, false].
     * @param {number[][]} structure.bonds Optional manually set bonds. Provide a
     *   list of atomic index pairs, each pair specifying a bond between atoms.
     *   If these bonds are not specified, the visualizer will by default use an
     *   automated detection of bonds. This can be disabled through
     *   options.bonds.enabled.
     * @param {string} structure.wrap.type How atomic positions are
     * wrapped in periodic systems. Available options are:
     *    - "none": Visualized as is.
     *    - "boundary": Positions that are on the cell boundaries are repeated.
     *    - [a, b, c]: Positions are repeated along each lattice vector the
     *      given amount of times.
     *   Defaults to 'none'
     * @param {number} structure.wrap.tolerance The wrapping
     *   tolerance in angstroms. Defaults to 1e-8.
     */
    load(structure) {
        // Save the structure for reloading
        this.structure = structure;
        // Determine the radii to be used
        this.atomicRadii = this.covalentRadii;
        // Determine the atom colors to be used
        this.elementColors = this.jmolColors;
        // Check that the received data is OK.
        const isFractional = structure["fractional"] === undefined ? false : structure["fractional"];
        const positions = structure["positions"];
        const species = structure["species"];
        const cell = structure["cell"];
        const wrap = merge({ type: 'none', tolerance: 1e-8 }, cloneDeep(structure["wrap"]));
        const periodicity = structure["pbc"] || [false, false, false];
        let bonds = structure["bonds"];
        if (!positions) {
            console.log("No atom positions given to the structure viewer");
            return false;
        }
        if (!species) {
            console.log("No species given to the structure viewer.");
            return false;
        }
        // Determine the atomicNumbers if not given
        const atomicNumbers = typeof species[0] === "number"
            ? species.map(Z => (Z < 0 || Z >= this.elementNames.length) ? 0 : Z)
            : species.map(symb => this.elementNumbers[symb] || 0);
        this.maxRadii = Math.max(...atomicNumbers.map(Z => this.getRadii(Z)));
        // If bonds are not explicitly stated, determine them automatically.
        if (!bonds) {
            bonds = "auto";
        }
        else {
            if (!Array.isArray(bonds)) {
                console.log("Invalid value for 'bonds'. Provide a list of index pairs.");
                return false;
            }
        }
        if (positions.length != atomicNumbers.length) {
            console.log("The number of positions does not match the number of labels.");
            return false;
        }
        // Create a set of fractional and cartesian positions
        this.createBasisVectors(cell);
        let fracPos = [];
        let cartPos = [];
        // Create a set of fractional and cartesian positions
        if (isFractional === true) {
            fracPos = this.toVectors(positions);
            cartPos = this.toCartesian(fracPos, true);
        }
        else if (isFractional === false) {
            cartPos = this.toVectors(positions);
            if (this.B !== undefined) {
                fracPos = this.toScaled(cartPos, true);
            }
        }
        // Valid cell basis
        if (this.B !== undefined) {
            this.createAtoms(fracPos, atomicNumbers, periodicity, true, wrap);
            // Cell with non-valid basis
        }
        else if (this.basisVectors !== undefined) {
            this.createAtoms(cartPos, atomicNumbers, periodicity, false, wrap);
            // No cell at all
        }
        else {
            this.createAtoms(cartPos, atomicNumbers, periodicity, false, wrap);
        }
        this.toggleShadows(this.rendererDefaults.shadows.enabled);
        return true;
    }
    /**
     * Calculates the center of points.
     */
    calculateCOP(positions) {
        const nPos = positions.length;
        const sum = new THREE.Vector3();
        for (let i = 0; i < nPos; ++i) {
            const pos = positions[i];
            sum.add(pos);
        }
        sum.divideScalar(nPos);
        return sum;
    }
    /**
     * Centers the visualization around a specific point.
     * @param position - The position to center on. Can be one of:
     *   - 'COP': Center of all atom positions.
     *   - 'COC': Center of the cell.
     *   - Array<Number>: An array of atomic indices, the COP will be used.
     *   - Array<Array<Number>>: An array of positions, the COP will be used.
     */
    center(positions) {
        let centerPos;
        if (positions === "COP") {
            const atomPos = this.getPositionsGlobal();
            centerPos = this.calculateCOP(atomPos);
        }
        else if (positions == 'COC') {
            centerPos = this.getCOCGlobal();
        }
        else if (isArray(positions)) {
            if (isNumber(positions[0])) {
                const atomPos = this.getPositionsGlobal();
                const points = positions.map(i => atomPos[i]);
                centerPos = this.calculateCOP(points);
            }
            else {
                const points = this.toVectors(positions);
                centerPos = this.calculateCOP(points);
            }
        }
        else {
            throw Error("Invalid center positions.");
        }
        this.translate(centerPos.multiplyScalar(-1));
    }
    /**
     * Adjust the zoom so that the contents fit on the screen. Notice that is is
     * typically useful to center around a point of interest first.
     *
     * @param position - The positions to take into account when fitting. Can be
     *   one of:
     *   - 'full': Fit the full view
     *   - Array<Number>: An array of atomic indices, the COP will be used.
     *   - Array<Array<Number>>: An array of positions, the COP will be used.
     * @param {number} margin - Margin to apply, given in angstroms.
     */
    fit(positions, margin = 0) {
        let points;
        let addedMargin = 0;
        if (positions === 'full') {
            points = this.getPositionsGlobal();
            addedMargin = this.maxRadii;
        }
        else if (isArray(positions)) {
            if (isNumber(positions[0])) {
                const atomGlobalPos = this.getPositionsGlobal();
                points = positions.map(i => atomGlobalPos[i]);
                addedMargin = Math.max(...positions.map(i => this.getRadii(this.atomicNumbers[i])));
            }
            else {
                points = this.toVectors(positions);
                points = points.map(p => p.clone().add(this.translation));
            }
        }
        else {
            throw Error("Invalid fit positions.");
        }
        this.fitViewToPoints(points, margin + addedMargin);
    }
    /**
     * Used to rotate the structure based of the alignment of the basis cell
     * vectors with respect to the cartesian axes.
     *
     * @param alignments List of  up to two alignments for any two axis vectors.
     * E.g. [["up", "c"], ["right", "b"]] will force the third basis vector to
     * point exactly up, and the second basis vector to as close to right as
     * possible. The alignments are applied in the given order.
     */
    align(alignments) {
        // Define available directions
        const directions = {
            "a": this.basisVectors[0].clone(),
            "-a": this.basisVectors[0].clone().negate(),
            "b": this.basisVectors[1].clone(),
            "-b": this.basisVectors[1].clone().negate(),
            "c": this.basisVectors[2].clone(),
            "-c": this.basisVectors[2].clone().negate(),
        };
        // Align
        super.alignView(alignments, directions);
    }
    /**
     * Creates/updates representation for the atoms based on the given list of
     * options. Notice that you can select the targeted atoms using the
     * include/exclude options and also provide several configurations at once
     * using a list.
     *
     * @param {object} options A Javascript object, or array of
     *   objects containing the visualizaiton options. See below for the
     *   subparameters.
     * @param {number} options.include List of atomic indices to target with
     * these options.
     * @param {number} options.exclude List of atomic indices to exclude from
     * these options.
     * @param {number} options.smoothness A value between 0-180 that
     *   controls the number of polygons. Used as the angle between adjacent
     *   cylinder/sphere sectors that indirectly controls the number of
     *   polygons.
     * @param {number} options.opacity The opacity of the atom
     * @param {number} options.material.phong.shininess Shininess of the
     * atom material (for phong material)
     * @param {number} options.material.toon.tones Tone-steps for toon
     * material
     * @param {string|number[]} options.radii The radius to use for the
     * atom.  Defaults to covalent radii. Available options are:
     *
     *   - "covalent": Covalent radius from DOI:10.1039/B801115J.
     *   - Radius in angstrom.
     *
     * @param {string|string[]} options.color The color to use. Available
     * options are:
     *
     *   - "Jmol" (default): Jmol color.
     *   - Hexadecimal color, e.g. '#ffffff'
     *
     * @param {number} options.scale Scaling factor for the atomic radii.
     * Used to scale the given radius.
     * @param {boolean} options.outline.enabled Used to enable or disable a
     *   fixed color outline around the atom. Notice that enabling the
     *   outline incurs a performance penalty.
     * @param {string} options.outline.color Outline color.
     * @param {number} options.outline.size Outline size.
     */
    atoms(options) {
        // Update configs sequentially
        if (isNil(options)) {
            options = [{}];
        }
        else if (isPlainObject(options)) {
            options = [options];
        }
        for (let config of options) {
            config = merge(cloneDeep(this.atomDefaults), cloneDeep(config));
            const include = config.include;
            const exclude = config.exclude;
            const hasInclude = !isNil(include);
            const hasExclude = !isNil(exclude);
            let indices;
            const nAtoms = this.atomicNumbers.length;
            if (hasInclude && hasExclude) {
                throw Error("Only provide include or exclude, not both.");
            }
            else if (hasInclude) {
                indices = include;
            }
            else if (hasExclude) {
                const excludeSet = new Set(exclude);
                indices = range(nAtoms).filter(x => !excludeSet.has(x));
            }
            else {
                indices = range(nAtoms);
            }
            // A hash is create for each configuration. This way we can store
            // the config for each atom and easily see if e.g. meshes can be
            // reused between atom instances.
            delete config.include;
            delete config.exclude;
            const configHash = objectHash(config, { algorithm: 'md5' });
            this.configMap[configHash] = config;
            // Create/update visuals representations of the 3D atoms
            for (const i of indices) {
                this.atomConfigMap[i] = configHash;
                this.updateAtom(i, config, configHash);
            }
        }
    }
    /**
     * Creates/updates bond representation based on the given config.
     *
     * @param {boolean} options A Javascript object containing the options. See
     *   below for the subparameters.
     * @param {boolean} options.enabled Show bonds. Defaults to true.
     * @param {any} options.include The atom indices to take into account when
     *   creating bonds. Either provide a array or leave undefined to include
     *   all. Defaults to undefined.
     * @param {string} options.color Color of bonds. Defaults to "#ffffff".
     * @param {number} options.radius Bond radius. Defaults to 0.08.
     * @param {number} options.smoothness A value between 0-180 that
     *   controls the number of polygons. Used as the angle between adjacent
     *   cylinder/sphere sectors that indirectly controls the number of
     *   polygons. Defaults to 145.
     * @param {number} options.material.phong.shininess Shininess of the bond
     *   material. Defaults to 30.
     * @param {number} options.threshold Controls the automatic
     *   detection of bonds between atoms. If custom bonds have not been
     *   specified for the structure, bonds will be detected automatically with
     *   the following criteria: distance <= options.threshold * 1.1 * (radius1
     *   + radius2)
     * @param {boolean} options.outline.enabled Used to enable or disable a
     *   fixed color outline around the bond. Notice that enabling the
     *   outline incurs a performance penalty. Defaults to true.
     * @param {string} options.outline.color Outline color. Defaults to
     *   "#000000".
     * @param {number} options.outline.size Outline size. Defaults to 0.025.
     */
    bonds(options) {
        // Remove old bonds
        if (!isNil(this.bondsObject)) {
            this.bondFills = [];
            this.bondsObject.clear();
        }
        // Define final options
        const optionsFinal = merge(cloneDeep(this.bondDefaults), cloneDeep(options || {}));
        // Do not create new ones if disabled
        if (!optionsFinal.enabled) {
            return;
        }
        // Create the list of final indices
        const include = optionsFinal.include;
        const exclude = optionsFinal.exclude;
        const hasInclude = !isNil(include);
        const hasExclude = !isNil(exclude);
        let indices;
        const nAtoms = this.atomicNumbers.length;
        if (hasInclude && hasExclude) {
            throw Error("Only provide include or exclude, not both.");
        }
        else if (hasInclude) {
            indices = include;
        }
        else if (hasExclude) {
            const excludeSet = new Set(exclude);
            indices = range(nAtoms).filter(x => !excludeSet.has(x));
        }
        else {
            indices = range(nAtoms);
        }
        // Create material once
        let bondMaterial;
        if (optionsFinal.material.toon) {
            const nTones = optionsFinal.material.toon.tones;
            const colors = new Uint8Array(nTones);
            for (let c = 0; c <= nTones; c++) {
                colors[c] = (c / nTones) * 256;
            }
            const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);
            gradientMap.minFilter = THREE.NearestFilter;
            gradientMap.magFilter = THREE.NearestFilter;
            gradientMap.generateMipmaps = false;
            bondMaterial = new THREE.MeshToonMaterial({
                color: optionsFinal.color,
                gradientMap: gradientMap
            });
        }
        else {
            bondMaterial = new THREE.MeshPhongMaterial({
                color: optionsFinal.color,
                shininess: optionsFinal.material.phong.shininess
            });
        }
        // Create bonds for all specified pairs
        const atomPos = this.getPositionsLocal();
        for (const i of indices) {
            for (const j of indices) {
                if (j > i) {
                    const pos1 = atomPos[i];
                    const pos2 = atomPos[j];
                    const num1 = this.atomicNumbers[i];
                    const num2 = this.atomicNumbers[j];
                    const distance = pos2.clone().sub(pos1).length();
                    const configHashI = this.atomConfigMap[i];
                    const configHashJ = this.atomConfigMap[j];
                    const configI = this.configMap[configHashI];
                    const configJ = this.configMap[configHashJ];
                    const radii1 = configI.scale * this.getRadii(num1);
                    const radii2 = configJ.scale * this.getRadii(num2);
                    if (distance <= optionsFinal.threshold * 1.1 * (radii1 + radii2)) {
                        this.addBond(i, j, pos1, pos2, bondMaterial, optionsFinal);
                    }
                }
            }
        }
    }
    /**
     * Returns the color for the given atomic number.
     * @param {boolean} options.enabled Show unit cell wireframe. Defaults to true.
     * @param {boolean} options.color Unit cell wireframe color. Defaults to "#000000".
     * @param {boolean} options.linewidth Unit cell wireframe line width. Defaults to 1.5.
     * @param {boolean} options.dashSize Unit cell wireframe dash size. Defaults to 0.
     * Provide a value > 0 for a dashed line.
     * @param {boolean} options.gapSize Unit cell wireframe dash size. Defaults to 0.
     * Provide a value > 0 for a dashed line.
     * @param {boolean} options.periodicity Periodicity of the cell. The
     * non-periodic directions will be flattened. Defaults to [true, true, true].
     *
     */
    cell(options) {
        // Check that cell was defined for the structure
        if (isNil(this.basisVectors)) {
            throw Error("The loaded structure does not have any cell information.");
        }
        // Delete old instance
        if (!isNil(this.convCell)) {
            this.container.remove(this.convCell);
        }
        // Define final options
        const optionsFinal = merge(cloneDeep(this.cellDefaults), cloneDeep(options || {}));
        // Create new instance
        if (optionsFinal.enabled) {
            const cell = this.createCell(new THREE.Vector3(), this.basisVectors, this.basisVectorCollapsed, optionsFinal.periodicity, optionsFinal.color, optionsFinal.linewidth, optionsFinal.dashSize, optionsFinal.gapSize);
            this.convCell = cell;
            this.container.add(this.convCell);
        }
    }
    /**
     * Visualizes the lattice constants using the given visualization options.
     *
     * @param {boolean} options.enabled Show lattice parameters. Defaults to true.
     * @param {boolean} options.periodicity Periodicity of the lattice. Defaults
     *   to [true, true, true]:
     * @param {string} options.font Font size for lattice constants. Defaults to 0.7.
     * constants. Applied as default to all labels, can be overridden
     * individually for each lattice constant.
     * @param {string} options.color Font color for lattice constants. Applied
     * as default to all labels, can be overridden individually for each lattice
     * constant. Defaults to
     * @param {string} options.stroke.color Font stroke color
     *   for lattice constants. Defaults to "#000". Applied as default to all
     *   labels, can be overridden individually for each lattice constant.
     * @param {string} options.stroke.width Font stroke width
     *   for lattice constants. Defaults to "#000". Applied as default to all
     *   labels, can be overridden individually for each lattice constant.
     * @param {string} options.a.enabled Whether to display this lattice
     *   contant. Defaults to true.
     * @param {string} options.a.color Font color. Defaults to "#C52929".
     * @param {string} options.a.font Font family. Defaults to "Arial".
     * @param {number} options.a.size Font size. Defaults to 0.7.
     * @param {number} options.a.label The label to display. Defaults to "a".
     * @param {number} options.a.stroke.width Font stroke width. Defaults to 0.06.
     * @param {string} options.a.stroke.color Font stroke color. Defaults to "#000".
     * @param {string} options.b.enabled Whether to display this lattice
     *   contant. Defaults to true.
     * @param {string} options.b.color Font color. Defaults to "#47A823".
     * @param {string} options.b.font Font family. Defaults to "Arial".
     * @param {number} options.b.size Font size. Defaults to 0.7.
     * @param {number} options.b.label The label to display. Defaults to "b".
     * @param {number} options.b.stroke.width Font stroke width. Defaults to 0.06.
     * @param {string} options.b.stroke.color Font stroke color. Defaults to "#000".
     * @param {string} options.c.enabled Whether to display this lattice
     *   contant. Defaults to true.
     * @param {string} options.c.color Font color. Defaults to "#3B5796".
     * @param {string} options.c.font Font family. Defaults to "Arial".
     * @param {number} options.c.size Font size. Defaults to 0.7.
     * @param {number} options.c.label The label to display. Defaults to "c".
     * @param {number} options.c.stroke.width Font stroke width. Defaults to 0.06.
     * @param {string} options.c.stroke.color Font stroke color. Defaults to "#000".
     * @param {string} options.alpha.enabled Whether to display this lattice
     *   contant. Defaults to true.
     * @param {string} options.alpha.color Font color. Defaults to "#ffffff".
     * @param {string} options.alpha.font Font family. Defaults to "Arial".
     * @param {number} options.alpha.size Font size. Defaults to 0.7.
     * @param {number} options.alpha.label The label to display. Defaults to "α".
     * @param {number} options.alpha.stroke.width Font stroke width. Defaults to 0.06.
     * @param {string} options.alpha.stroke.color Font stroke color. Defaults to "#000".
     * @param {string} options.beta.enabled Whether to display this lattice
     *   contant. Defaults to true.
     * @param {string} options.beta.color Font color. Defaults to "#ffffff".
     * @param {string} options.beta.font Font family. Defaults to "Arial".
     * @param {number} options.beta.size Font size. Defaults to 0.7.
     * @param {number} options.beta.label The label to display. Defaults to "β".
     * @param {number} options.beta.stroke.width Font stroke width. Defaults to 0.06.
     * @param {string} options.beta.stroke.color Font stroke color. Defaults to "#000".
     * @param {string} options.gamma.enabled Whether to display this lattice
     *   contant. Defaults to true.
     * @param {string} options.gamma.color Font color. Defaults to "#ffffff".
     * @param {string} options.gamma.font Font family. Defaults to "Arial".
     * @param {number} options.gamma.size Font size. Defaults to 0.7.
     * @param {number} options.gamma.label The label to display. Defaults to "γ".
     * @param {number} options.gamma.stroke.width Font stroke width. Defaults to 0.06.
     * @param {string} options.gamma.stroke.color Font stroke color. Defaults to "#000".
     */
    latticeConstants(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        // Check that cell was defined for the structure
        if (isNil(this.basisVectors)) {
            throw Error("The loaded structure does not have any cell information.");
        }
        // Delete old instance
        this.latticeConstantsGroup.clear();
        this.axisLabels = [];
        this.angleArcs.clear();
        // Define final options
        const optionsFinal = merge(cloneDeep(this.latticeConstantDefaults), cloneDeep(options || {}));
        if (!optionsFinal.enabled) {
            return;
        }
        // Determine the periodicity and setup the vizualization accordingly
        const periodicIndices = [];
        for (let dim = 0; dim < 3; ++dim) {
            const p1 = optionsFinal.periodicity[dim];
            const p2 = optionsFinal.periodicity[(dim + 1) % 3];
            const p3 = optionsFinal.periodicity[(dim + 2) % 3];
            if (p1 && !p2 && !p3) {
                periodicIndices.push(dim);
                break;
            }
            else if (p1 && p2 && !p3) {
                periodicIndices.push(dim);
                periodicIndices.push((dim + 1) % 3);
                break;
            }
        }
        // Create new instances
        const basis = this.basisVectors;
        this.axisLabels = [];
        this.info.add(this.latticeConstantsGroup);
        this.info.add(this.angleArcs);
        const infoColor = 0x000000;
        const axisOffset = 1.3;
        let iBasis = -1;
        const cellBasisColors = [];
        cellBasisColors.push(optionsFinal.a.color);
        cellBasisColors.push(optionsFinal.b.color);
        cellBasisColors.push(optionsFinal.c.color);
        const angleColors = [];
        angleColors.push(optionsFinal.alpha.color);
        angleColors.push(optionsFinal.beta.color);
        angleColors.push(optionsFinal.gamma.color);
        const angleStrokeColors = [];
        angleStrokeColors.push(((_b = (_a = optionsFinal.alpha) === null || _a === void 0 ? void 0 : _a.stroke) === null || _b === void 0 ? void 0 : _b.color) === undefined ? optionsFinal.stroke.color : optionsFinal.alpha.stroke.color);
        angleStrokeColors.push(((_d = (_c = optionsFinal.beta) === null || _c === void 0 ? void 0 : _c.stroke) === null || _d === void 0 ? void 0 : _d.color) === undefined ? optionsFinal.stroke.color : optionsFinal.beta.stroke.color);
        angleStrokeColors.push(((_f = (_e = optionsFinal.gamma) === null || _e === void 0 ? void 0 : _e.stroke) === null || _f === void 0 ? void 0 : _f.color) === undefined ? optionsFinal.stroke.color : optionsFinal.gamma.stroke.color);
        const angleStrokeWidths = [];
        angleStrokeWidths.push(((_h = (_g = optionsFinal.alpha) === null || _g === void 0 ? void 0 : _g.stroke) === null || _h === void 0 ? void 0 : _h.width) === undefined ? optionsFinal.stroke.width : optionsFinal.alpha.stroke.width);
        angleStrokeWidths.push(((_k = (_j = optionsFinal.beta) === null || _j === void 0 ? void 0 : _j.stroke) === null || _k === void 0 ? void 0 : _k.width) === undefined ? optionsFinal.stroke.width : optionsFinal.beta.stroke.width);
        angleStrokeWidths.push(((_m = (_l = optionsFinal.gamma) === null || _l === void 0 ? void 0 : _l.stroke) === null || _m === void 0 ? void 0 : _m.width) === undefined ? optionsFinal.stroke.width : optionsFinal.gamma.stroke.width);
        const angleLabels = [optionsFinal.gamma.label, optionsFinal.alpha.label, optionsFinal.beta.label];
        const axisLabels = [optionsFinal.a.label, optionsFinal.b.label, optionsFinal.c.label];
        const angleEnableds = [optionsFinal.gamma.enabled, optionsFinal.alpha.enabled, optionsFinal.beta.enabled];
        const axisEnableds = [optionsFinal.a.enabled, optionsFinal.b.enabled, optionsFinal.c.enabled];
        const axisFonts = [];
        axisFonts.push(optionsFinal.a.font === undefined ? optionsFinal.font : optionsFinal.a.font);
        axisFonts.push(optionsFinal.b.font === undefined ? optionsFinal.font : optionsFinal.b.font);
        axisFonts.push(optionsFinal.c.font === undefined ? optionsFinal.font : optionsFinal.c.font);
        const axisFontSizes = [];
        axisFontSizes.push(optionsFinal.a.size === undefined ? optionsFinal.size : optionsFinal.a.size);
        axisFontSizes.push(optionsFinal.b.size === undefined ? optionsFinal.size : optionsFinal.b.size);
        axisFontSizes.push(optionsFinal.c.size === undefined ? optionsFinal.size : optionsFinal.c.size);
        const strokeColors = [];
        strokeColors.push(((_p = (_o = optionsFinal.a) === null || _o === void 0 ? void 0 : _o.stroke) === null || _p === void 0 ? void 0 : _p.color) === undefined ? optionsFinal.stroke.color : optionsFinal.a.stroke.color);
        strokeColors.push(((_r = (_q = optionsFinal.b) === null || _q === void 0 ? void 0 : _q.stroke) === null || _r === void 0 ? void 0 : _r.color) === undefined ? optionsFinal.stroke.color : optionsFinal.b.stroke.color);
        strokeColors.push(((_t = (_s = optionsFinal.c) === null || _s === void 0 ? void 0 : _s.stroke) === null || _t === void 0 ? void 0 : _t.color) === undefined ? optionsFinal.stroke.color : optionsFinal.c.stroke.color);
        const strokeWidths = [];
        strokeWidths.push(((_v = (_u = optionsFinal.a) === null || _u === void 0 ? void 0 : _u.stroke) === null || _v === void 0 ? void 0 : _v.width) === undefined ? optionsFinal.stroke.width : optionsFinal.a.stroke.width);
        strokeWidths.push(((_x = (_w = optionsFinal.b) === null || _w === void 0 ? void 0 : _w.stroke) === null || _x === void 0 ? void 0 : _x.width) === undefined ? optionsFinal.stroke.width : optionsFinal.b.stroke.width);
        strokeWidths.push(((_z = (_y = optionsFinal.c) === null || _y === void 0 ? void 0 : _y.stroke) === null || _z === void 0 ? void 0 : _z.width) === undefined ? optionsFinal.stroke.width : optionsFinal.c.stroke.width);
        const angleFonts = [];
        angleFonts.push(optionsFinal.alpha.font === undefined ? optionsFinal.font : optionsFinal.alpha.font);
        angleFonts.push(optionsFinal.beta.font === undefined ? optionsFinal.font : optionsFinal.beta.font);
        angleFonts.push(optionsFinal.gamma.font === undefined ? optionsFinal.font : optionsFinal.gamma.font);
        const angleFontSizes = [];
        angleFontSizes.push(optionsFinal.alpha.size === undefined ? optionsFinal.size : optionsFinal.alpha.size);
        angleFontSizes.push(optionsFinal.beta.size === undefined ? optionsFinal.size : optionsFinal.beta.size);
        angleFontSizes.push(optionsFinal.gamma.size === undefined ? optionsFinal.size : optionsFinal.gamma.size);
        // If 2D periodic, we save the periodic indices, and ensure a right
        // handed coordinate system.
        for (let iTrueBasis = 0; iTrueBasis < 3; ++iTrueBasis) {
            iBasis += 1;
            const axisLabel = axisLabels[iBasis];
            const axisColor = cellBasisColors[iBasis];
            const axisFont = axisFonts[iBasis];
            const axisFontSize = axisFontSizes[iBasis];
            const angleFontSize = angleFontSizes[iBasis];
            const strokeWidth = strokeWidths[iBasis];
            const strokeColor = strokeColors[iBasis];
            const angleFont = angleFonts[iBasis];
            const angleColor = angleColors[iBasis];
            const angleLabel = angleLabels[iBasis];
            const angleStrokeColor = angleStrokeColors[iBasis];
            const angleStrokeWidth = angleStrokeWidths[iBasis];
            const axisEnabled = axisEnableds[iBasis];
            const angleEnabled = angleEnableds[iBasis];
            const collapsed1 = this.basisVectorCollapsed[iTrueBasis];
            const collapsed2 = this.basisVectorCollapsed[(iTrueBasis + 1) % 3];
            const collapsed3 = this.basisVectorCollapsed[(iTrueBasis + 2) % 3];
            const basisVec1 = basis[iTrueBasis];
            const basisVec2 = basis[(iTrueBasis + 1) % 3].clone();
            const basisVec3 = basis[(iTrueBasis + 2) % 3].clone();
            if (axisEnabled && !collapsed1) {
                // Basis and angle label selection, same for all systems
                const origin = new THREE.Vector3(0, 0, 0);
                const dir = basisVec1.clone();
                // Add an axis label
                const textPos = dir.clone()
                    .multiplyScalar(0.5);
                let labelOffset;
                let newBasis;
                if (collapsed2 && collapsed3) {
                    newBasis = new THREE.Vector3(0, 0, 1);
                    labelOffset = new THREE.Vector3().crossVectors(basisVec1, newBasis);
                }
                else if (collapsed2) {
                    newBasis = new THREE.Vector3().crossVectors(basisVec1, basisVec3);
                    labelOffset = new THREE.Vector3().crossVectors(basisVec1, newBasis);
                }
                else if (collapsed3) {
                    newBasis = new THREE.Vector3().crossVectors(basisVec1, basisVec2);
                    labelOffset = new THREE.Vector3().crossVectors(basisVec1, newBasis);
                }
                else {
                    const labelOffset1 = new THREE.Vector3().crossVectors(basisVec1, basisVec2);
                    const labelOffset2 = new THREE.Vector3().crossVectors(basisVec1, basisVec3);
                    labelOffset = new THREE.Vector3().sub(labelOffset1).add(labelOffset2);
                }
                labelOffset.normalize();
                labelOffset.multiplyScalar(0.8);
                textPos.add(labelOffset);
                const axisLabelSprite = this.createLabel(textPos, axisLabel, axisColor, axisFont, axisFontSize, new THREE.Vector2(0.0, 0.0), strokeWidth, strokeColor);
                this.latticeConstantsGroup.add(axisLabelSprite);
                this.axisLabels.push(axisLabelSprite);
                // Add basis vector colored line
                const cellVectorMaterial = new THREE.MeshBasicMaterial({
                    color: axisColor,
                    transparent: true,
                    opacity: 0.75
                });
                const cellVector = basisVec1.clone();
                const cellVectorLine = this.createCylinder(origin.clone(), cellVector.clone().add(origin), 0.09, 10, cellVectorMaterial);
                this.latticeConstantsGroup.add(cellVectorLine);
                // Add basis vector axis line
                const cellAxisMaterial = new THREE.MeshBasicMaterial({
                    color: "#000000",
                });
                const axisStart = this.basisVectors[iTrueBasis].clone();
                const axisEnd = axisStart.clone().multiplyScalar(1 + axisOffset / axisStart.length());
                const cellAxisVectorLine = this.createCylinder(origin.clone(), axisEnd, 0.02, 10, cellAxisMaterial);
                this.latticeConstantsGroup.add(cellAxisVectorLine);
                // Add axis arrow
                const arrowGeometry = new THREE.CylinderGeometry(0, 0.10, 0.5, 12);
                const arrowMaterial = new THREE.MeshBasicMaterial({
                    color: infoColor,
                });
                const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
                arrow.position.copy(dir)
                    .multiplyScalar(1 + axisOffset / dir.length());
                arrow.lookAt(new THREE.Vector3());
                arrow.rotateX(-Math.PI / 2);
                this.latticeConstantsGroup.add(arrow);
            }
            if (angleEnabled && !collapsed1 && !collapsed2) {
                // Add angle label and curve
                const arcMaterial = new THREE.LineDashedMaterial({
                    color: infoColor,
                    linewidth: 2,
                    dashSize: 0.2,
                    gapSize: 0.1
                });
                const normal = new THREE.Vector3().crossVectors(basisVec1, basisVec2);
                const angle = basisVec1.angleTo(basisVec2);
                const radius = Math.max(Math.min(1 / 4 * basisVec1.length(), 1 / 4 * basisVec2.length()), 1);
                const curve = new THREE.EllipseCurve(0, 0, // ax, aY
                radius, radius, // xRadius, yRadius
                0, angle, // aStartAngle, aEndAngle
                false, // aClockwise
                0 // aRotation
                );
                const nArcPoints = 20;
                const points = curve.getSpacedPoints(nArcPoints);
                const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const arc = new THREE.Line(arcGeometry, arcMaterial);
                arc.computeLineDistances();
                // First rotate the arc so that it's x-axis points towards the
                // first basis vector that defines the arc
                const xAxis = new THREE.Vector3(1, 0, 0);
                const quaternion = new THREE.Quaternion().setFromUnitVectors(xAxis, basisVec1.clone().normalize());
                arc.quaternion.copy(quaternion);
                // Then rotate the arc along it's x axis so that the xy-plane
                // coincides with the plane defined by the the two basis vectors
                // that define the plane.
                const verticesArray = arcGeometry.attributes.position.array;
                const nVertices = verticesArray.length / 3;
                const lastArcPointLocal = new THREE.Vector3().fromArray(verticesArray, (nVertices - 1) * 3);
                arc.updateMatrixWorld(); // The positions are not otherwise updated properly
                const lastArcPointWorld = arc.localToWorld(lastArcPointLocal.clone());
                // The angle direction is defined by the first basis vector
                const axis = basisVec1;
                const arcNormal = new THREE.Vector3()
                    .crossVectors(axis, lastArcPointWorld);
                let planeAngle = normal.angleTo(arcNormal);
                const planeCross = new THREE.Vector3()
                    .crossVectors(basisVec2, lastArcPointWorld);
                const directionValue = planeCross.dot(axis);
                if (directionValue > 0) {
                    planeAngle = -planeAngle;
                }
                arc.rotateX(planeAngle);
                // Add label for the angle
                arc.updateMatrixWorld(); // The positions are not otherwise updated properly
                arc.updateMatrix(); // The positions are not otherwise updated properly
                const angleLabelPos = arc.localToWorld(new THREE.Vector3().fromArray(verticesArray, (nArcPoints / 2 - 1) * 3));
                const angleLabelLen = angleLabelPos.length();
                angleLabelPos.multiplyScalar(1 + 0.3 / angleLabelLen);
                const angleLabelObj = this.createLabel(angleLabelPos, angleLabel.toString(), angleColor, angleFont, angleFontSize, new THREE.Vector2(0.0, 0.0), angleStrokeWidth, angleStrokeColor);
                this.latticeConstantsGroup.add(angleLabelObj);
                this.axisLabels.push(angleLabelObj);
                this.angleArcs.add(arc);
            }
        }
    }
    /**
     * Gets the local positions of the atoms.
     */
    getPositionsLocal() {
        return this.positions;
    }
    /**
     * Get the positions of atoms in the global coordinate system.
     */
    getPositionsGlobal() {
        const nAtoms = this.positions.length;
        const worldPos = [];
        this.atomsObject.updateMatrixWorld(); // This update is required
        for (let i = 0; i < nAtoms; ++i) {
            const atom = this.atomsObject.getObjectByName(`atom${i}`);
            const wPos = new THREE.Vector3();
            atom.getWorldPosition(wPos);
            worldPos.push(wPos);
        }
        return worldPos;
    }
    /**
     * Get the positions of the center of cell in the global coordinate system.
     */
    getCOCGlobal() {
        let COC = new THREE.Vector3()
            .add(this.basisVectors[0])
            .add(this.basisVectors[1])
            .add(this.basisVectors[2])
            .multiplyScalar(0.5);
        this.root.updateMatrixWorld(); // This update is required
        COC = this.root.localToWorld(COC);
        return COC;
    }
    /**
     * Converts a list of list of numbers into vectors.
     *
     * @param positions
     * @returns {THREE.Vector3[]} The positions as an array of THREE.Vector3.
     */
    toVectors(positions) {
        const vecPos = [];
        for (let i = 0, size = positions.length; i < size; ++i) {
            vecPos.push(new THREE.Vector3().fromArray(positions[i]));
        }
        return vecPos;
    }
    toCartesian(positions, copy = true) {
        if (copy) {
            const newPos = [];
            for (let i = 0, size = positions.length; i < size; ++i) {
                newPos.push(positions[i].clone().applyMatrix3(this.B));
            }
            return newPos;
        }
        else {
            for (let i = 0, size = positions.length; i < size; ++i) {
                positions[i].applyMatrix3(this.B);
            }
        }
    }
    toScaled(positions, copy = true) {
        if (copy) {
            const newPos = [];
            for (let i = 0, size = positions.length; i < size; ++i) {
                newPos.push(positions[i].clone().applyMatrix3(this.Bi));
            }
            return newPos;
        }
        else {
            for (let i = 0, size = positions.length; i < size; ++i) {
                positions[i].applyMatrix3(this.Bi);
            }
        }
    }
    /**
     * Get a specific atom as defined by a js Group.
     *
     * @param index - Index of the atom.
     * @return THREE.js Group containing the visuals for the atom. The position
     * of the atom is determined by the position of the group.
     */
    getAtom(index) {
        return this.atomsObject.getObjectByName(`atom${index}`);
    }
    setupLights() {
        this.lights = [];
        const shadowMapWidth = 2048;
        const shadowBias = -0.001;
        const shadowCutoff = 50;
        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.45);
        keyLight.shadow.mapSize.width = shadowMapWidth;
        keyLight.shadow.mapSize.height = shadowMapWidth;
        keyLight.shadow.bias = shadowBias; //fixes self-shadowing artifacts
        // Fixes an issue with some shadows being cutoff. Is there a more robust solution?
        keyLight.shadow.camera.left = -shadowCutoff;
        keyLight.shadow.camera.right = shadowCutoff;
        keyLight.shadow.camera.top = shadowCutoff;
        keyLight.shadow.camera.bottom = -shadowCutoff;
        keyLight.position.set(0, 0, 20);
        this.sceneStructure.add(keyLight);
        this.lights.push(keyLight);
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.shadow.mapSize.width = shadowMapWidth;
        fillLight.shadow.mapSize.height = shadowMapWidth;
        fillLight.shadow.bias = shadowBias;
        fillLight.position.set(-20, 0, -20);
        // Back light
        const backLight = new THREE.DirectionalLight(0xffffff, 0.25);
        backLight.shadow.mapSize.width = shadowMapWidth;
        backLight.shadow.mapSize.height = shadowMapWidth;
        backLight.shadow.bias = shadowBias;
        backLight.position.set(20, 0, -20);
        // White ambient light.
        const ambientLight = new THREE.AmbientLight(0x404040, 1.7); // soft white light
        this.sceneStructure.add(ambientLight);
    }
    /**
     * Creates a list of THREE.Vector3s from the given list of arrays.
     *
     * @param vectors - The positions from which to create vectors.
     */
    createBasisVectors(basis) {
        // No cell specified
        if (basis === undefined) {
            this.basisVectors = undefined;
            this.B = undefined;
            this.Bi = undefined;
            return;
        }
        // Create basis transformation matrices
        const a = new THREE.Vector3().fromArray(basis[0]);
        const b = new THREE.Vector3().fromArray(basis[1]);
        const c = new THREE.Vector3().fromArray(basis[2]);
        this.basisVectors = [a, b, c];
        const B = new THREE.Matrix3();
        B.set(a.x, b.x, c.x, a.y, b.y, c.y, a.z, b.z, c.z);
        // Check for collapsed dimensions
        this.basisVectorCollapsed = [];
        for (let i = 0; i < 3; ++i) {
            const length = this.basisVectors[i].length();
            this.basisVectorCollapsed.push(length < 1E-6);
        }
        if (this.basisVectorCollapsed.some(element => element)) {
            this.B = undefined;
            this.Bi = undefined;
        }
        else {
            this.B = B;
            this.Bi = new THREE.Matrix3().copy(B).invert();
        }
    }
    /**
     * Returns the atomic radii for the given atomic number.
     *
     * @param atomicNumber - The atomic number for which radii is requested.
     */
    getRadii(atomicNumber) {
        return this.atomicRadii[atomicNumber] || this.radii_unknown;
    }
    /**
     * Returns the color for the given atomic number.
     *
     * @param atomicNumber - The atomic number for which color is requested.
     */
    getColor(config, atomicNumber) {
        return config.color === 'Jmol'
            ? this.elementColors[atomicNumber] || this.color_unknown
            : config.color;
    }
    /**
     * Creates outlines for a cell specified by the given basis vectors.
     * @param origin - The origin for the cell
     * @param basisVectors - The cell basis vectors
     * @param basisVectorCollapsed - Whether a basis vector is collapsed (length = 0)
     * @param periodicity - The periodicity of the cell
     * @param color - Color fo the cell wireframe
     * @param linewidth - Line width fo the wireframe
     * @param dashed - Is wireframe dashed
     */
    createCell(origin, basisVectors, basisVectorCollapsed, periodicity, color, linewidth, dashSize, gapSize) {
        let nonPeriodic;
        const cell = new THREE.Object3D();
        let lineMaterial;
        if (!(dashSize === 0 && gapSize === 0)) {
            lineMaterial = new THREE.LineDashedMaterial({
                color: color,
                linewidth: linewidth,
                dashSize: dashSize,
                gapSize: gapSize
            });
        }
        else {
            lineMaterial = new THREE.LineBasicMaterial({
                color: color,
                linewidth: linewidth
            });
        }
        for (let len = basisVectors.length, i = 0; i < len; ++i) {
            const basisVector = basisVectors[i].clone();
            const collapsed = basisVectorCollapsed[i];
            // First line
            const line1Mat = lineMaterial.clone();
            const isDim1 = !periodicity[i];
            if (!(isDim1 && collapsed)) {
                const points = [];
                points.push(origin.clone());
                points.push(basisVector.clone().add(origin));
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, line1Mat);
                cell.add(line);
                line.computeLineDistances();
            }
            // Second line
            const secondIndex = (i + 1) % len;
            const secondAddition = basisVectors[secondIndex].clone();
            const isDim2 = !periodicity[i] || !periodicity[(i + 1) % 3];
            if (!(isDim2 && collapsed)) {
                const line2Mat = lineMaterial.clone();
                const points = [];
                points.push(secondAddition.clone().add(origin));
                points.push(basisVector.clone().add(secondAddition).add(origin));
                const line2Geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line2 = new THREE.Line(line2Geometry, line2Mat);
                cell.add(line2);
                line2.computeLineDistances();
            }
            // Third line
            const thirdIndex = (i + 2) % len;
            const thirdAddition = basisVectors[thirdIndex].clone();
            const isDim3 = !periodicity[i] || !periodicity[(i + 2) % 3];
            if (!(isDim3 && collapsed)) {
                const line3Mat = lineMaterial.clone();
                const points = [];
                points.push(thirdAddition.clone().add(origin));
                points.push(basisVector.clone().add(thirdAddition).add(origin));
                const line3Geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line3 = new THREE.Line(line3Geometry, line3Mat);
                cell.add(line3);
                line3.computeLineDistances();
            }
            // Fourth line
            const isDim4 = !periodicity[i] || !periodicity[(i + 2) % 3] || !periodicity[(i + 1) % 3];
            if (!(isDim4 && collapsed)) {
                const line4Mat = lineMaterial.clone();
                const points = [];
                points.push(secondAddition.clone().add(thirdAddition).add(origin));
                points.push(basisVector.clone().add(secondAddition).add(thirdAddition).add(origin));
                const line4Geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line4 = new THREE.Line(line4Geometry, line4Mat);
                cell.add(line4);
                line4.computeLineDistances();
            }
        }
        return cell;
    }
    /**
     * Used to add periodic repetitions of atoms.
     */
    repeat(multipliers, fracPos, labels) {
        const a = new THREE.Vector3(1, 0, 0);
        const b = new THREE.Vector3(0, 1, 0);
        const c = new THREE.Vector3(0, 0, 1);
        const newPos = [];
        const newLabels = [];
        for (let i = 0; i < multipliers[0]; ++i) {
            for (let j = 0; j < multipliers[1]; ++j) {
                for (let k = 0; k < multipliers[2]; ++k) {
                    if (!(i == 0 && j == 0 && k == 0)) {
                        // Add clone to the current coordinate
                        const aTranslation = a.clone().multiplyScalar(i);
                        const bTranslation = b.clone().multiplyScalar(j);
                        const cTranslation = c.clone().multiplyScalar(k);
                        // Add in front
                        for (let l = 0, size = fracPos.length; l < size; ++l) {
                            const iPos = new THREE.Vector3().copy(fracPos[l]);
                            iPos.add(aTranslation);
                            iPos.add(bTranslation);
                            iPos.add(cTranslation);
                            const iLabel = labels[l];
                            newPos.push(iPos);
                            newLabels.push(iLabel);
                        }
                    }
                }
            }
        }
        for (let i = 0; i < newPos.length; ++i) {
            fracPos.push(newPos[i]);
            labels.push(newLabels[i]);
        }
    }
    /**
     * Controls the wrapping of atoms. Notice that only cell directions with
     * periodic boundaries will be wrapped.
     *
     * @param {boolean} wrap - Whether to wrap or not.
     */
    wrap(wrap = true) {
        const pbc = this.structure["pbc"];
        if (!pbc.some(a => a)) {
            return;
        }
        // Check that cell is valid
        if (isNil(this.B)) {
            throw Error("Could not wrap as cell is not set.");
        }
        // Get scaled positions, wrap to be within cell, revert back to
        // cartesian and save.
        if (wrap) {
            const pos = this.toScaled(this.positions, true);
            for (let len = pos.length, i = 0; i < len; ++i) {
                const iFracPos = pos[i];
                if (pbc[0])
                    iFracPos.x = iFracPos.x < 0 ? 1 + (iFracPos.x % 1) : iFracPos.x % 1;
                if (pbc[1])
                    iFracPos.y = iFracPos.y < 0 ? 1 + (iFracPos.y % 1) : iFracPos.y % 1;
                if (pbc[2])
                    iFracPos.z = iFracPos.z < 0 ? 1 + (iFracPos.z % 1) : iFracPos.z % 1;
            }
            this.setPositions(pos, true);
        }
        else {
            this.setPositions(this.positionsOriginal, false);
        }
    }
    /**
     * Set the position for atoms in the currently loaded structure.
     */
    setPositions(positions, fractional = false) {
        if (fractional) {
            this.toCartesian(positions, false);
        }
        for (let i = 0, size = positions.length; i < size; ++i) {
            const position = positions[i];
            const atom = this.getAtom(i);
            atom.position.copy(position);
        }
        this.positions = positions;
    }
    /**
     * Used to add periodic repetitions of atoms at the unit cell boundary.
     */
    addBoundaryAtoms(fracPos, labels, tolerance) {
        for (let len = fracPos.length, i = 0; i < len; ++i) {
            const iFracPos = fracPos[i];
            const atomicNumber = labels[i];
            // If the atom sits on the cell surface, add the periodic images if
            // requested.
            const x = iFracPos.x;
            const y = iFracPos.y;
            const z = iFracPos.z;
            const xZero = this.almostEqual(0, x, this.basisVectors[0], tolerance);
            const yZero = this.almostEqual(0, y, this.basisVectors[1], tolerance);
            const zZero = this.almostEqual(0, z, this.basisVectors[2], tolerance);
            if (xZero && yZero && zZero) {
                fracPos.push(new THREE.Vector3(1, 0, 0).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(0, 1, 0).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(0, 0, 1).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(1, 1, 0).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(0, 1, 1).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(1, 0, 1).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(1, 1, 1).add(iFracPos));
                labels.push(atomicNumber);
            }
            else if (xZero && yZero && !zZero) {
                fracPos.push(new THREE.Vector3(1, 0, 0).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(0, 1, 0).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(1, 1, 0).add(iFracPos));
                labels.push(atomicNumber);
            }
            else if (!xZero && yZero && zZero) {
                fracPos.push(new THREE.Vector3(0, 1, 0).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(0, 0, 1).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(0, 1, 1).add(iFracPos));
                labels.push(atomicNumber);
            }
            else if (xZero && !yZero && zZero) {
                fracPos.push(new THREE.Vector3(1, 0, 0).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(0, 0, 1).add(iFracPos));
                labels.push(atomicNumber);
                fracPos.push(new THREE.Vector3(1, 0, 1).add(iFracPos));
                labels.push(atomicNumber);
            }
            else if (xZero && !yZero && !zZero) {
                fracPos.push(new THREE.Vector3(1, 0, 0).add(iFracPos));
                labels.push(atomicNumber);
            }
            else if (!xZero && yZero && !zZero) {
                fracPos.push(new THREE.Vector3(0, 1, 0).add(iFracPos));
                labels.push(atomicNumber);
            }
            else if (!xZero && !yZero && zZero) {
                fracPos.push(new THREE.Vector3(0, 0, 1).add(iFracPos));
                labels.push(atomicNumber);
            }
        }
    }
    /**
     * Creates representation for all the given atoms.
     *
     * @param positions - Positions of the atoms
     * @param labels - The element numbers for the atoms
     */
    createAtoms(positions, labels, pbc, fractional = true, wrap) {
        // Delete old atoms
        this.atomsObject.remove(...this.atomsObject.children);
        this.elements = {};
        this.atomFills = [];
        this.atomOutlines = [];
        // Determine the periodicity handling
        if (pbc.some(a => { return a === true; })) {
            if (fractional && wrap.type === "boundary") {
                this.addBoundaryAtoms(positions, labels, wrap.tolerance);
            }
            else if (fractional && Array.isArray(wrap)) {
                this.repeat(wrap, positions, labels);
            }
        }
        // Convert fractional to cartesian
        const cartPositions = [];
        for (const pos of positions) {
            const posVector = new THREE.Vector3();
            if (fractional) {
                posVector.add(this.basisVectors[0].clone().multiplyScalar(pos.x));
                posVector.add(this.basisVectors[1].clone().multiplyScalar(pos.y));
                posVector.add(this.basisVectors[2].clone().multiplyScalar(pos.z));
            }
            else {
                posVector.copy(pos);
            }
            cartPositions.push(posVector);
        }
        // Save the atom positions for later instantiation according to the given styles.
        this.positions = cartPositions;
        this.positionsOriginal = cartPositions.map(x => x.clone());
        this.atomicNumbers = labels;
        // Gather element legend data
        for (const atomicNumber of labels) {
            const elementName = this.elementNames[atomicNumber];
            this.elements[elementName] = [this.jmolColors[atomicNumber], this.covalentRadii[atomicNumber]];
        }
    }
    /**
     * Used to check if the given fractional position component is almost the
     * given target value with a tolerance given in cartesian corodinates.
     */
    almostEqual(target, coordinate, basisVector, tolerance) {
        const relDistance = (coordinate - target);
        const absDistance = Math.abs(basisVector.clone().multiplyScalar(relDistance).length());
        if (absDistance < tolerance) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Creates atom to the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     */
    addBond(i, j, pos1, pos2, bondMaterial, options) {
        // Bond
        const radius = options.radius;
        const targetAngle = options.smoothness;
        const nSegments = Math.ceil(360 / (180 - targetAngle));
        const cylinder = this.createCylinder(pos1, pos2, radius, nSegments, bondMaterial);
        cylinder.name = "fill";
        this.bondFills.push(cylinder);
        // Put all bonds visuals inside a named group
        const group = new THREE.Group();
        group.name = "bond" + i + "-" + j;
        group.add(cylinder);
        // Bond outline
        if (options.outline.enabled) {
            const addition = options.outline.size;
            const scale = addition / radius + 1;
            const outlineMaterial = new THREE.MeshBasicMaterial({ color: options.outline.color, side: THREE.BackSide });
            const outline = this.createCylinder(pos1, pos2, scale * radius, 10, outlineMaterial);
            outline.name = "outline";
            group.add(outline);
        }
        this.bondsObject.add(group);
    }
    /**
     * Creates atoms and directly adds them to the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     */
    updateAtom(index, config, configHash) {
        var _a, _b;
        // See if a mesh for this atom already exists. If not create it,
        // otherwise reuse an existing mesh. Reusing meshes speeds up the
        // creation significantly.
        const atomicNumber = this.atomicNumbers[index];
        const position = this.positions[index];
        const hash = `${configHash}_${atomicNumber}`;
        const mesh = this.meshMap[hash];
        if (isNil(mesh)) {
            this.meshMap[hash] = {};
            // Atom 
            const atomGeometry = this.createAtomGeometry(config, atomicNumber);
            const atomMaterial = this.createAtomMaterial(config, atomicNumber);
            const atom = new THREE.Mesh(atomGeometry, atomMaterial);
            this.meshMap[hash].atom = atom;
            // Atom outline
            if ((_a = config === null || config === void 0 ? void 0 : config.outline) === null || _a === void 0 ? void 0 : _a.enabled) {
                const outlineGeometry = this.createAtomOutlineGeometry(config, atomicNumber);
                const outlineMaterial = this.createAtomOutlineMaterial(config);
                const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
                this.meshMap[hash].outline = outline;
            }
        }
        // Remove old representation if one exists
        const atomGroup = this.atomsObject.getObjectByName(`atom${index}`);
        if (!isNil(atomGroup)) {
            atomGroup.removeFromParent();
        }
        // Add the new representation
        const imesh = this.meshMap[hash];
        const true_pos = new THREE.Vector3();
        true_pos.copy(position);
        // Put all atoms visuals inside a named group
        const group = new THREE.Group();
        group.name = "atom" + index;
        const atom = imesh["atom"].clone();
        atom.name = "fill";
        group.add(atom);
        if ((_b = config === null || config === void 0 ? void 0 : config.outline) === null || _b === void 0 ? void 0 : _b.enabled) {
            const outline = imesh["outline"].clone();
            this.atomOutlines.push(outline);
            outline.name = "outline";
            group.add(outline);
        }
        group.position.copy(true_pos);
        this.atomsObject.add(group);
        this.atomFills.push(atom);
    }
    createAtomGeometry(config, atomicNumber) {
        // Calculate the amount of segments that are needed to reach a
        // certain angle for the ball surface segments
        const radius = config.radius === 'covalent'
            ? this.getRadii(atomicNumber)
            : config.radius;
        const scaledRadius = config.scale * radius;
        const targetAngle = config.smoothness;
        const nSegments = Math.ceil(360 / (180 - targetAngle));
        const atomGeometry = new THREE.SphereGeometry(scaledRadius, nSegments, nSegments);
        return atomGeometry;
    }
    createAtomMaterial(config, atomicNumber) {
        var _a, _b, _c;
        let atomMaterial;
        const color = this.getColor(config, atomicNumber);
        if (((_a = config === null || config === void 0 ? void 0 : config.material) === null || _a === void 0 ? void 0 : _a.toon) !== undefined) {
            const nTones = (_c = (_b = config === null || config === void 0 ? void 0 : config.material) === null || _b === void 0 ? void 0 : _b.toon) === null || _c === void 0 ? void 0 : _c.tones;
            const colors = new Uint8Array(nTones);
            for (let c = 0; c <= nTones; c++) {
                colors[c] = (c / nTones) * 256;
            }
            const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);
            gradientMap.minFilter = THREE.NearestFilter;
            gradientMap.magFilter = THREE.NearestFilter;
            gradientMap.generateMipmaps = false;
            atomMaterial = new THREE.MeshToonMaterial({
                color: color,
                gradientMap: gradientMap
            });
        }
        else {
            atomMaterial = new THREE.MeshPhongMaterial({
                color: color,
                shininess: config.material.phong.shininess,
                opacity: config.opacity,
                transparent: config.opacity !== 1,
            });
        }
        return atomMaterial;
    }
    createAtomOutlineGeometry(config, atomicNumber) {
        var _a;
        const radius = config.radius === 'covalent'
            ? this.getRadii(atomicNumber)
            : config.radius;
        const scaledRadius = config.scale * radius;
        const addition = (_a = config === null || config === void 0 ? void 0 : config.outline) === null || _a === void 0 ? void 0 : _a.size;
        const scale = addition / scaledRadius + 1;
        const targetAngle = config.smoothness;
        const nSegments = Math.ceil(360 / (180 - targetAngle));
        return new THREE.SphereGeometry(scaledRadius * scale, nSegments, nSegments);
    }
    createAtomOutlineMaterial(config) {
        var _a;
        return new THREE.MeshBasicMaterial({
            color: (_a = config === null || config === void 0 ? void 0 : config.outline) === null || _a === void 0 ? void 0 : _a.color,
            side: THREE.BackSide,
            opacity: config.opacity,
            transparent: config.opacity !== 1,
        });
    }
    /*
     * A modified render-function that scales the labels according to the zoom
     * level.
     */
    render() {
        const canvas = this.rootElement;
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        // Project a [1,0,0] vector in the camera space to the world space, and
        // then to the screen space. The length of this vector is then used to
        // scale the labels.
        const x = new THREE.Vector3(1, 0, 0);
        const origin = new THREE.Vector3(0, 0, 0);
        const vectors = [x, origin];
        for (let i = 0; i < vectors.length; ++i) {
            const vec = vectors[i];
            this.camera.localToWorld(vec);
            vec.project(this.camera);
            vec.x = Math.round((vec.x + 1) * canvasWidth / 2);
            vec.y = Math.round((-vec.y + 1) * canvasHeight / 2);
        }
        const displacement = new THREE.Vector3().subVectors(origin, x);
        const distance = displacement.length();
        const scale = 8 * 1 / Math.pow(distance, 0.5); // The sqrt makes the scaling behave nicer...
        if (this.axisLabels !== undefined) {
            for (let i = 0; i < this.axisLabels.length; ++i) {
                const label = this.axisLabels[i];
                label.scale.set(scale, scale, 1);
            }
        }
        super.render();
    }
    /**
     * Used to get a number of repetitions that are needed for the given
     * latticevector to reach the target size.
     *
     * @param latticeVector - The vector that is to be extended.
     * @param targetSize - The targeted size.
     */
    getRepetitions(latticeVector, targetSize) {
        const vectorLen = latticeVector.length();
        const multiplier = Math.max(Math.floor(targetSize / vectorLen) - 1, 1);
        return multiplier;
    }
}
