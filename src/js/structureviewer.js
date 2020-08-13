import { Viewer } from "./viewer";
import * as THREE from 'three';
/**
 * Class for visualizing an atomic structure.
 */
export class StructureViewer extends Viewer {
    constructor() {
        super(...arguments);
        this.updateBonds = false;
        this.atomicRadii = []; // Contains the atomic radii
        this.elementColors = []; // Contains the atomic radii
        this.lights = []; // Contains the lights in the scene
        this.bondFills = []; // Contains the bulk of the bonds
        this.atomFills = []; // Contains the bulk of the atoms
        this.atomOutlines = []; // Contains the outlines of the atoms
        this.axisLabels = []; // List of all labels in the view.
        this.elementNames = [
            'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si',
            'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni',
            'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb',
            'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
            'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho',
            'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
            'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np',
            'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Ha', 'Sg',
            'Ns', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og' // Mt = 109
        ];
        this.elementNumbers = {
            'H': 1, 'He': 2, 'Li': 3, 'Be': 4,
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
            'Fm': 100, 'Md': 101, 'No': 102, 'Lr': 103,
        };
        //  Covalent radii revisited,
        //  Beatriz Cordero, Verónica Gómez, Ana E. Platero-Prats, Marc Revés,
        //  Jorge Echeverría, Eduard Cremades, Flavia Barragán and Santiago Alvarez,
        //  Dalton Trans., 2008, 2832-2838 DOI:10.1039/B801115J
        this.missing = 0.2;
        this.covalentRadii = [
            this.missing,
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
            this.missing,
            this.missing,
            this.missing,
            this.missing,
            this.missing,
            this.missing,
            this.missing,
        ];
        // Jmol colors. See: http://jmol.sourceforge.net/jscolors/#color_U
        this.jmolColors = [
            "#ff0000",
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
     *
     * @param {boolean} options.latticeConstants.enabled Show lattice parameters
     * @param {string} options.latticeConstants.font Font size for lattice
     *   constants. Applied as default to all labels, can be overridden
     *   individually for each lattice constant.
     * @param {string} options.latticeConstants.a.color Color applied to the
     *   lattice constant of the first lattice vector.
     * @param {string} options.latticeConstants.a.font Font family applied to the
     *   lattice constant of the first lattice vector.
     * @param {number} options.latticeConstants.a.size Font size applied to the
     *   lattice constant of the first lattice vector.
     * @param {string} options.latticeConstants.b.color Color applied to the
     *   lattice constant of the second lattice vector.
     * @param {string} options.latticeConstants.b.font Font family applied to the
     *   lattice constant of the second lattice vector.
     * @param {number} options.latticeConstants.b.size Font size applied to the
     *   lattice constant of the second lattice vector.
     * @param {string} options.latticeConstants.c.color Color applied to the
     *   lattice constant of the second lattice vector.
     * @param {string} options.latticeConstants.c.font Font family applied to the
     *   lattice constant of the third lattice vector.
     * @param {number} options.latticeConstants.c.size Font size applied to the
     *   lattice constant of the third lattice vector.
     * @param {string} options.latticeConstants.alpha.color Color applied to the
     *   angle between the second and third lattice vector.
     * @param {string} options.latticeConstants.alpha.font Font family applied to the
     *   angle between the second and third lattice vector.
     * @param {number} options.latticeConstants.alpha.size Font size applied to the
     *   lattice constant of the third lattice vector.
     * @param {string} options.latticeConstants.beta.color Color applied to the
     *   angle between the first and third lattice vector.
     * @param {string} options.latticeConstants.beta.font Font family applied to the
     *   angle between the first and third lattice vector.
     * @param {number} options.latticeConstants.beta.size Font size applied to the
     *   angle between the first and third lattice vector.
     * @param {string} options.latticeConstants.gamma.color Color applied to the
     *   angle between the first and second lattice vector.
     * @param {string} options.latticeConstants.gamma.font Font family applied to the
     *   angle between the first and second lattice vector.
     * @param {number} options.latticeConstants.gamma.size Font size applied to the
     *   angle between the first and second lattice vector.
     *
     * @param {boolean} options.outline.enabled Used to enable or disable a
     *   fixed color outline around atoms and bonds. Notice that enabling the
     *   outline incurs a performance penalty.
     * @param {string} options.outline.color Outline color.
     * @param {number} options.outline.size Outline size.
     *
     * @param {boolean} options.cell.enabled Show unit cell wireframe.
     *
     * @param {boolean} options.bonds.enabled Show bonds.
     * @param {number} options.bonds.radius Bond radius.
     * @param {number} options.bonds.smoothness A value between 0-180 that
     *   controls the number of polygons. Used as the angle between adjacent
     *   cylinder/sphere sectors that indirectly controls the number of
     *   polygons.
     * @param {number} options.bonds.material.shininess Shininess of the bond material.
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
     * @param {number} options.atoms.material.shininess Shininess of the bond material.
     * @param {string|number[]} options.atoms.radii The radii to use for atoms.
     * Defaults to covalent radii. Available options are:
     *
     *   * "covalent": Covalent radii from DOI:10.1039/B801115J.
     *   * Custom list of atomic radii. Provide an array of floating point
     *     numbers where the index corresponds to an atomic number.
     *
     * @param {string|string[]} options.atoms.colors The colors to use
     * for atoms. Available options are:
     *
     *   * "Jmol" (default): Jmol colors.
     *   * Custom list of colors. Provide an array of hexadesimal colorss where
     *     the index corresponds to an atomic number.
     *
     * @param {number} options.atoms.scale Scaling factor for the atomic radii.
     *
     * @param {*} options.renderer.backgroundColor Color of the background.
     * Provide an array with two values, the first being the hexadecimal color
     * value and the second the opacity. E.g. ["#ffffff", 0] would produce a
     * fully opaque background.
     * @param {boolean} options.renderer.shadows.enabled Whether shows are cast
     * by atoms onto others. Note that enabling this increases the
     * computational cost for doing the visualization.
     * @param {boolean} render Whether to perform a render after settig the
     * options. Defaults to true. You should only disable this setting if you
     * plan to do a render manually afterwards.
     */
    setOptions(options, render = true) {
        let defaultOptions = {
            view: {
                fitMargin: 0.5,
            },
            layout: {
                periodicity: "none",
                translation: [0, 0, 0],
                viewCenter: "COP",
                viewRotation: [],
                wrapTolerance: 0.05,
            },
            outline: {
                enabled: true,
                color: "#000000",
                size: 0.025,
            },
            cell: {
                enabled: true,
            },
            latticeConstants: {
                enabled: true,
                font: "Arial",
                size: 0.8,
                a: {
                    color: "#C52929",
                },
                b: {
                    color: "#47A823",
                },
                c: {
                    color: "#3B5796",
                },
                alpha: {
                    color: "#ffffff",
                },
                beta: {
                    color: "#ffffff",
                },
                gamma: {
                    color: "#ffffff",
                },
            },
            bonds: {
                enabled: true,
                material: {
                    shininess: 30,
                },
                radius: 0.08,
                threshold: 1,
                smoothness: 145,
            },
            atoms: {
                material: {
                    shininess: 30,
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
            this.load(this.structure);
            if (render) {
                this.render();
            }
        }
    }
    /**
     * Returns the currently set options.
     * @returns {Object} The current options.
     */
    getOptions() {
        return this.options;
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
        this.bonds.visible = value;
    }
    /**
     * Hides or shows the shadows.
     */
    toggleShadows(value) {
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
            bond.castShadow = value;
            bond.material.needsUpdate = true;
        }
        // For some reason double rendering is required... Maybe delay()?
        this.render();
        this.render();
    }
    /**
     * Visualizes the given atomic structure.
     *
     * @param {boolean} structure A Javascript object containing the structure. See
     *   below for the subparameters.
     * @param {number[][]} structure.positions Cartesian positions. Set either
     *   this or scaledPositions.
     * @param {number[][]} structure.scaledPositions Positions given in the
     *   basis of the lattice vectors. Set either this or positions.
     * @param {number[]} structure.atomicNumbers Atomic numbers of the atoms.
     *   Set either this or chemicalSymbols.
     * @param {string[]} structure.chemicalSymbols Chemical symbols of the
     *   atoms. Set either this or atomicNumbers.
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
        // Store the structure for reloading
        this.structure = structure;
        // Clear all the old data
        this.clear();
        this.setup();
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
        let positions = structure["positions"];
        let scaledPositions = structure["scaledPositions"];
        let atomicNumbers = structure["atomicNumbers"];
        let chemicalSymbols = structure["chemicalSymbols"];
        let cell = structure["cell"];
        let periodicity = structure["pbc"];
        let bonds = structure["bonds"];
        if (!scaledPositions && !positions) {
            console.log("No atom positions given to the structure viewer");
            return false;
        }
        if (!atomicNumbers && !chemicalSymbols) {
            console.log("No atomicNumbers or chemicalSymbols given to the structure viewer.");
            return false;
        }
        // Determine the atomicNumbers if not given
        if (!atomicNumbers) {
            atomicNumbers = chemicalSymbols.map(symb => {
                return this.elementNumbers[symb];
            });
        }
        ;
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
        if (positions) {
            if (positions.length != atomicNumbers.length) {
                console.log("The number of positions does not match the number of labels.");
                return false;
            }
        }
        if (scaledPositions) {
            if (scaledPositions.length != atomicNumbers.length) {
                console.log("The number of scaled positions does not match the number of labels.");
                return false;
            }
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
        this.basisVectors = this.createBasisVectors(cell);
        let relPos = [];
        let cartPos = [];
        // Create a set of relative and cartesian positions
        if (scaledPositions !== undefined) {
            for (let i = 0; i < scaledPositions.length; ++i) {
                let pos = scaledPositions[i];
                let iRelPos = new THREE.Vector3().fromArray(pos);
                relPos.push(iRelPos);
                let iCartPos = new THREE.Vector3();
                iCartPos.add(this.basisVectors[0].clone().multiplyScalar(iRelPos.x));
                iCartPos.add(this.basisVectors[1].clone().multiplyScalar(iRelPos.y));
                iCartPos.add(this.basisVectors[2].clone().multiplyScalar(iRelPos.z));
                cartPos.push(iCartPos);
            }
        }
        else if (positions !== undefined) {
            for (let i = 0; i < positions.length; ++i) {
                let pos = positions[i];
                let iCartPos = new THREE.Vector3().fromArray(pos);
                cartPos.push(iCartPos);
                // Calculate the relative positions
                let cellMatrix = new THREE.Matrix3();
                cellMatrix.set(cell[0][0], cell[0][1], cell[0][2], cell[1][0], cell[1][1], cell[1][2], cell[2][0], cell[2][1], cell[2][2]);
                let cellInverse = new THREE.Matrix3().getInverse(cellMatrix);
                let iRelPos = iCartPos.clone().applyMatrix3(cellInverse);
                relPos.push(iRelPos);
            }
        }
        // Determine the periodicity and setup the vizualization accordingly
        let nPeriodic = 0;
        let periodicIndices = [];
        let p1 = periodicity[0];
        let p2 = periodicity[1];
        let p3 = periodicity[2];
        if (p1 && p2 && p3) {
            nPeriodic = 3;
        }
        else if (!p1 && !p2 && !p3) {
            nPeriodic = 0;
        }
        else {
            for (let dim = 0; dim < 3; ++dim) {
                let p1 = periodicity[dim];
                let p2 = periodicity[(dim + 1) % 3];
                let p3 = periodicity[(dim + 2) % 3];
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
        if (nPeriodic === 0) {
            this.setup0D(relPos, cartPos, atomicNumbers);
        }
        if (nPeriodic === 1) {
            this.setup1D(relPos, cartPos, atomicNumbers, periodicity, periodicIndices);
        }
        else if (nPeriodic === 2) {
            this.setup2D(relPos, cartPos, atomicNumbers, periodicity, periodicIndices);
        }
        else if (nPeriodic === 3) {
            this.setup3D(relPos, cartPos, atomicNumbers);
        }
        // Determine the corner points that are used to properly fit the
        // structure into the viewer. The fit takes also into account the
        // periodic duplicates and atoms created at the boundary.
        this.createVisualizationBoundaryPositions(this.atomPos, atomicNumbers);
        // Create bonds
        this.createBonds(bonds);
        // Setup the view center
        let viewCenter = this.options.layout.viewCenter;
        let centerPos;
        // Center of positions takes into account also the repeated positions
        // and positions created at the cell boundaries.
        if (viewCenter === "COP") {
            centerPos = this.calculateCOP(this.atomPos);
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
        let vec = new THREE.Vector3().fromArray(translation);
        this.atoms.position.add(vec);
        this.bonds.position.add(vec);
        this.render();
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
    /**
     * This function will setup the element legend div.
     */
    setupStatic() {
    }
    setupLights() {
        this.lights = [];
        let shadowMapWidth = 2048;
        // Key light
        let keyLight = new THREE.DirectionalLight(0xffffff, 0.45);
        keyLight.shadow.mapSize.width = shadowMapWidth;
        keyLight.shadow.mapSize.height = shadowMapWidth;
        keyLight.position.set(0, 0, 20);
        this.sceneStructure.add(keyLight);
        this.lights.push(keyLight);
        // Fill light
        let fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.shadow.mapSize.width = shadowMapWidth;
        fillLight.shadow.mapSize.height = shadowMapWidth;
        fillLight.position.set(-20, 0, -20);
        this.sceneStructure.add(fillLight);
        this.lights.push(fillLight);
        // Back light
        let backLight = new THREE.DirectionalLight(0xffffff, 0.25);
        backLight.shadow.mapSize.width = shadowMapWidth;
        backLight.shadow.mapSize.height = shadowMapWidth;
        backLight.position.set(20, 0, -20);
        //backLight.position.set( 0, 0, -20 );
        this.sceneStructure.add(backLight);
        this.lights.push(backLight);
        // White ambient light.
        let ambientLight = new THREE.AmbientLight(0x404040, 1.7); // soft white light
        this.sceneStructure.add(ambientLight);
    }
    /**
     * Create the visuals to show the lattice parameter labels.
     */
    createLatticeConstants(basis, periodicity, periodicIndices) {
        if (!this.options.latticeConstants.enabled) {
            return;
        }
        this.axisLabels = [];
        this.infoContainer.add(this.latticeConstants);
        this.infoContainer.add(this.angleArcs);
        let nPeriod = 0;
        let infoColor = 0x000000;
        for (let iDim = 0; iDim < periodicity.length; ++iDim) {
            if (periodicity[iDim]) {
                ++nPeriod;
            }
        }
        // Used to create a text label as sprite that lives in 3D space.
        let createLabel = (position, label, color, stroked = true, fontFamily, fontSize) => {
            // Configure canvas
            let canvas = document.createElement('canvas');
            let size = fontSize * 192;
            canvas.width = 1.1 * size;
            canvas.height = 1.1 * size;
            let ctx = canvas.getContext('2d');
            // Draw label
            ctx.fillStyle = color;
            ctx.font = `${size}px ${fontFamily}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (stroked) {
                ctx.lineWidth = 0.06 * size;
                ctx.strokeStyle = "#000000";
                ctx.strokeText(label, size / 2, size / 2);
            }
            ctx.fillText(label, size / 2, size / 2);
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            let material = new THREE.SpriteMaterial({ map: texture });
            let sprite = new THREE.Sprite(material);
            sprite.scale.set(fontSize, fontSize, 1);
            let labelRoot = new THREE.Object3D();
            labelRoot.position.copy(position);
            labelRoot.add(sprite);
            return labelRoot;
        };
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
        let angleColors = [];
        angleColors.push(this.options.latticeConstants.alpha.color);
        angleColors.push(this.options.latticeConstants.beta.color);
        angleColors.push(this.options.latticeConstants.gamma.color);
        let axisLabels = ["a", "b", "c"];
        let angleLabels = ["γ", "α", "β"];
        let axisFonts = [];
        axisFonts.push(this.options.latticeConstants.a.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.a.font);
        axisFonts.push(this.options.latticeConstants.b.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.b.font);
        axisFonts.push(this.options.latticeConstants.c.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.c.font);
        let axisFontSizes = [];
        axisFontSizes.push(this.options.latticeConstants.a.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.a.size);
        axisFontSizes.push(this.options.latticeConstants.b.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.b.size);
        axisFontSizes.push(this.options.latticeConstants.c.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.c.size);
        let angleFonts = [];
        angleFonts.push(this.options.latticeConstants.alpha.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.alpha.font);
        angleFonts.push(this.options.latticeConstants.beta.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.beta.font);
        angleFonts.push(this.options.latticeConstants.gamma.font === undefined ? this.options.latticeConstants.font : this.options.latticeConstants.gamma.font);
        let angleFontSizes = [];
        angleFontSizes.push(this.options.latticeConstants.alpha.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.alpha.size);
        angleFontSizes.push(this.options.latticeConstants.beta.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.beta.size);
        angleFontSizes.push(this.options.latticeConstants.gamma.size === undefined ? this.options.latticeConstants.size : this.options.latticeConstants.gamma.size);
        let axisLabelSprites = [];
        let angleLabelSprites = [];
        // If 2D periodic, we save the periodic indices, and ensure a right
        // handed coordinate system.
        let first;
        let second;
        if (nPeriod === 2) {
            first = periodicIndices[0];
            second = periodicIndices[1];
        }
        for (let iTrueBasis = 0; iTrueBasis < 3; ++iTrueBasis) {
            if (!periodicity[iTrueBasis]) {
                continue;
            }
            iBasis += 1;
            let axisLabel = axisLabels[iBasis];
            let axisColor = cellBasisColors[iBasis];
            let axisFont = axisFonts[iBasis];
            let axisFontSize = axisFontSizes[iBasis];
            let angleFontSize = angleFontSizes[iBasis];
            let angleFont = angleFonts[iBasis];
            let angleColor = angleColors[iBasis];
            // Basis and angle label selection, same for all systems
            let angleLabel = angleLabels[iBasis];
            let basisVec1 = basis[iTrueBasis];
            let basisVec2 = basis[(iTrueBasis + 1) % 3].clone();
            let basisVec3 = basis[(iTrueBasis + 2) % 3].clone();
            let origin = new THREE.Vector3(0, 0, 0);
            let dir = basisVec1.clone();
            // Add an axis label
            let textPos = dir.clone()
                .multiplyScalar(0.5);
            let labelOffset;
            let newBasis2;
            let newBasis3;
            if (basisVec2.length() == 0) {
                newBasis2 = new THREE.Vector3().crossVectors(basisVec1, basisVec3);
                labelOffset = new THREE.Vector3().crossVectors(basisVec1, newBasis2);
            }
            else if (basisVec3.length() == 0) {
                newBasis3 = new THREE.Vector3().crossVectors(basisVec1, basisVec2);
                labelOffset = new THREE.Vector3().crossVectors(basisVec1, basisVec3);
            }
            else {
                let labelOffset1 = new THREE.Vector3().crossVectors(basisVec1, basisVec2);
                let labelOffset2 = new THREE.Vector3().crossVectors(basisVec1, basisVec3);
                labelOffset = new THREE.Vector3().sub(labelOffset1).add(labelOffset2);
            }
            labelOffset.normalize();
            labelOffset.multiplyScalar(0.8);
            textPos.add(labelOffset);
            if (nPeriod === 3) {
                let axisLabelSprite = createLabel(textPos, axisLabel, axisColor, true, axisFont, axisFontSize);
                this.latticeConstants.add(axisLabelSprite);
                this.axisLabels.push(axisLabelSprite);
            }
            else if (nPeriod === 2) {
                let axisLabelSprite = createLabel(textPos, axisLabel, axisColor, true, axisFont, axisFontSize);
                this.latticeConstants.add(axisLabelSprite);
                this.axisLabels.push(axisLabelSprite);
                angleLabel = "γ";
            }
            else {
                let axisText = "a";
                let axisLabelSprite = createLabel(textPos, axisText, axisColor, true, axisFont, axisFontSize);
                this.latticeConstants.add(axisLabelSprite);
                this.axisLabels.push(axisLabelSprite);
            }
            // Add basis vector colored line
            let cellVectorMaterial = new THREE.MeshBasicMaterial({
                color: axisColor,
                transparent: true,
                opacity: 0.75
            });
            let cellVector = basisVec1.clone();
            let cellVectorLine = this.createCylinder(origin.clone(), cellVector.clone().add(origin), 0.09, 10, cellVectorMaterial);
            this.latticeConstants.add(cellVectorLine);
            // Add basis vector axis line
            let cellAxisMaterial = new THREE.MeshBasicMaterial({
                color: "#000000",
            });
            let axisStart = this.basisVectors[iTrueBasis].clone();
            let axisEnd = axisStart.clone().multiplyScalar(1 + axisOffset / axisStart.length());
            let cellAxisVector = basisVec1.clone();
            let cellAxisVectorLine = this.createCylinder(origin.clone(), axisEnd, 0.02, 10, cellAxisMaterial);
            this.latticeConstants.add(cellAxisVectorLine);
            // Add axis arrow
            let arrowGeometry = new THREE.CylinderGeometry(0, 0.10, 0.5, 12);
            let arrowMaterial = new THREE.MeshBasicMaterial({
                color: infoColor,
            });
            let arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
            arrow.position.copy(dir)
                .multiplyScalar(1 + axisOffset / dir.length());
            arrow.lookAt(new THREE.Vector3());
            arrow.rotateX(-Math.PI / 2);
            this.latticeConstants.add(arrow);
            // Add angle label and curve
            if (nPeriod === 1) {
                continue;
            }
            else if (nPeriod === 2) {
                if (!(iTrueBasis == first && (iTrueBasis + 1) % 3 == second)) {
                    continue;
                }
            }
            let arcMaterial = new THREE.LineDashedMaterial({
                color: infoColor,
                linewidth: 2,
                dashSize: 0.2,
                gapSize: 0.1
            });
            let normal = new THREE.Vector3().crossVectors(basisVec1, basisVec2);
            let angle = basisVec1.angleTo(basisVec2);
            let radius = Math.max(Math.min(1 / 4 * basisVec1.length(), 1 / 4 * basisVec2.length()), 1);
            let curve = new THREE.EllipseCurve(0, 0, // ax, aY
            radius, radius, // xRadius, yRadius
            0, angle, // aStartAngle, aEndAngle
            false, // aClockwise
            0 // aRotation
            );
            let points = curve.getSpacedPoints(20);
            let arcGeometry = new THREE.Geometry().setFromPoints(points);
            let arc = new THREE.Line(arcGeometry, arcMaterial);
            arc.computeLineDistances();
            // First rotate the arc so that it's x-axis points towards the
            // first basis vector that defines the arc
            let yAxis = new THREE.Vector3(0, 1, 0);
            let xAxis = new THREE.Vector3(1, 0, 0);
            let zAxis = new THREE.Vector3(0, 0, 1);
            let quaternion = new THREE.Quaternion().setFromUnitVectors(xAxis, basisVec1.clone().normalize());
            arc.quaternion.copy(quaternion);
            // Then rotate the arc along it's x axis so that the xy-plane
            // coincides with the plane defined by the the two basis vectors
            // that define the plane.
            let lastArcPointLocal = arcGeometry.vertices[arcGeometry.vertices.length - 1];
            arc.updateMatrixWorld(); // The positions are not otherwise updated properly
            let lastArcPointWorld = arc.localToWorld(lastArcPointLocal.clone());
            // The angle direction is defined by the first basis vector
            let axis = basisVec1;
            let arcNormal = new THREE.Vector3()
                .crossVectors(axis, lastArcPointWorld);
            let planeAngle = normal.angleTo(arcNormal);
            let planeCross = new THREE.Vector3()
                .crossVectors(basisVec2, lastArcPointWorld);
            let directionValue = planeCross.dot(axis);
            if (directionValue > 0) {
                planeAngle = -planeAngle;
            }
            arc.rotateX(planeAngle);
            // Add label for the angle
            arc.updateMatrixWorld(); // The positions are not otherwise updated properly
            arc.updateMatrix(); // The positions are not otherwise updated properly
            let angleLabelPos = arc.localToWorld(arcGeometry.vertices[9].clone());
            let angleLabelLen = angleLabelPos.length();
            angleLabelPos.multiplyScalar(1 + 0.3 / angleLabelLen);
            let angleLabelObj = createLabel(angleLabelPos, angleLabel.toString(), angleColor, true, angleFont, angleFontSize);
            this.latticeConstants.add(angleLabelObj);
            this.axisLabels.push(angleLabelObj);
            this.angleArcs.add(arc);
        }
    }
    /**
     * Creates a list of THREE.Vector3s from the given list of arrays.
     *
     * @param vectors - The positions from which to create vectors.
     */
    createBasisVectors(vectors) {
        let result = [];
        for (let len = vectors.length, i = 0; i < len; ++i) {
            let vector = vectors[i];
            let basis_vector = new THREE.Vector3().fromArray(vector);
            result.push(basis_vector);
        }
        return result;
    }
    createVisualizationBoundaryPositions(positions, atomicNumbers) {
        // Determine the maximum and minimum values in all cartesian components
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;
        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxRadii = 0;
        for (let len = positions.length, i = 0; i < len; ++i) {
            let iPos = positions[i];
            let iX = iPos.x;
            if (iX > maxX) {
                maxX = iX;
            }
            if (iX < minX) {
                minX = iX;
            }
            let iY = iPos.y;
            if (iY > maxY) {
                maxY = iY;
            }
            if (iY < minY) {
                minY = iY;
            }
            let iZ = iPos.z;
            if (iZ > maxZ) {
                maxZ = iZ;
            }
            if (iZ < minZ) {
                minZ = iZ;
            }
            // Determine maximum radius that will be added to the visualization boundaries
            let iRadius = this.atomicRadii[atomicNumbers[i]];
            if (iRadius > maxRadii) {
                maxRadii = iRadius;
            }
        }
        // Add max atomic radii to boundaries
        // Push the corners of the cuboid as cornerpoints
        let origin = new THREE.Vector3(minX - maxRadii, minY - maxRadii, minZ - maxRadii);
        let basisX = new THREE.Vector3(maxX - minX + 2 * maxRadii, 0, 0);
        let basisY = new THREE.Vector3(0, maxY - minY + 2 * maxRadii, 0);
        let basisZ = new THREE.Vector3(0, 0, maxZ - minZ + 2 * maxRadii);
        let basis = [basisX, basisY, basisZ];
        // Get cuboid
        let pointGeometry = this.createCornerPoints(origin, basis);
        let points = new THREE.Points(pointGeometry);
        points.visible = false;
        this.cornerPoints = points;
        // Must add the point to root because otherwise they will not be
        // included in the transforms.
        this.container.add(this.cornerPoints);
    }
    createVisualizationBoundaryCell(origin, basis) {
        // Get cuboid
        let pointGeometry = this.createCornerPoints(origin, basis);
        let points = new THREE.Points(pointGeometry);
        points.visible = false;
        this.cornerPoints = points;
        // Must add the point to root because otherwise they will not be
        // included in the transforms.
        this.container.add(this.cornerPoints);
    }
    /**
     * Create the conventional cell
     *
     */
    createConventionalCell(periodicity, visible) {
        let cell = this.createCell(new THREE.Vector3(), this.basisVectors, periodicity, 0x000000, 1.5, false);
        cell.visible = visible;
        this.convCell = cell;
        this.container.add(this.convCell);
    }
    /**
     * Create the primitive cell
     *
     */
    createPrimitiveCell(periodicity, visible) {
        if (this.primitiveVectors != null) {
            let cell = this.createCell(new THREE.Vector3(), this.primitiveVectors, periodicity, 0x000000, 1.5, true);
            cell.visible = visible;
            this.primCell = cell;
            this.container.add(this.primCell);
        }
    }
    /**
     * Creates outlines for a cell specified by the given basis vectors.
     * @param origin - The origin for the cell
     * @param basisVectors - The cell basis vectors
     * @param periodicity - The periodicity of the cell
     * @param color - Color fo the cell wireframe
     * @param linewidth - Line width fo the wireframe
     * @param dashed - Is wireframe dashed
     */
    createCell(origin, basisVectors, periodicity, color, linewidth, dashed) {
        let cell = new THREE.Object3D();
        let lineMaterial;
        if (dashed) {
            lineMaterial = new THREE.LineDashedMaterial({
                color: color,
                linewidth: linewidth,
                dashSize: 0.1,
                gapSize: 0.1
            });
        }
        else {
            lineMaterial = new THREE.LineBasicMaterial({
                color: color,
                linewidth: linewidth
            });
        }
        let dimMaterial = new THREE.LineDashedMaterial({
            color: "#999999",
            linewidth: linewidth,
            dashSize: 0.1,
            gapSize: 0.1
        });
        // Determine the if one of the cell vectors is a zero vector
        let collapsed = true;
        for (let i = 0; i < 3; ++i) {
            let vec = basisVectors[i];
            let len = vec.length();
            if (len > 1E-3 && !periodicity[i]) {
                collapsed = false;
            }
        }
        for (let len = basisVectors.length, i = 0; i < len; ++i) {
            let basisVector = basisVectors[i].clone();
            // First line
            let line1Mat = lineMaterial.clone();
            let isDim1 = !periodicity[i];
            if (!(isDim1 && collapsed)) {
                if (isDim1) {
                    line1Mat = dimMaterial.clone();
                }
                let lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(origin.clone(), basisVector.clone().add(origin));
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
                if (isDim2) {
                    line2Mat = dimMaterial.clone();
                }
                let line2Geometry = new THREE.Geometry();
                line2Geometry.vertices.push(secondAddition.clone().add(origin), basisVector.clone().add(secondAddition).add(origin));
                let line2 = new THREE.Line(line2Geometry, line2Mat);
                cell.add(line2);
                line2.computeLineDistances();
            }
            // Third line
            let thirdIndex = (i + 2) % len;
            let thirdAddition = basisVectors[thirdIndex].clone();
            let isDim3 = !periodicity[i] || !periodicity[(i + 2) % 3];
            if (!(isDim3 && collapsed)) {
                let line3Mat = lineMaterial.clone();
                if (isDim3) {
                    line3Mat = dimMaterial.clone();
                }
                let line3Geometry = new THREE.Geometry();
                line3Geometry.vertices.push(thirdAddition.clone().add(origin), basisVector.clone().add(thirdAddition).add(origin));
                let line3 = new THREE.Line(line3Geometry, line3Mat);
                cell.add(line3);
                line3.computeLineDistances();
            }
            // Fourth line
            let isDim4 = !periodicity[i] || !periodicity[(i + 2) % 3] || !periodicity[(i + 1) % 3];
            if (!(isDim4 && collapsed)) {
                let line4Mat = lineMaterial.clone();
                if (isDim4) {
                    line4Mat = dimMaterial.clone();
                }
                let line4Geometry = new THREE.Geometry();
                line4Geometry.vertices.push(secondAddition.clone().add(thirdAddition).add(origin), basisVector.clone().add(secondAddition).add(thirdAddition).add(origin));
                let line4 = new THREE.Line(line4Geometry, line4Mat);
                cell.add(line4);
                line4.computeLineDistances();
            }
        }
        return cell;
    }
    /**
     * Setups the initial view so that the scene is centered and rotated
     * slightly to emphasize 3D nature.
     */
    setupInitialView1D(periodicity) {
        // Rotate so that the chosen axis points to top
        this.root.updateMatrixWorld(); // The positions are not otherwise updated properly
        let startAxis;
        for (let iAxis = 0; iAxis < periodicity.length; ++iAxis) {
            let periodic = periodicity[iAxis];
            if (periodic) {
                startAxis = this.basisVectors[iAxis];
            }
        }
        let finalAxis = new THREE.Vector3(1, 0, 0);
        let segmentQ = new THREE.Quaternion().setFromUnitVectors(finalAxis, startAxis.clone().normalize());
        segmentQ.conjugate();
        this.root.quaternion.premultiply(segmentQ);
        this.sceneInfo.quaternion.premultiply(segmentQ);
        // Get the camera up and right directions in world space
        let cameraUp = new THREE.Vector3(0, 1, 0);
        let cameraRight = new THREE.Vector3(1, 0, 0);
        cameraRight.applyQuaternion(this.camera.quaternion);
        cameraUp.applyQuaternion(this.camera.quaternion);
        // Rotate around the camera up-axis
        let upAngle = Math.PI / 4;
        this.rotateAroundWorldAxis(this.root, cameraUp, upAngle);
        this.rotateAroundWorldAxis(this.sceneInfo, cameraUp, upAngle);
        // Rotate around the camera right-axis
        let rightAngle = Math.PI / 9;
        this.rotateAroundWorldAxis(this.root, cameraRight, rightAngle);
        this.rotateAroundWorldAxis(this.sceneInfo, cameraRight, rightAngle);
    }
    /**
     * Setups the initial view so that the scene is centered and rotated
     * slightly to emphasize 3D nature.
     */
    setupInitialView2D(periodicity, periodicIndices) {
        let a = this.basisVectors[periodicIndices[0]].clone();
        let c = new THREE.Vector3(1, 1, 1);
        for (let i = 0; i < periodicIndices.length; ++i) {
            let periodic = periodicIndices[i];
            c.setComponent(periodic, 0);
        }
        // Rotate so that the chosen axis points to top
        this.root.updateMatrixWorld(); // The positions are not otherwise updated properly
        let finalAxis = new THREE.Vector3(0, 0, 1);
        let segmentQ = new THREE.Quaternion().setFromUnitVectors(c.clone().normalize(), finalAxis);
        this.root.quaternion.premultiply(segmentQ);
        this.sceneInfo.quaternion.premultiply(segmentQ);
        a = a.clone().applyQuaternion(segmentQ);
        c = c.clone().applyQuaternion(segmentQ);
        // Rotate so that a points to the right
        finalAxis = new THREE.Vector3(1, 0, 0);
        segmentQ = new THREE.Quaternion().setFromUnitVectors(a.clone().normalize(), finalAxis);
        this.root.quaternion.premultiply(segmentQ);
        this.sceneInfo.quaternion.premultiply(segmentQ);
        // The positions are not otherwise updated properly
        this.root.updateMatrixWorld();
        this.sceneInfo.updateMatrixWorld();
        // Tilt the system slightly
        let cameraRight = new THREE.Vector3(1, 0, 0);
        cameraRight.applyQuaternion(this.camera.quaternion);
        let rightAngle = -Math.PI / 6;
        this.rotateAroundWorldAxis(this.root, cameraRight, rightAngle);
        this.rotateAroundWorldAxis(this.sceneInfo, cameraRight, rightAngle);
    }
    /**
     * @param rotations The rotations as a list. Each rotation should be an
     * array containing four numbers: [x, y, z, angle]. The rotations are
     * applied in the given order.
     */
    setViewRotation(rotation) {
        for (let r of rotation) {
            let basisC = new THREE.Vector3(rotation[0], rotation[1], rotation[2]);
            basisC.normalize();
            let angleC = -rotation[4] / 180 * Math.PI;
            this.rotateAroundWorldAxis(this.root, basisC, angleC);
            this.rotateAroundWorldAxis(this.sceneInfo, basisC, angleC);
        }
    }
    alignView(top = 2, right = 1, back = 0) {
        let a = this.basisVectors[back];
        let b = this.basisVectors[right];
        let c = this.basisVectors[top];
        // Rotate so that the c-axis points to top
        this.root.updateMatrixWorld(); // The positions are not otherwise updated properly
        let finalCAxis = new THREE.Vector3(0, 1, 0);
        let cQuaternion = new THREE.Quaternion().setFromUnitVectors(c.clone().normalize(), finalCAxis);
        this.root.quaternion.premultiply(cQuaternion);
        this.sceneInfo.quaternion.premultiply(cQuaternion);
        this.root.updateMatrixWorld();
        this.sceneInfo.updateMatrixWorld();
        b = b.clone().applyQuaternion(cQuaternion);
        c = c.clone().applyQuaternion(cQuaternion);
        // Rotate so that c x b points to the right
        let currentAAxis = new THREE.Vector3().crossVectors(b, c);
        let finalAAxis = new THREE.Vector3(0, 0, 1);
        let aQuaternion = new THREE.Quaternion().setFromUnitVectors(currentAAxis.clone().normalize(), finalAAxis);
        this.root.quaternion.premultiply(aQuaternion);
        this.sceneInfo.quaternion.premultiply(aQuaternion);
        this.root.updateMatrixWorld();
        this.sceneInfo.updateMatrixWorld();
        b = b.clone().applyQuaternion(aQuaternion);
        c = c.clone().applyQuaternion(aQuaternion);
        let cameraVector = new THREE.Vector3(0, 0, -1);
        cameraVector.applyQuaternion(this.camera.quaternion);
        this.render();
    }
    /**
     * Setups the initial view so that the scene is centered and rotated
     * slightly to emphasize 3D nature.
     */
    setupInitialView3D() {
        let a = this.basisVectors[0];
        let b = this.basisVectors[1];
        let c = this.basisVectors[2];
        // Rotate so that the c-axis points to top
        this.root.updateMatrixWorld(); // The positions are not otherwise updated properly
        let finalCAxis = new THREE.Vector3(0, 1, 0);
        let cQuaternion = new THREE.Quaternion().setFromUnitVectors(c.clone().normalize(), finalCAxis);
        this.root.quaternion.premultiply(cQuaternion);
        this.sceneInfo.quaternion.premultiply(cQuaternion);
        this.root.updateMatrixWorld();
        this.sceneInfo.updateMatrixWorld();
        b = b.clone().applyQuaternion(cQuaternion);
        c = c.clone().applyQuaternion(cQuaternion);
        // Rotate so that c x b points to the right
        let currentAAxis = new THREE.Vector3().crossVectors(b, c);
        let finalAAxis = new THREE.Vector3(0, 0, 1);
        let aQuaternion = new THREE.Quaternion().setFromUnitVectors(currentAAxis.clone().normalize(), finalAAxis);
        this.root.quaternion.premultiply(aQuaternion);
        this.sceneInfo.quaternion.premultiply(aQuaternion);
        this.root.updateMatrixWorld();
        this.sceneInfo.updateMatrixWorld();
        b = b.clone().applyQuaternion(aQuaternion);
        c = c.clone().applyQuaternion(aQuaternion);
        let cameraVector = new THREE.Vector3(0, 0, -1);
        cameraVector.applyQuaternion(this.camera.quaternion);
        // Rotate around the c-axis
        let tiltAxis2 = new THREE.Vector3().crossVectors(cameraVector, b);
        tiltAxis2.normalize();
        let tiltAngle2 = -Math.PI / 3;
        //let tiltAngle2 = -Math.PI/6;
        this.rotateAroundWorldAxis(this.root, tiltAxis2, tiltAngle2);
        this.rotateAroundWorldAxis(this.sceneInfo, tiltAxis2, tiltAngle2);
        // Rotate around the axis defined by the cross-product of the
        // cameraVector and basis vector c
        let tiltAxis = new THREE.Vector3().crossVectors(cameraVector, c);
        tiltAxis.normalize();
        let tiltAngle = Math.PI / 6;
        //let tiltAngle = Math.PI/12;
        this.rotateAroundWorldAxis(this.root, tiltAxis, tiltAngle);
        this.rotateAroundWorldAxis(this.sceneInfo, tiltAxis, tiltAngle);
    }
    /**
     * Used to add periodic repetitions of atoms.
     */
    repeat(multipliers, relPos, labels) {
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
                        for (let l = 0; l < relPos.length; ++l) {
                            let iPos = new THREE.Vector3().copy(relPos[l]);
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
        relPos.push.apply(newPos);
        labels.push.apply(newLabels);
    }
    /**
     * Wraps all atoms to be within the unit cell.
     */
    wrap(relPos, pbc) {
        for (let len = relPos.length, i = 0; i < len; ++i) {
            let iRelPos = relPos[i];
            // Wrap the positions
            let x = iRelPos.x;
            let y = iRelPos.y;
            let z = iRelPos.z;
            if (pbc[0] && this.almostEqual(1, x, this.basisVectors[0], this.options.layout.wrapTolerance)) {
                x -= 1;
            }
            if (pbc[1] && this.almostEqual(1, y, this.basisVectors[1], this.options.layout.wrapTolerance)) {
                y -= 1;
            }
            if (pbc[2] && this.almostEqual(1, z, this.basisVectors[2], this.options.layout.wrapTolerance)) {
                z -= 1;
            }
        }
    }
    /**
     * Used to add periodic repetitions of atoms at the unit cell boundary.
     */
    addBoundaryAtoms(relPos, labels) {
        for (let len = relPos.length, i = 0; i < len; ++i) {
            let iRelPos = relPos[i];
            let atomicNumber = labels[i];
            // If the atom sits on the cell surface, add the periodic images if
            // requested.
            let x = iRelPos.x;
            let y = iRelPos.y;
            let z = iRelPos.z;
            let xZero = this.almostEqual(0, x, this.basisVectors[0], this.options.layout.wrapTolerance);
            let yZero = this.almostEqual(0, y, this.basisVectors[1], this.options.layout.wrapTolerance);
            let zZero = this.almostEqual(0, z, this.basisVectors[2], this.options.layout.wrapTolerance);
            if (xZero && yZero && zZero) {
                relPos.push(new THREE.Vector3(1, 0, 0).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(0, 1, 0).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(0, 0, 1).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(1, 1, 0).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(0, 1, 1).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(1, 0, 1).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(1, 1, 1).add(iRelPos));
                labels.push(atomicNumber);
            }
            else if (xZero && yZero && !zZero) {
                relPos.push(new THREE.Vector3(1, 0, 0).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(0, 1, 0).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(1, 1, 0).add(iRelPos));
                labels.push(atomicNumber);
            }
            else if (!xZero && yZero && zZero) {
                relPos.push(new THREE.Vector3(0, 1, 0).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(0, 0, 1).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(0, 1, 1).add(iRelPos));
                labels.push(atomicNumber);
            }
            else if (xZero && !yZero && zZero) {
                relPos.push(new THREE.Vector3(1, 0, 0).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(0, 0, 1).add(iRelPos));
                labels.push(atomicNumber);
                relPos.push(new THREE.Vector3(1, 0, 1).add(iRelPos));
                labels.push(atomicNumber);
            }
            else if (xZero && !yZero && !zZero) {
                relPos.push(new THREE.Vector3(1, 0, 0).add(iRelPos));
                labels.push(atomicNumber);
            }
            else if (!xZero && yZero && !zZero) {
                relPos.push(new THREE.Vector3(0, 1, 0).add(iRelPos));
                labels.push(atomicNumber);
            }
            else if (!xZero && !yZero && zZero) {
                relPos.push(new THREE.Vector3(0, 0, 1).add(iRelPos));
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
    createAtoms(relPos, labels, pbc) {
        // Delete old atoms
        this.atoms.remove(...this.atoms.children);
        this.elements = {};
        this.atomPos = [];
        this.atomNumbers = [];
        this.atomFills = [];
        this.atomOutlines = [];
        // Prepare variables
        let basis1 = this.basisVectors[0];
        let basis2 = this.basisVectors[1];
        let basis3 = this.basisVectors[2];
        let meshMap = {};
        // Determine the periodicity handling
        if (pbc.some(a => { return a === true; })) {
            let periodicity = this.options.layout.periodicity;
            if (periodicity === "none") {
            }
            else if (periodicity === "wrap") {
                this.wrap(relPos, pbc);
            }
            else if (periodicity === "boundary") {
                this.addBoundaryAtoms(relPos, labels);
            }
            else if (Array.isArray(periodicity)) {
                this.repeat(periodicity, relPos, labels);
            }
        }
        // Create the 3D atoms at the correct positions
        for (let len = relPos.length, i = 0; i < len; ++i) {
            let iRelPos = relPos[i];
            // Add the primary atom
            let atomicNumber = labels[i];
            this.addAtom(i, iRelPos, atomicNumber, meshMap);
            // Gather element legend data
            let elementName = this.elementNames[atomicNumber - 1];
            this.elements[elementName] = [this.elementColors[atomicNumber], this.atomicRadii[atomicNumber]];
        }
    }
    /**
     * Creates bonds between the atoms based on radii and distance.
     *
     * @param bonds - A Nx2 list of atom indices specifying the bonded atoms. Alternatively
     *                you can use "auto" to automatically create the bonds.
     */
    createBonds(bonds = "auto") {
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
        // Manual bonds
        if (Array.isArray(bonds)) {
            for (let bond of bonds) {
                let i = bond[0];
                let j = bond[1];
                let pos1 = this.atomPos[i];
                let pos2 = this.atomPos[j];
                this.addBond(i, j, pos1, pos2);
            }
            // Automatically detect bonds
        }
        else if (bonds === "auto") {
            let nAtoms = this.atomPos.length;
            for (let i = 0; i < nAtoms; ++i) {
                for (let j = 0; j < nAtoms; ++j) {
                    if (j > i) {
                        let pos1 = this.atomPos[i];
                        let pos2 = this.atomPos[j];
                        let num1 = this.atomNumbers[i];
                        let num2 = this.atomNumbers[j];
                        let distance = pos2.clone().sub(pos1).length();
                        let radii1 = this.options.atoms.scale * this.atomicRadii[num1];
                        let radii2 = this.options.atoms.scale * this.atomicRadii[num2];
                        if (distance <= this.options.bonds.threshold * 1.1 * (radii1 + radii2)) {
                            this.addBond(i, j, pos1, pos2);
                        }
                    }
                }
            }
        }
        this.updateBonds = false;
    }
    /**
     * Used to check if the given relative position component is almost the
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
     * @param relative - Are the coordinates relatice to the cell basis vectors
     */
    addBond(i, j, pos1, pos2) {
        // Bond
        let radius = this.options.bonds.radius;
        let targetAngle = this.options.bonds.smoothness;
        let nSegments = Math.ceil(360 / (180 - targetAngle));
        let bondMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: this.options.bonds.material.shininess });
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
     * @param relative - Are the coordinates relatice to the cell basis vectors
     */
    addAtom(index, position, atomicNumber, mesh, relative = true) {
        let exists = atomicNumber in mesh;
        if (!exists) {
            mesh[atomicNumber] = {};
            // Calculate the amount of segments that are needed to reach a
            // certain angle for the ball surface segments
            let radius = this.options.atoms.scale * this.atomicRadii[atomicNumber];
            let targetAngle = this.options.atoms.smoothness;
            let nSegments = Math.ceil(360 / (180 - targetAngle));
            // Atom
            let color = this.elementColors[atomicNumber];
            let atomGeometry = new THREE.SphereGeometry(radius, nSegments, nSegments);
            let atomMaterial = new THREE.MeshPhongMaterial({ color: color, shininess: this.options.atoms.material.shininess });
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
        if (relative) {
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
        atom.position.copy(true_pos);
        atom.name = "fill";
        group.add(atom);
        if (this.options.outline.enabled) {
            console.log("OUTLINE");
            let outline = imesh["outline"].clone();
            this.atomOutlines.push(outline);
            outline.position.copy(true_pos);
            outline.name = "outline";
            group.add(outline);
        }
        this.atoms.add(group);
        this.atomFills.push(atom);
        this.atomPos.push(true_pos);
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
     * Setup the view for 0D systems (atoms, molecules).
     */
    setup0D(relPos, cartPos, labels) {
        let pbc = [false, false, false];
        this.createConventionalCell(pbc, this.options.cell.enabled);
        this.createPrimitiveCell(pbc, this.options.cell.enabled);
        this.createAtoms(relPos, labels, pbc);
        this.createLatticeConstants(this.basisVectors, pbc, []);
        this.setupInitialView3D();
    }
    /**
     * Replicates the structure along the specified direction to emphasize the
     * 1D nature of the material.
     *
     * @param dim - The index of the periodic dimension.
     */
    setup1D(relPos, cartPos, labels, pbc, periodicIndices) {
        // Duplicate the cell in the periodic dimensions. The number of
        // duplications is determined so that a certain size is achieved.
        let dim = periodicIndices[0];
        let translation1 = this.basisVectors[dim].clone();
        let multiplier = this.getRepetitions(translation1, 15);
        let multipliers = [1, 1, 1];
        multipliers[dim] = multiplier;
        this.options.layout.periodicity = multipliers;
        if (this.options.cell.enabled) {
            this.createConventionalCell(pbc, this.options.cell.enabled);
            this.createPrimitiveCell(pbc, this.options.cell.enabled);
        }
        this.createAtoms(relPos, labels, pbc);
        this.createLatticeConstants(this.basisVectors, pbc, periodicIndices);
        this.setupInitialView1D(pbc);
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
    /**
     * Replicates the structure along the specified direction to emphasize the
     * 2D nature of the material.
     *
     * @param periodicIndices - The indices of the periodic dimension.
     */
    setup2D(relPos, cartPos, labels, pbc, periodicIndices) {
        // Duplicate the cell in the periodic dimensions. The number of
        // duplications is determined so that a certain size is achieved.
        let dim1 = periodicIndices[0];
        let dim2 = periodicIndices[1];
        let translation1 = this.basisVectors[dim1].clone();
        let translation2 = this.basisVectors[dim2].clone();
        let width = 0;
        let height = 0;
        if (this.options.layout.allowRepeat) {
            width = this.getRepetitions(translation1, 12);
            height = this.getRepetitions(translation2, 12);
        }
        let multipliers = [1, 1, 1];
        multipliers[dim1] = width;
        multipliers[dim2] = height;
        this.options.layout.periodicity = multipliers;
        this.createConventionalCell(pbc, this.options.cell.enabled);
        this.createPrimitiveCell(pbc, this.options.cell.enabled);
        this.createAtoms(relPos, labels, pbc);
        this.createLatticeConstants(this.basisVectors, pbc, periodicIndices);
        this.setupInitialView2D(pbc, periodicIndices);
    }
    /**
     * Setup the view for 3D systems (crystals)
     */
    setup3D(relPos, cartPos, labels) {
        let pbc = [true, true, true];
        this.createConventionalCell(pbc, this.options.cell.enabled);
        this.createPrimitiveCell(pbc, this.options.cell.enabled);
        this.createAtoms(relPos, labels, pbc);
        this.createLatticeConstants(this.basisVectors, pbc, [0, 1, 2]);
        this.setupInitialView3D();
    }
}
