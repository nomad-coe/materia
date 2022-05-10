import { Viewer } from "./viewer";
import * as THREE from "three";
/**
 * Class for visualizing an atomic structure.
 */
export class StructureViewer extends Viewer {
    constructor() {
        super(...arguments);
        this.updateBonds = false;
        this.atomicRadii = []; // Contains the atomic radii
        this.elementColors = []; // Contains the element colors
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
        this.radii_unknown = 0.3;
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
    /*
     * Overrides the implementation from the base class, as we need two scenes:
     * one for the structure and another for the information that is laid on top.
     */
    setupScenes() {
        this.scenes = [];
        this.sceneStructure = new THREE.Scene();
        this.scenes.push(this.sceneStructure);
        this.sceneInfo = new THREE.Scene();
        this.scenes.push(this.sceneInfo);
    }
    /**
     * Used to setup the visualization options.
     *
     * @param {boolean} options A Javascript object containing the options. See
     *   below for the subparameters.
     *
     * @param {(string|number[])} options.layout.periodicity How periodicity
     *   is handled in the visualization. Available options are:
     *    - "none": Visualized as is.
     *    - "wrap": Positions wrapped within unit cell.
     *    - "boundary": Positions that are on the cell boundaries are repeated.
     *    - [a, b, c]: Positions are repeated along each lattice vector the
     *      given amount of times.
     * @param {number[]} options.layout.translation A fixed cartesian
     *   translation to be applied to the atoms.
     * @param {string} options.layout.viewCenter Determines how the view is
     *   initially centered. Available options are:
     *    - "COC": Center of cell.
     *    - "COP": Center of atom positions.
     * @param {string} options.layout.viewRotation.alignment.top Optional alignment
     * indicating which lattice basis vector should point upwards. Possible
     * values are: "a", "b", "c", "-a", "-b", "-c".
     * @param {string} options.layout.viewRotation.align.right Optional alignment
     * indicating which lattice basis vector should point to the right (more
     * precisely: the cross-product of options.layout.viewRotation.align.top
     * and options.layout.viewRotation.align.right will point away from the
     * screen.). Possible values are: "a", "b", "c", "-a", "-b", "-c".
     * @param {string[][]} options.layout.viewRotation.alignments Optional
     * alignments for the basis vectors. You can define two alignments for any two
     * axis vectors. E.g. [["up", "c"], ["right", "b"]] will force the third basis
     * vector to point exactly up, and the second basis vector to as close to right
     * as possible.
     * @param {number[][]} options.layout.viewRotation.rotations Optional
     * rotations that are applied after the alignments have been done (see
     * options.layout.viewRotation.alignments). The rotations are given as a list of
     * 4-element arrays containing the rotations axis and rotation angle in
     * degrees. E.g. [[1, 0, 0, 90]] would apply a 90 degree rotation with
     * respect to the x-coordinate. If multiple rotations are specified, they
     * will be applied in the given order. Notice that these rotations are
     * applied with respect to a global coordinate system, not the coordinate
     * system of the structure. In this global coordinate system [1, 0, 0]
     * points to the right, [0, 1, 0] points upwards and [0, 0, 1] points away
     * from the screen.
     * @param {boolean} options.latticeConstants.enabled Show lattice parameters
     * @param {string} options.latticeConstants.font Font size for lattice
     * constants. Applied as default to all labels, can be overridden
     * individually for each lattice constant.
     * @param {string} options.latticeConstants.color Font color for lattice
     * constants. Applied as default to all labels, can be overridden
     * individually for each lattice constant.
     * @param {string} options.latticeConstants.stroke.color Font stroke color
     * for lattice constants. Applied as default to all labels, can be
     * overridden individually for each lattice constant.
     * @param {string} options.latticeConstants.stroke.width Font stroke width
     * for lattice constants. Applied as default to all labels, can be
     * overridden individually for each lattice constant.
     * @param {string} options.latticeConstants.a.color Font color
     * @param {string} options.latticeConstants.a.font Font family
     * @param {number} options.latticeConstants.a.size Font size
     * @param {number} options.latticeConstants.a.stroke.width Font stroke width
     * @param {string} options.latticeConstants.a.stroke.color Font stroke color
     * @param {string} options.latticeConstants.b.color Font color
     * @param {string} options.latticeConstants.b.font Font family
     * @param {number} options.latticeConstants.b.size Font size
     * @param {number} options.latticeConstants.b.stroke.width Font stroke width
     * @param {string} options.latticeConstants.b.stroke.color Font stroke color
     * @param {string} options.latticeConstants.c.color Font color
     * @param {string} options.latticeConstants.c.font Font family
     * @param {number} options.latticeConstants.c.size Font size
     * @param {number} options.latticeConstants.c.stroke.width Font stroke width
     * @param {string} options.latticeConstants.c.stroke.color Font stroke color
     * @param {string} options.latticeConstants.alpha.color Font color
     * @param {string} options.latticeConstants.alpha.font Font family
     * @param {number} options.latticeConstants.alpha.size Font size
     * @param {number} options.latticeConstants.alpha.stroke.width Font stroke width
     * @param {string} options.latticeConstants.alpha.stroke.color Font stroke color
     * @param {string} options.latticeConstants.beta.color Font color
     * @param {string} options.latticeConstants.beta.font Font family
     * @param {number} options.latticeConstants.beta.size Font size
     * @param {number} options.latticeConstants.beta.stroke.width Font stroke width
     * @param {string} options.latticeConstants.beta.stroke.color Font stroke color
     * @param {string} options.latticeConstants.gamma.color Font color
     * @param {string} options.latticeConstants.gamma.font Font family
     * @param {number} options.latticeConstants.gamma.size Font size
     * @param {number} options.latticeConstants.gamma.stroke.width Font stroke width
     * @param {string} options.latticeConstants.gamma.stroke.color Font stroke color
     *
     * @param {boolean} options.outline.enabled Used to enable or disable a
     *   fixed color outline around atoms and bonds. Notice that enabling the
     *   outline incurs a performance penalty.
     * @param {string} options.outline.color Outline color.
     * @param {number} options.outline.size Outline size.
     *
     * @param {boolean} options.cell.enabled Show unit cell wireframe.
     * @param {boolean} options.cell.color Unit cell wireframe color.
     * @param {boolean} options.cell.linewidth Unit cell wireframe line width.
     * @param {boolean} options.cell.dashSize Unit cell wireframe dash size.
     * Provide a value > 0 for a dashed line.
     * @param {boolean} options.cell.gapSize Unit cell wireframe dash size.
     * Provide a value > 0 for a dashed line.
     *
     * @param {boolean} options.bonds.enabled Show bonds.
     * @param {string} options.bonds.color Color of bonds.
     * @param {number} options.bonds.radius Bond radius.
     * @param {number} options.bonds.smoothness A value between 0-180 that
     *   controls the number of polygons. Used as the angle between adjacent
     *   cylinder/sphere sectors that indirectly controls the number of
     *   polygons.
     * @param {number} options.bonds.material.phong.shininess Shininess of the
     * bond material (for phong material)
     * @param {number} options.bonds.material.toon.tones Tone-steps for toon
     * material.
     * @param {number} options.bonds.threshold Controls the automatic
     *   detection of bonds between atoms. If custom bonds have not been
     *   specified for the structure, bonds will be detected automatically with
     *   the following criteria: distance <=
     *   this.options.bonds.threshold * 1.1 * (radius1 + radius2)
     *
     * @param {number} options.atoms.smoothness A value between 0-180 that
     *   controls the number of polygons. Used as the angle between adjacent
     *   cylinder/sphere sectors that indirectly controls the number of
     *   polygons.
     * @param {number} options.atoms.material.phong.shininess Shininess of the
     * atom material (for phong material)
     * @param {number} options.atoms.material.toon.tones Tone-steps for toon
     * material
     * @param {string|number[]} options.atoms.radii The radii to use for atoms.
     * Defaults to covalent radii. Available options are:
     *
     *   - "covalent": Covalent radii from DOI:10.1039/B801115J.
     *   - Custom list of atomic radii. Provide an array of floating point
     *     numbers where the index corresponds to an atomic number. Index 0 is
     *     reserved for atoms with unknown radii.
     *
     * @param {string|string[]} options.atoms.colors The colors to use
     * for atoms. Available options are:
     *
     *   - "Jmol" (default): Jmol colors.
     *   - Custom list of colors. Provide an array of hexadecimal colors where
     *     the index corresponds to an atomic number. Index 0 is reserved for atoms
     *     with unknown atomic number.
     *
     * @param {number} options.atoms.scale Scaling factor for the atomic radii.
     *
     * @param {string} options.renderer.background.color Color of the background.
     * @param {number} options.renderer.background.opacity Opacity of the background.
     * @param {boolean} options.renderer.shadows.enabled Whether shows are cast
     * by atoms onto others. Note that enabling this increases the
     * computational cost for doing the visualization.
     * @param {boolean} render Whether to perform a render after setting the
     * options. Defaults to true. You should only disable this setting if you
     * plan to do a render manually afterwards.
     */
    setOptions(options, render = true, reload = true) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const defaultOptions = {
            view: {
                fitMargin: 0.5,
            },
            layout: {
                periodicity: "none",
                translation: [0, 0, 0],
                viewCenter: "COP",
                wrapTolerance: 0.05,
            },
            outline: {
                enabled: true,
                color: "#000000",
                size: 0.025,
            },
            cell: {
                enabled: true,
                color: "#000000",
                linewidth: 1.5,
                dashSize: 0,
                gapSize: 0
            },
            latticeConstants: {
                enabled: true,
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
                },
            },
            bonds: {
                enabled: true,
                material: {
                    phong: {
                        shininess: 30,
                    }
                },
                color: "#ffffff",
                radius: 0.08,
                threshold: 1,
                smoothness: 145,
            },
            atoms: {
                material: {
                    phong: {
                        shininess: 30,
                    }
                },
                colors: "Jmol",
                radii: "covalent",
                scale: 1,
                smoothness: 165,
            }
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
            // Check if a full structure reload is required
            if (reload) {
                if (this.needFullReload(options) && this.structure !== undefined) {
                    this.load(this.structure);
                }
                else {
                    if (((_a = options === null || options === void 0 ? void 0 : options.latticeConstants) === null || _a === void 0 ? void 0 : _a.enabled) !== undefined) {
                        this.toggleLatticeConstants(options.latticeConstants.enabled);
                    }
                    ;
                    if (((_b = options === null || options === void 0 ? void 0 : options.cell) === null || _b === void 0 ? void 0 : _b.enabled) !== undefined) {
                        this.toggleCell(options.cell.enabled);
                    }
                    ;
                    if (((_c = options === null || options === void 0 ? void 0 : options.bonds) === null || _c === void 0 ? void 0 : _c.enabled) !== undefined) {
                        this.toggleBonds(options.bonds.enabled);
                    }
                    ;
                    if (((_e = (_d = options === null || options === void 0 ? void 0 : options.renderer) === null || _d === void 0 ? void 0 : _d.shadows) === null || _e === void 0 ? void 0 : _e.enabled) !== undefined) {
                        this.toggleShadows(options.renderer.shadows.enabled);
                    }
                    ;
                }
            }
            if (((_f = options === null || options === void 0 ? void 0 : options.renderer) === null || _f === void 0 ? void 0 : _f.background) !== undefined) {
                this.setBackgroundColor((_g = options === null || options === void 0 ? void 0 : options.renderer) === null || _g === void 0 ? void 0 : _g.background.color, (_h = options === null || options === void 0 ? void 0 : options.renderer) === null || _h === void 0 ? void 0 : _h.background.opacity);
            }
            if (render) {
                this.render();
            }
        }
    }
    /**
     * Used to determine if a full realod of the structure is needed given the
     * updated options.
     * @param {*} options The updated options.
     */
    needFullReload(options) {
        // Options that do not require a full reload
        let noReload = {
            cell: {
                enabled: true,
            },
            latticeConstants: {
                enabled: true,
            },
            bonds: {
                enabled: true,
            },
            shadows: {
                enabled: true,
            }
        };
        // Check it anything else is defined besides the options that do not need
        // a full reload.
        // Overrride with settings from user and child class
        function eachRecursive(source, target) {
            for (const k in source) {
                // Find variable in default settings
                if (source[k] !== null && Object.prototype.toString.call(source[k]) === "[object Object]") {
                    // If the current level is not defined in the target, it is
                    // initialized with empty object.
                    if (target[k] === undefined) {
                        return true;
                    }
                    const update = eachRecursive(source[k], target[k]);
                    if (update) {
                        return true;
                    }
                }
                else {
                    if (target[k] === undefined) {
                        return true;
                    }
                }
            }
            return false;
        }
        return eachRecursive(options, noReload);
    }
    /**
     * Returns the currently set options.
     * @returns {Object} The current options.
     */
    getOptions() {
        return this.options;
    }
    /**
     * Returns information about the elements included in the structure.
     * @returns {Object} The current options.
     */
    getElementInfo() {
        return this.elements;
    }
    /**
     * Hides or shows the lattice parameter labels.
     */
    toggleLatticeConstants(value) {
        if (this.latticeConstants !== undefined) {
            this.latticeConstants.visible = value;
            this.angleArcs.visible = value;
        }
    }
    /**
     * Hides or shows the cell.
     */
    toggleCell(value) {
        if (this.convCell !== undefined) {
            this.convCell.visible = value;
        }
        if (this.primCell !== undefined) {
            this.primCell.visible = value;
        }
    }
    /**
     * Hides or shows the bonds.
     */
    toggleBonds(value) {
        if (value) {
            this.createBonds();
        }
        if (this.bonds !== undefined) {
            this.bonds.visible = value;
        }
    }
    /**
     * Hides or shows the shadows.
     */
    toggleShadows(value) {
        var _a, _b, _c;
        this.renderer.shadowMap.enabled = value;
        for (let i = 0; i < this.lights.length; ++i) {
            let light = this.lights[i];
            light.castShadow = value;
        }
        for (let i = 0; i < this.atomFills.length; ++i) {
            let atom = this.atomFills[i];
            atom.receiveShadow = value;
            atom.castShadow = value;
            atom.material.needsUpdate = true;
        }
        for (let i = 0; i < this.bondFills.length; ++i) {
            let bond = this.bondFills[i];
            bond.receiveShadow = value;
            if (((_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.atoms) === null || _b === void 0 ? void 0 : _b.material) === null || _c === void 0 ? void 0 : _c.toon) !== undefined) {
                bond.castShadow = false;
            }
            else {
                bond.castShadow = value;
            }
            bond.material.needsUpdate = true;
        }
        // For some reason double rendering is required... Maybe delay()?
        this.render();
        this.render();
    }
    /*
     * Clears current data and visualization.
     */
    clear() {
        super.clear();
        this.structure = undefined;
        this.atoms = undefined;
        this.convCell = undefined;
        this.primCell = undefined;
        this.bonds = undefined;
        this.atomPos = undefined;
        this.atomNumbers = undefined;
        this.latticeConstants = undefined;
        this.B = undefined;
        this.Bi = undefined;
        this.basisVectors = undefined;
        this.elements = undefined;
        this.maxRadii = undefined;
        this.atomicRadii = undefined;
        this.elementColors = undefined;
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
     *   vector direction.
     * @param {number[][]} structure.bonds Optional manually set bonds. Provide a
     *   list of atomic index pairs, each pair specifying a bond between atoms.
     *   If these bonds are not specified, the visualizer will by default use an
     *   automated detection of bonds. This can be disabled through
     *   options.bonds.enabled.
     */
    load(structure) {
        var _a, _b, _c, _d, _e, _f;
        // Clear all the old data
        this.clear();
        this.setup();
        // Save the structure for reloading
        this.structure = structure;
        // Reconstruct the visualization
        this.setupScenes();
        this.setupLights();
        this.setupCamera();
        this.setupControls();
        // Determine the radii to be used
        if (this.options.atoms.radii === "covalent") {
            this.atomicRadii = this.covalentRadii;
        }
        else if (Array.isArray(this.options.atoms.radii)) {
            this.atomicRadii = this.options.atoms.radii;
        }
        // Determine the atom colors to be used
        if (this.options.atoms.colors === "Jmol") {
            this.elementColors = this.jmolColors;
        }
        else if (Array.isArray(this.options.atoms.colors)) {
            this.elementColors = this.options.atoms.colors;
        }
        // Check that the received data is OK.
        const isFractional = structure["fractional"] === undefined ? false : structure["fractional"];
        const positions = structure["positions"];
        const species = structure["species"];
        const cell = structure["cell"];
        let periodicity = structure["pbc"];
        let bonds = structure["bonds"];
        if (!positions) {
            console.log("No atom positions given to the structure viewer");
            return false;
        }
        if (!species) {
            console.log("No species  given to the structure viewer.");
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
        // Assume no periodicity if not defined
        if ((periodicity == undefined) || (periodicity == null)) {
            periodicity = [false, false, false];
        }
        this.root = new THREE.Object3D();
        this.container = new THREE.Object3D();
        this.infoContainer = new THREE.Object3D();
        this.atoms = new THREE.Object3D();
        this.bonds = new THREE.Object3D();
        this.container.add(this.atoms);
        this.container.add(this.bonds);
        this.angleArcs = new THREE.Object3D();
        this.root.add(this.container);
        this.sceneStructure.add(this.root);
        this.sceneInfo.add(this.infoContainer);
        this.latticeConstants = new THREE.Object3D();
        this.container.add(this.latticeConstants);
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
        // Determine the periodicity and setup the vizualization accordingly
        let nPeriodic = 0;
        const periodicIndices = [];
        const p1 = periodicity[0];
        const p2 = periodicity[1];
        const p3 = periodicity[2];
        if (p1 && p2 && p3) {
            nPeriodic = 3;
        }
        else if (!p1 && !p2 && !p3) {
            nPeriodic = 0;
        }
        else {
            for (let dim = 0; dim < 3; ++dim) {
                const p1 = periodicity[dim];
                const p2 = periodicity[(dim + 1) % 3];
                const p3 = periodicity[(dim + 2) % 3];
                if (p1 && !p2 && !p3) {
                    nPeriodic = 1;
                    periodicIndices.push(dim);
                    break;
                }
                else if (p1 && p2 && !p3) {
                    nPeriodic = 2;
                    periodicIndices.push(dim);
                    periodicIndices.push((dim + 1) % 3);
                    break;
                }
            }
        }
        // Valid cell basis
        if (this.B !== undefined) {
            this.createConventionalCell(periodicity, this.options.cell.enabled);
            this.createLatticeConstants(this.basisVectors, periodicity, periodicIndices);
            this.createAtoms(fracPos, atomicNumbers, periodicity, true);
            // Cell with non-valid basis
        }
        else if (this.basisVectors !== undefined) {
            this.createConventionalCell(periodicity, this.options.cell.enabled);
            this.createLatticeConstants(this.basisVectors, periodicity, periodicIndices);
            this.createAtoms(cartPos, atomicNumbers, periodicity, false);
            // No cell at all
        }
        else {
            this.createAtoms(cartPos, atomicNumbers, periodicity, false);
        }
        let atomPos = this.getPositions();
        // Create bonds
        this.createBonds(bonds);
        // Setup the view center
        let viewCenter = this.options.layout.viewCenter;
        let centerPos;
        // Center of positions takes into account also the repeated positions
        // and positions created at the cell boundaries.
        if (viewCenter === "COP") {
            centerPos = this.calculateCOP(atomPos);
        }
        else if (viewCenter === "COC") {
            centerPos = new THREE.Vector3()
                .add(this.basisVectors[0])
                .add(this.basisVectors[1])
                .add(this.basisVectors[2])
                .multiplyScalar(0.5);
        }
        else if (Array.isArray(viewCenter)) {
            centerPos = new THREE.Vector3().fromArray(viewCenter);
        }
        this.setViewCenter(centerPos);
        // Translate the system according to given option
        this.translate(this.options.layout.translation);
        // Zoom according to given option
        this.setZoom(this.options.controls.zoomLevel);
        // Set view alignment and rotation
        if (this.basisVectors !== undefined) {
            this.alignView((_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.layout) === null || _b === void 0 ? void 0 : _b.viewRotation) === null || _c === void 0 ? void 0 : _c.alignments);
        }
        this.rotateView((_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.layout) === null || _e === void 0 ? void 0 : _e.viewRotation) === null || _f === void 0 ? void 0 : _f.rotations);
        if (this.options.view.autoFit) {
            this.fitToCanvas();
        }
        this.toggleShadows(this.options.renderer.shadows.enabled);
        this.render();
        return true;
    }
    /**
     *
     */
    calculateCOP(positions) {
        let nPos = positions.length;
        let sum = new THREE.Vector3();
        for (let i = 0; i < nPos; ++i) {
            let pos = positions[i];
            sum.add(pos);
        }
        sum.divideScalar(nPos);
        return sum;
    }
    /**
     * Centers the visualization around a specific point.
     * @param centerPos - The center position as a cartesian vector.
     */
    setViewCenter(centerPos) {
        this.container.position.sub(centerPos);
        this.infoContainer.position.sub(centerPos);
        this.render();
    }
    /**
     * Translate the atoms.
     *
     * @param translation - Cartesian translation to apply.
     */
    translate(translation) {
        const vec = new THREE.Vector3().fromArray(translation);
        this.atoms.position.add(vec);
        this.bonds.position.add(vec);
        this.render();
    }
    /**
     * Set the position for atoms in the currently loaded structure.
     */
    setPositions(positions, fractional = false, render = true) {
        // Check the periodicity setting. You can only call this function if no
        // additional atoms need to be created through the periodicity setting.
        if (this.options.layout.periodicity !== "none" && this.options.layout.periodicity !== "wrap") {
            throw "Setting new positions is not allowed when options.layout.periodicity != 'none'/'wrap'.";
        }
        // Convert to vectors
        const vecPos = this.toVectors(positions);
        if (this.options.layout.periodicity === "wrap") {
            this.wrap(vecPos, fractional);
        }
        if (fractional) {
            this.toCartesian(vecPos, false);
        }
        for (let i = 0, size = vecPos.length; i < size; ++i) {
            const position = vecPos[i];
            const atom = this.getAtom(i);
            atom.position.copy(position);
        }
        this.updateBonds = true;
        this.createBonds();
        if (render) {
            this.render();
        }
    }
    /**
     * Gets the positions for atoms in the currently loaded structure.
     */
    getPositions(fractional = false) {
        let positions = [];
        let atoms = this.atoms.children;
        let nAtoms = atoms.length;
        if (fractional) {
            let cartPos = [];
            for (let i = 0; i < nAtoms; ++i) {
                let atom = atoms[i];
                let position = atom.position.clone();
                cartPos.push(position);
            }
            positions = this.toScaled(cartPos);
        }
        else {
            for (let i = 0; i < nAtoms; ++i) {
                let atom = atoms[i];
                let position = atom.position.clone();
                positions.push(position);
            }
        }
        return positions;
    }
    toVectors(positions, copy = true) {
        // Convert to vectors
        const vecPos = [];
        for (let i = 0, size = positions.length; i < size; ++i) {
            vecPos.push(new THREE.Vector3().fromArray(positions[i]));
        }
        if (copy) {
            return vecPos;
        }
        positions = vecPos;
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
        return this.atoms.getObjectByName(`atom${index}`);
    }
    /**
     * Set the zoom level
     *
     * @param zoomLevel - The zoom level as a scalar.
     */
    setZoom(zoomLevel) {
        this.camera.zoom = zoomLevel;
        this.render();
    }
    setupLights() {
        var _a, _b, _c, _d, _e, _f;
        this.lights = [];
        let shadowMapWidth = 2048;
        let shadowBias = -0.001;
        let shadowCutoff = 50;
        // Key light
        let keyLight = new THREE.DirectionalLight(0xffffff, 0.45);
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
        let fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.shadow.mapSize.width = shadowMapWidth;
        fillLight.shadow.mapSize.height = shadowMapWidth;
        fillLight.shadow.bias = shadowBias;
        fillLight.position.set(-20, 0, -20);
        if (((_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.atoms) === null || _b === void 0 ? void 0 : _b.material) === null || _c === void 0 ? void 0 : _c.toon) === undefined) {
            this.sceneStructure.add(fillLight);
            this.lights.push(fillLight);
        }
        // Back light
        let backLight = new THREE.DirectionalLight(0xffffff, 0.25);
        backLight.shadow.mapSize.width = shadowMapWidth;
        backLight.shadow.mapSize.height = shadowMapWidth;
        backLight.shadow.bias = shadowBias;
        backLight.position.set(20, 0, -20);
        if (((_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.atoms) === null || _e === void 0 ? void 0 : _e.material) === null || _f === void 0 ? void 0 : _f.toon) === undefined) {
            this.sceneStructure.add(backLight);
            this.lights.push(backLight);
        }
        // White ambient light.
        let ambientLight = new THREE.AmbientLight(0x404040, 1.7); // soft white light
        this.sceneStructure.add(ambientLight);
    }
    /**
     * Create the visuals to show the lattice parameter labels.
     */
    createLatticeConstants(basis, periodicity, periodicIndices) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        if (!this.options.latticeConstants.enabled) {
            return;
        }
        this.axisLabels = [];
        this.infoContainer.add(this.latticeConstants);
        this.infoContainer.add(this.angleArcs);
        let infoColor = 0x000000;
        let axisMaterial = new THREE.LineBasicMaterial({
            color: "#000000",
            linewidth: 1.5
        });
        let axisOffset = 1.3;
        let iBasis = -1;
        let cellBasisColors = [];
        cellBasisColors.push(this.options.latticeConstants.a.color);
        cellBasisColors.push(this.options.latticeConstants.b.color);
        cellBasisColors.push(this.options.latticeConstants.c.color);
        const angleColors = [];
        angleColors.push(this.options.latticeConstants.alpha.color);
        angleColors.push(this.options.latticeConstants.beta.color);
        angleColors.push(this.options.latticeConstants.gamma.color);
        const angleStrokeColors = [];
        angleStrokeColors.push(((_b = (_a = this.options.latticeConstants.alpha) === null || _a === void 0 ? void 0 : _a.stroke) === null || _b === void 0 ? void 0 : _b.color) === undefined ? this.options.latticeConstants.stroke.color : this.options.latticeConstants.alpha.stroke.color);
        angleStrokeColors.push(((_d = (_c = this.options.latticeConstants.beta) === null || _c === void 0 ? void 0 : _c.stroke) === null || _d === void 0 ? void 0 : _d.color) === undefined ? this.options.latticeConstants.stroke.color : this.options.latticeConstants.beta.stroke.color);
        angleStrokeColors.push(((_f = (_e = this.options.latticeConstants.gamma) === null || _e === void 0 ? void 0 : _e.stroke) === null || _f === void 0 ? void 0 : _f.color) === undefined ? this.options.latticeConstants.stroke.color : this.options.latticeConstants.gamma.stroke.color);
        const angleStrokeWidths = [];
        angleStrokeWidths.push(((_h = (_g = this.options.latticeConstants.alpha) === null || _g === void 0 ? void 0 : _g.stroke) === null || _h === void 0 ? void 0 : _h.width) === undefined ? this.options.latticeConstants.stroke.width : this.options.latticeConstants.alpha.stroke.width);
        angleStrokeWidths.push(((_k = (_j = this.options.latticeConstants.beta) === null || _j === void 0 ? void 0 : _j.stroke) === null || _k === void 0 ? void 0 : _k.width) === undefined ? this.options.latticeConstants.stroke.width : this.options.latticeConstants.beta.stroke.width);
        angleStrokeWidths.push(((_m = (_l = this.options.latticeConstants.gamma) === null || _l === void 0 ? void 0 : _l.stroke) === null || _m === void 0 ? void 0 : _m.width) === undefined ? this.options.latticeConstants.stroke.width : this.options.latticeConstants.gamma.stroke.width);
        let angleLabels = [this.options.latticeConstants.gamma.label, this.options.latticeConstants.alpha.label, this.options.latticeConstants.beta.label];
        let axisLabels = [this.options.latticeConstants.a.label, this.options.latticeConstants.b.label, this.options.latticeConstants.c.label];
        let angleEnableds = [this.options.latticeConstants.gamma.enabled, this.options.latticeConstants.alpha.enabled, this.options.latticeConstants.beta.enabled];
        let axisEnableds = [this.options.latticeConstants.a.enabled, this.options.latticeConstants.b.enabled, this.options.latticeConstants.c.enabled];
        let axisFonts = [];
        axisFonts.push(this.options.latticeConstants.a.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.a.font);
        axisFonts.push(this.options.latticeConstants.b.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.b.font);
        axisFonts.push(this.options.latticeConstants.c.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.c.font);
        const axisFontSizes = [];
        axisFontSizes.push(this.options.latticeConstants.a.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.a.size);
        axisFontSizes.push(this.options.latticeConstants.b.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.b.size);
        axisFontSizes.push(this.options.latticeConstants.c.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.c.size);
        const strokeColors = [];
        strokeColors.push(((_p = (_o = this.options.latticeConstants.a) === null || _o === void 0 ? void 0 : _o.stroke) === null || _p === void 0 ? void 0 : _p.color) === undefined ? this.options.latticeConstants.stroke.color : this.options.latticeConstants.a.stroke.color);
        strokeColors.push(((_r = (_q = this.options.latticeConstants.b) === null || _q === void 0 ? void 0 : _q.stroke) === null || _r === void 0 ? void 0 : _r.color) === undefined ? this.options.latticeConstants.stroke.color : this.options.latticeConstants.b.stroke.color);
        strokeColors.push(((_t = (_s = this.options.latticeConstants.c) === null || _s === void 0 ? void 0 : _s.stroke) === null || _t === void 0 ? void 0 : _t.color) === undefined ? this.options.latticeConstants.stroke.color : this.options.latticeConstants.c.stroke.color);
        const strokeWidths = [];
        strokeWidths.push(((_v = (_u = this.options.latticeConstants.a) === null || _u === void 0 ? void 0 : _u.stroke) === null || _v === void 0 ? void 0 : _v.width) === undefined ? this.options.latticeConstants.stroke.width : this.options.latticeConstants.a.stroke.width);
        strokeWidths.push(((_x = (_w = this.options.latticeConstants.b) === null || _w === void 0 ? void 0 : _w.stroke) === null || _x === void 0 ? void 0 : _x.width) === undefined ? this.options.latticeConstants.stroke.width : this.options.latticeConstants.b.stroke.width);
        strokeWidths.push(((_z = (_y = this.options.latticeConstants.c) === null || _y === void 0 ? void 0 : _y.stroke) === null || _z === void 0 ? void 0 : _z.width) === undefined ? this.options.latticeConstants.stroke.width : this.options.latticeConstants.c.stroke.width);
        const angleFonts = [];
        angleFonts.push(this.options.latticeConstants.alpha.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.alpha.font);
        angleFonts.push(this.options.latticeConstants.beta.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.beta.font);
        angleFonts.push(this.options.latticeConstants.gamma.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.gamma.font);
        const angleFontSizes = [];
        angleFontSizes.push(this.options.latticeConstants.alpha.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.alpha.size);
        angleFontSizes.push(this.options.latticeConstants.beta.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.beta.size);
        angleFontSizes.push(this.options.latticeConstants.gamma.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.gamma.size);
        let axisLabelSprites = [];
        let angleLabelSprites = [];
        // If 2D periodic, we save the periodic indices, and ensure a right
        // handed coordinate system.
        for (let iTrueBasis = 0; iTrueBasis < 3; ++iTrueBasis) {
            iBasis += 1;
            let axisLabel = axisLabels[iBasis];
            let axisColor = cellBasisColors[iBasis];
            let axisFont = axisFonts[iBasis];
            let axisFontSize = axisFontSizes[iBasis];
            let angleFontSize = angleFontSizes[iBasis];
            let strokeWidth = strokeWidths[iBasis];
            let strokeColor = strokeColors[iBasis];
            let angleFont = angleFonts[iBasis];
            let angleColor = angleColors[iBasis];
            let angleLabel = angleLabels[iBasis];
            let angleStrokeColor = angleStrokeColors[iBasis];
            let angleStrokeWidth = angleStrokeWidths[iBasis];
            let axisEnabled = axisEnableds[iBasis];
            let angleEnabled = angleEnableds[iBasis];
            const collapsed1 = this.basisVectorCollapsed[iTrueBasis];
            const collapsed2 = this.basisVectorCollapsed[(iTrueBasis + 1) % 3];
            const collapsed3 = this.basisVectorCollapsed[(iTrueBasis + 2) % 3];
            let basisVec1 = basis[iTrueBasis];
            let basisVec2 = basis[(iTrueBasis + 1) % 3].clone();
            let basisVec3 = basis[(iTrueBasis + 2) % 3].clone();
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
                this.latticeConstants.add(axisLabelSprite);
                this.axisLabels.push(axisLabelSprite);
                // Add basis vector colored line
                const cellVectorMaterial = new THREE.MeshBasicMaterial({
                    color: axisColor,
                    transparent: true,
                    opacity: 0.75
                });
                const cellVector = basisVec1.clone();
                const cellVectorLine = this.createCylinder(origin.clone(), cellVector.clone().add(origin), 0.09, 10, cellVectorMaterial);
                this.latticeConstants.add(cellVectorLine);
                // Add basis vector axis line
                const cellAxisMaterial = new THREE.MeshBasicMaterial({
                    color: "#000000",
                });
                const axisStart = this.basisVectors[iTrueBasis].clone();
                const axisEnd = axisStart.clone().multiplyScalar(1 + axisOffset / axisStart.length());
                const cellAxisVectorLine = this.createCylinder(origin.clone(), axisEnd, 0.02, 10, cellAxisMaterial);
                this.latticeConstants.add(cellAxisVectorLine);
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
                this.latticeConstants.add(arrow);
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
                this.latticeConstants.add(angleLabelObj);
                this.axisLabels.push(angleLabelObj);
                this.angleArcs.add(arc);
            }
        }
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
    getCornerPoints() {
        // The atom positions will be used as visualization boundaries
        this.atoms.updateMatrixWorld();
        const atoms = this.atoms.children;
        // Transform positions to world coordinates
        const nAtoms = atoms.length;
        const worldPos = [];
        for (let i = 0; i < nAtoms; ++i) {
            const atom = atoms[i];
            const wPos = new THREE.Vector3();
            atom.getWorldPosition(wPos);
            worldPos.push(wPos);
        }
        return {
            points: worldPos,
            margin: this.maxRadii
        };
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
    getColor(atomicNumber) {
        return this.elementColors[atomicNumber] || this.color_unknown;
    }
    /**
     * Create the conventional cell
     *
     */
    createConventionalCell(periodicity, visible) {
        const cell = this.createCell(new THREE.Vector3(), this.basisVectors, this.basisVectorCollapsed, periodicity, this.options.cell.color, this.options.cell.linewidth, this.options.cell.dashSize, this.options.cell.gapSize);
        cell.visible = visible;
        this.convCell = cell;
        this.container.add(this.convCell);
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
        let cell = new THREE.Object3D();
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
            let basisVector = basisVectors[i].clone();
            let collapsed = basisVectorCollapsed[i];
            // First line
            let line1Mat = lineMaterial.clone();
            let isDim1 = !periodicity[i];
            if (!(isDim1 && collapsed)) {
                const points = [];
                points.push(origin.clone());
                points.push(basisVector.clone().add(origin));
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                let line = new THREE.Line(lineGeometry, line1Mat);
                cell.add(line);
                line.computeLineDistances();
            }
            // Second line
            let secondIndex = (i + 1) % len;
            let secondAddition = basisVectors[secondIndex].clone();
            let isDim2 = !periodicity[i] || !periodicity[(i + 1) % 3];
            if (!(isDim2 && collapsed)) {
                let line2Mat = lineMaterial.clone();
                const points = [];
                points.push(secondAddition.clone().add(origin));
                points.push(basisVector.clone().add(secondAddition).add(origin));
                let line2Geometry = new THREE.BufferGeometry().setFromPoints(points);
                let line2 = new THREE.Line(line2Geometry, line2Mat);
                cell.add(line2);
                line2.computeLineDistances();
            }
            // Third line
            let thirdIndex = (i + 2) % len;
            let thirdAddition = basisVectors[thirdIndex].clone();
            let isDim3 = !periodicity[i] || !periodicity[(i + 2) % 3];
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
            let isDim4 = !periodicity[i] || !periodicity[(i + 2) % 3] || !periodicity[(i + 1) % 3];
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
            this.rotateAroundWorldAxis(this.root, basis, angle);
            this.rotateAroundWorldAxis(this.sceneInfo, basis, angle);
        }
        if (render) {
            this.render();
        }
    }
    alignView(alignments, render = true) {
        // Define available directions
        const directions = {
            "a": this.basisVectors[0].clone(),
            "-a": this.basisVectors[0].clone().negate(),
            "b": this.basisVectors[1].clone(),
            "-b": this.basisVectors[1].clone().negate(),
            "c": this.basisVectors[2].clone(),
            "-c": this.basisVectors[2].clone().negate(),
        };
        // List the objects whose matrix needs to be updated
        const objects = [this.root, this.sceneInfo];
        // Rotate
        super.alignView(alignments, directions, objects, render);
    }
    /**
     * Used to add periodic repetitions of atoms.
     */
    repeat(multipliers, fracPos, labels) {
        let a = new THREE.Vector3(1, 0, 0);
        let b = new THREE.Vector3(0, 1, 0);
        let c = new THREE.Vector3(0, 0, 1);
        let newPos = [];
        let newLabels = [];
        for (let i = 0; i < multipliers[0]; ++i) {
            for (let j = 0; j < multipliers[1]; ++j) {
                for (let k = 0; k < multipliers[2]; ++k) {
                    if (!(i == 0 && j == 0 && k == 0)) {
                        // Add clone to the current coordinate
                        let aTranslation = a.clone().multiplyScalar(i);
                        let bTranslation = b.clone().multiplyScalar(j);
                        let cTranslation = c.clone().multiplyScalar(k);
                        // Add in front
                        for (let l = 0, size = fracPos.length; l < size; ++l) {
                            let iPos = new THREE.Vector3().copy(fracPos[l]);
                            iPos.add(aTranslation);
                            iPos.add(bTranslation);
                            iPos.add(cTranslation);
                            let iLabel = labels[l];
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
     * Wraps all atoms to be within the unit cell.
     */
    wrap(positions, fractional = true) {
        if (!fractional) {
            this.toScaled(positions, false);
        }
        for (let len = positions.length, i = 0; i < len; ++i) {
            const iFracPos = positions[i];
            if (this.structure["pbc"][0])
                iFracPos.x = iFracPos.x < 0 ? 1 + (iFracPos.x % 1) : iFracPos.x % 1;
            if (this.structure["pbc"][1])
                iFracPos.y = iFracPos.y < 0 ? 1 + (iFracPos.y % 1) : iFracPos.y % 1;
            if (this.structure["pbc"][2])
                iFracPos.z = iFracPos.z < 0 ? 1 + (iFracPos.z % 1) : iFracPos.z % 1;
        }
        if (!fractional) {
            this.toCartesian(positions, false);
        }
    }
    /**
     * Used to add periodic repetitions of atoms at the unit cell boundary.
     */
    addBoundaryAtoms(fracPos, labels) {
        for (let len = fracPos.length, i = 0; i < len; ++i) {
            let iFracPos = fracPos[i];
            let atomicNumber = labels[i];
            // If the atom sits on the cell surface, add the periodic images if
            // requested.
            let x = iFracPos.x;
            let y = iFracPos.y;
            let z = iFracPos.z;
            let xZero = this.almostEqual(0, x, this.basisVectors[0], this.options.layout.wrapTolerance);
            let yZero = this.almostEqual(0, y, this.basisVectors[1], this.options.layout.wrapTolerance);
            let zZero = this.almostEqual(0, z, this.basisVectors[2], this.options.layout.wrapTolerance);
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
    createAtoms(positions, labels, pbc, fractional = true) {
        // Delete old atoms
        this.atoms.remove(...this.atoms.children);
        this.elements = {};
        this.atomNumbers = [];
        this.atomFills = [];
        this.atomOutlines = [];
        // Determine the periodicity handling
        if (pbc.some(a => { return a === true; })) {
            let periodicity = this.options.layout.periodicity;
            if (periodicity === "wrap") {
                this.wrap(positions, fractional);
            }
            else if (fractional && periodicity === "boundary") {
                this.addBoundaryAtoms(positions, labels);
            }
            else if (fractional && Array.isArray(periodicity)) {
                this.repeat(periodicity, positions, labels);
            }
        }
        // Create the 3D atoms at the correct positions
        let meshMap = {};
        for (let len = positions.length, i = 0; i < len; ++i) {
            let iPos = positions[i];
            // Add the primary atom
            let atomicNumber = labels[i];
            this.addAtom(i, iPos, atomicNumber, meshMap, fractional);
            // Gather element legend data
            let elementName = this.elementNames[atomicNumber];
            this.elements[elementName] = [this.getColor(atomicNumber), this.getRadii(atomicNumber)];
        }
    }
    /**
     * Creates bonds between the atoms based on radii and distance.
     *
     * @param bonds - A Nx2 list of atom indices specifying the bonded atoms. Alternatively
     *                you can use "auto" to automatically create the bonds.
     */
    createBonds(bonds = "auto") {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!this.options.bonds.enabled) {
            return;
        }
        // See if the bonds need to be updated.
        if (!this.updateBonds) {
            return;
        }
        // Delete old bonds
        this.bondFills = [];
        this.bonds.remove(...this.bonds.children);
        // Get current positions
        let atomPos = this.getPositions();
        // Create material once
        let bondMaterial;
        if ((_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.bonds) === null || _b === void 0 ? void 0 : _b.material) === null || _c === void 0 ? void 0 : _c.toon) {
            const nTones = (_g = (_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.bonds) === null || _e === void 0 ? void 0 : _e.material) === null || _f === void 0 ? void 0 : _f.toon) === null || _g === void 0 ? void 0 : _g.tones;
            const colors = new Uint8Array(nTones);
            for (let c = 0; c <= nTones; c++) {
                colors[c] = (c / nTones) * 256;
            }
            let gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);
            gradientMap.minFilter = THREE.NearestFilter;
            gradientMap.magFilter = THREE.NearestFilter;
            gradientMap.generateMipmaps = false;
            bondMaterial = new THREE.MeshToonMaterial({
                color: this.options.bonds.color,
                gradientMap: gradientMap
            });
        }
        else {
            bondMaterial = new THREE.MeshPhongMaterial({ color: this.options.bonds.color, shininess: this.options.bonds.material.phong.shininess });
        }
        // Manual bonds
        if (Array.isArray(bonds)) {
            for (let bond of bonds) {
                let i = bond[0];
                let j = bond[1];
                let pos1 = atomPos[i];
                let pos2 = atomPos[j];
                this.addBond(i, j, pos1, pos2, bondMaterial);
            }
            // Automatically detect bonds
        }
        else if (bonds === "auto") {
            let nAtoms = atomPos.length;
            for (let i = 0; i < nAtoms; ++i) {
                for (let j = 0; j < nAtoms; ++j) {
                    if (j > i) {
                        let pos1 = atomPos[i];
                        let pos2 = atomPos[j];
                        let num1 = this.atomNumbers[i];
                        let num2 = this.atomNumbers[j];
                        let distance = pos2.clone().sub(pos1).length();
                        let radii1 = this.options.atoms.scale * this.getRadii(num1);
                        let radii2 = this.options.atoms.scale * this.getRadii(num2);
                        if (distance <= this.options.bonds.threshold * 1.1 * (radii1 + radii2)) {
                            this.addBond(i, j, pos1, pos2, bondMaterial);
                        }
                    }
                }
            }
        }
        this.updateBonds = false;
    }
    /**
     * Used to check if the given fractional position component is almost the
     * given target value with a tolerance given in cartesian corodinates.
     */
    almostEqual(target, coordinate, basisVector, tolerance) {
        let relDistance = (coordinate - target);
        let absDistance = Math.abs(basisVector.clone().multiplyScalar(relDistance).length());
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
     * @param fractional - Are the coordinates relatice to the cell basis vectors
     */
    addBond(i, j, pos1, pos2, bondMaterial) {
        // Bond
        let radius = this.options.bonds.radius;
        let targetAngle = this.options.bonds.smoothness;
        let nSegments = Math.ceil(360 / (180 - targetAngle));
        let cylinder = this.createCylinder(pos1, pos2, radius, nSegments, bondMaterial);
        cylinder.name = "fill";
        this.bondFills.push(cylinder);
        // Put all bonds visuals inside a named group
        let group = new THREE.Group();
        group.name = "bond" + i + "-" + j;
        group.add(cylinder);
        // Bond outline hack
        if (this.options.outline.enabled) {
            let addition = this.options.outline.size;
            let scale = addition / radius + 1;
            let outlineMaterial = new THREE.MeshBasicMaterial({ color: this.options.outline.color, side: THREE.BackSide });
            let outline = this.createCylinder(pos1, pos2, scale * radius, 10, outlineMaterial);
            outline.name = "outline";
            group.add(outline);
        }
        this.bonds.add(group);
    }
    /**
     * Creates atoms and directly adds themto the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     * @param fractional - Are the coordinates relatice to the cell basis vectors
     */
    addAtom(index, position, atomicNumber, mesh, fractional = true) {
        var _a, _b, _c, _d, _e, _f, _g;
        let exists = atomicNumber in mesh;
        if (!exists) {
            mesh[atomicNumber] = {};
            // Calculate the amount of segments that are needed to reach a
            // certain angle for the ball surface segments
            let radius = this.options.atoms.scale * this.getRadii(atomicNumber);
            let targetAngle = this.options.atoms.smoothness;
            let nSegments = Math.ceil(360 / (180 - targetAngle));
            // Atom
            let color = this.getColor(atomicNumber);
            let atomGeometry = new THREE.SphereGeometry(radius, nSegments, nSegments);
            let atomMaterial;
            if (((_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.atoms) === null || _b === void 0 ? void 0 : _b.material) === null || _c === void 0 ? void 0 : _c.toon) !== undefined) {
                let nTones = (_g = (_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.atoms) === null || _e === void 0 ? void 0 : _e.material) === null || _f === void 0 ? void 0 : _f.toon) === null || _g === void 0 ? void 0 : _g.tones;
                var colors = new Uint8Array(nTones);
                for (var c = 0; c <= nTones; c++) {
                    colors[c] = (c / nTones) * 256;
                }
                var gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);
                gradientMap.minFilter = THREE.NearestFilter;
                gradientMap.magFilter = THREE.NearestFilter;
                gradientMap.generateMipmaps = false;
                atomMaterial = new THREE.MeshToonMaterial({
                    color: color,
                    gradientMap: gradientMap
                });
            }
            else {
                atomMaterial = new THREE.MeshPhongMaterial({ color: color, shininess: this.options.atoms.material.phong.shininess });
            }
            let atom = new THREE.Mesh(atomGeometry, atomMaterial);
            mesh[atomicNumber].atom = atom;
            // Atom outline hack
            if (this.options.outline.enabled) {
                let addition = this.options.outline.size;
                let scale = addition / radius + 1;
                let outlineGeometry = new THREE.SphereGeometry(radius * scale, nSegments, nSegments);
                let outlineMaterial = new THREE.MeshBasicMaterial({ color: this.options.outline.color, side: THREE.BackSide });
                let outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
                mesh[atomicNumber].outline = outline;
            }
        }
        let imesh = mesh[atomicNumber];
        let true_pos = new THREE.Vector3();
        if (fractional) {
            true_pos.add(this.basisVectors[0].clone().multiplyScalar(position.x));
            true_pos.add(this.basisVectors[1].clone().multiplyScalar(position.y));
            true_pos.add(this.basisVectors[2].clone().multiplyScalar(position.z));
        }
        else {
            true_pos.copy(position);
        }
        // Put all atoms visuals inside a named group
        let group = new THREE.Group();
        group.name = "atom" + index;
        let atom = imesh["atom"].clone();
        atom.name = "fill";
        group.add(atom);
        if (this.options.outline.enabled) {
            let outline = imesh["outline"].clone();
            this.atomOutlines.push(outline);
            outline.name = "outline";
            group.add(outline);
        }
        group.position.copy(true_pos);
        this.atoms.add(group);
        this.atomFills.push(atom);
        this.atomNumbers.push(atomicNumber);
        // Always after adding an atom the bond information should be updated.
        this.updateBonds = true;
    }
    /*
     * A modified render-function that scales the labels according to the zoom
     * level.
     */
    render() {
        let canvas = this.rootElement;
        let canvasWidth = canvas.clientWidth;
        let canvasHeight = canvas.clientHeight;
        // Project a [1,0,0] vector in the camera space to the world space, and
        // then to the screen space. The length of this vector is then used to
        // scale the labels.
        let x = new THREE.Vector3(1, 0, 0);
        let origin = new THREE.Vector3(0, 0, 0);
        let vectors = [x, origin];
        for (let i = 0; i < vectors.length; ++i) {
            let vec = vectors[i];
            this.camera.localToWorld(vec);
            vec.project(this.camera);
            vec.x = Math.round((vec.x + 1) * canvasWidth / 2);
            vec.y = Math.round((-vec.y + 1) * canvasHeight / 2);
        }
        let displacement = new THREE.Vector3().subVectors(origin, x);
        let distance = displacement.length();
        let scale = 8 * 1 / Math.pow(distance, 0.5); // The sqrt makes the scaling behave nicer...
        if (this.axisLabels !== undefined) {
            for (let i = 0; i < this.axisLabels.length; ++i) {
                let label = this.axisLabels[i];
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
        let vectorLen = latticeVector.length();
        let multiplier = Math.max(Math.floor(targetSize / vectorLen) - 1, 1);
        return multiplier;
    }
}
