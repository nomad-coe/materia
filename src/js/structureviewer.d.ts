import { Viewer } from "./viewer";
import * as THREE from "three";
/**
 * Class for visualizing an atomic structure.
 */
export declare class StructureViewer extends Viewer {
    structure: unknown;
    atomPos: number[][];
    positions: number[][];
    atomicNumbers: number[];
    atomNumbers: number[];
    B: THREE.Matrix3;
    Bi: THREE.Matrix3;
    basisVectors: THREE.Vector3[];
    basisVectorCollapsed: boolean[];
    updateBonds: boolean;
    maxRadii: number;
    atomicRadii: Array<number>;
    elementColors: Array<string>;
    root: THREE.Object3D;
    atoms: THREE.Object3D;
    convCell: THREE.Object3D;
    primCell: THREE.Object3D;
    bonds: THREE.Object3D;
    latticeConstants: any;
    container: any;
    infoContainer: any;
    elements: Object;
    sceneStructure: any;
    sceneInfo: any;
    lights: Array<any>;
    bondFills: Array<any>;
    atomFills: Array<any>;
    atomOutlines: Array<any>;
    angleArcs: any;
    axisLabels: Array<any>;
    setupScenes(): void;
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
     * @param {boolean} options.bonds.outline.enabled Used to enable or disable a
     *   fixed color outline around the bond. Notice that enabling the
     *   outline incurs a performance penalty.
     * @param {string} options.bonds.outline.color Outline color.
     * @param {number} options.bonds.outline.size Outline size.
     *
     * @param {object || list} options.atoms Object, or array of objects
     * containing options for atom visualization. If an array is given, the
     * options are added sequentially in order. See below for the subparameters.
     * @param {number} options.atoms.smoothness A value between 0-180 that
     *   controls the number of polygons. Used as the angle between adjacent
     *   cylinder/sphere sectors that indirectly controls the number of
     *   polygons.
     * @param {number} options.atoms.opacity The opacity of the atom
     * @param {number} options.atoms.material.phong.shininess Shininess of the
     * atom material (for phong material)
     * @param {number} options.atoms.material.toon.tones Tone-steps for toon
     * material
     * @param {string|number[]} options.atoms.radii The radius to use for the
     * atom.  Defaults to covalent radii. Available options are:
     *
     *   - "covalent": Covalent radius from DOI:10.1039/B801115J.
     *   - Radius in angstrom.
     *
     * @param {string|string[]} options.atoms.color The color to use. Available
     * options are:
     *
     *   - "Jmol" (default): Jmol color.
     *   - Hexadecimal color, e.g. '#ffffff'
     *
     * @param {number} options.atoms.scale Scaling factor for the atomic radii.
     * Used to scale the given radius.
     * @param {boolean} options.atoms.outline.enabled Used to enable or disable a
     *   fixed color outline around the atom. Notice that enabling the
     *   outline incurs a performance penalty.
     * @param {string} options.atoms.outline.color Outline color.
     * @param {number} options.atoms.outline.size Outline size.
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
    setOptions(options: any, render?: boolean): void;
    /**
     * Used to determine if a full realod of the structure is needed given the
     * updated options.
     * @param {*} options The updated options.
     */
    needFullReload(options: any): boolean;
    /**
     * Returns the currently set options.
     * @returns {Object} The current options.
     */
    getOptions(): any;
    /**
     * Returns information about the elements included in the structure.
     * @returns {Object} The current options.
     */
    getElementInfo(): Object;
    /**
     * Hides or shows the lattice parameter labels.
     */
    toggleLatticeConstants(value: boolean): void;
    /**
     * Hides or shows the cell.
     */
    toggleCell(value: boolean): void;
    /**
     * Hides or shows the bonds.
     */
    toggleBonds(value: boolean): void;
    /**
     * Hides or shows the shadows.
     */
    toggleShadows(value: boolean): void;
    clear(): void;
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
    load(structure: any): boolean;
    /**
     * Calculates the center of points.
     */
    calculateCOP(positions: Array<THREE.Vector3>): THREE.Vector3;
    /**
     * Centers the visualization around a specific point.
     * @param centerPos - The center position as a cartesian vector.
     */
    centerView(position: THREE.Vector3, render?: boolean): void;
    /**
     * This will automatically fit the given atoms to the rendering area with
     * the given margin.
     */
    fitViewToAtoms(indices: Array<number>, margin?: number, render?: boolean): void;
    /**
     * Translate the atoms.
     *
     * @param translation - Cartesian translation to apply.
     */
    translate(translation: number[], render?: boolean): void;
    /**
     * Set the position for atoms in the currently loaded structure.
     */
    setPositions(positions: number[][], fractional?: boolean, render?: boolean): void;
    /**
     * Gets the positions for atoms in the currently loaded structure.
     */
    getPositions(fractional?: boolean): any[];
    toVectors(positions: number[][], copy?: boolean): THREE.Vector3[];
    toCartesian(positions: THREE.Vector3[], copy?: boolean): THREE.Vector3[];
    toScaled(positions: THREE.Vector3[], copy?: boolean): THREE.Vector3[];
    /**
     * Get a specific atom as defined by a js Group.
     *
     * @param index - Index of the atom.
     * @return THREE.js Group containing the visuals for the atom. The position
     * of the atom is determined by the position of the group.
     */
    getAtom(index: number): any;
    /**
     * Set the zoom level
     *
     * @param zoomLevel - The zoom level as a scalar.
     */
    setZoom(zoomLevel: number): void;
    setupLights(): void;
    /**
     * Create the visuals to show the lattice parameter labels.
     */
    createLatticeConstants(basis: any, periodicity: any, periodicIndices: any): void;
    /**
     * Creates a list of THREE.Vector3s from the given list of arrays.
     *
     * @param vectors - The positions from which to create vectors.
     */
    createBasisVectors(basis: number[][]): void;
    getCornerPoints(): {
        points: any[];
        margin: number;
    };
    /**
     * Returns the atomic radii for the given atomic number.
     *
     * @param atomicNumber - The atomic number for which radii is requested.
     */
    getRadii(atomicNumber: number): number;
    /**
     * Returns the color for the given atomic number.
     *
     * @param atomicNumber - The atomic number for which color is requested.
     */
    getColor(config: any, atomicNumber: number): string;
    /**
     * Create the conventional cell
     *
     */
    createConventionalCell(periodicity: boolean[], visible: boolean): void;
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
    createCell(origin: any, basisVectors: any, basisVectorCollapsed: any, periodicity: any, color: any, linewidth: number, dashSize: number, gapSize: number): any;
    /**
     * @param rotations The rotations as a list. Each rotation should be an
     * array containing four numbers: [x, y, z, angle]. The rotations are
     * applied in the given order.
     */
    rotateView(rotations: number[], render?: boolean): void;
    alignView(alignments: string[][], render?: boolean): void;
    /**
     * Used to add periodic repetitions of atoms.
     */
    repeat(multipliers: Array<number>, fracPos: any, labels: any): void;
    /**
     * Wraps all atoms to be within the unit cell.
     */
    wrap(positions: any, fractional?: boolean): void;
    /**
     * Used to add periodic repetitions of atoms at the unit cell boundary.
     */
    addBoundaryAtoms(fracPos: any, labels: any): void;
    /**
     * Creates representation for all the given atoms.
     *
     * @param positions - Positions of the atoms
     * @param labels - The element numbers for the atoms
     */
    createAtoms(positions: any, labels: any, pbc: Array<boolean>, fractional?: boolean): void;
    /**
     * Creates/updates representation for the atoms based on the given list of
     * configs.
     *
     * @param configs - Array of styling configurations to apply.
     */
    setAtoms(configs: any): void;
    /**
     * Creates bonds between the atoms based on radii and distance.
     *
     * @param bonds - A Nx2 list of atom indices specifying the bonded atoms. Alternatively
     *                you can use "auto" to automatically create the bonds.
     */
    createBonds(bonds?: string): void;
    /**
     * Used to check if the given fractional position component is almost the
     * given target value with a tolerance given in cartesian corodinates.
     */
    almostEqual(target: number, coordinate: number, basisVector: any, tolerance: number): boolean;
    /**
     * Creates atom to the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     */
    addBond(i: number, j: number, pos1: THREE.Vector3, pos2: THREE.Vector3, bondMaterial: any): void;
    /**
     * Creates atoms and directly adds them to the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     */
    updateAtom(index: number, mesh: any, config: any, configHash: any): void;
    createAtomGeometry(config: any, atomicNumber: any): any;
    createAtomMaterial(config: any, atomicNumber: any): any;
    createAtomOutlineGeometry(config: any, atomicNumber: any): any;
    createAtomOutlineMaterial(config: any): any;
    render(): void;
    /**
     * Used to get a number of repetitions that are needed for the given
     * latticevector to reach the target size.
     *
     * @param latticeVector - The vector that is to be extended.
     * @param targetSize - The targeted size.
     */
    getRepetitions(latticeVector: any, targetSize: any): number;
    label_missing: string;
    elementNames: string[];
    elementNumbers: object;
    radii_unknown: number;
    covalentRadii: number[];
    color_unknown: string;
    jmolColors: string[];
}
