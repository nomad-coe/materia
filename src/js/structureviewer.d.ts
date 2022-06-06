import { Viewer } from "./viewer";
import * as THREE from "three";
/**
 * Class for visualizing an atomic structure.
 */
export declare class StructureViewer extends Viewer {
    structure: unknown;
    atomPos: number[][];
    positions: THREE.Vector3[];
    atomicNumbers: number[];
    atomNumbers: number[];
    B: THREE.Matrix3;
    Bi: THREE.Matrix3;
    basisVectors: THREE.Vector3[];
    basisVectorCollapsed: boolean[];
    maxRadii: number;
    atomicRadii: Array<number>;
    elementColors: Array<string>;
    translation: THREE.Vector3;
    meshMap: any;
    atomConfigMap: any;
    configMap: any;
    root: THREE.Object3D;
    atomsObject: THREE.Object3D;
    convCell: THREE.Object3D;
    primCell: THREE.Object3D;
    bondsObject: THREE.Object3D;
    latticeConstantsGroup: any;
    container: any;
    infoContainer: any;
    elements: any;
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
     * Returns information about the elements included in the structure.
     * @returns {Object} The current options.
     */
    getElementInfo(): any;
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
     * @param {(string|number[])} structure.wrap How atomic positions are
     * wrapped in periodic systems. Available options are:
     *    - "none": Visualized as is.
     *    - "wrap": Positions wrapped within unit cell.
     *    - "boundary": Positions that are on the cell boundaries are repeated.
     *    - [a, b, c]: Positions are repeated along each lattice vector the
     *      given amount of times.
     */
    load(structure: any): boolean;
    /**
     * Calculates the center of points.
     */
    calculateCOP(positions: Array<THREE.Vector3>): THREE.Vector3;
    /**
     * Centers the visualization around a specific point.
     * @param position - The position to center on. Can be one of:
     *   - 'COP': Center of all atom positions.
     *   - 'COC': Center of the cell.
     *   - Array<Number>: An array of atomic indices, the COP will be used.
     *   - Array<Array<Number>>: An array of positions, the COP will be used.
     */
    center(positions: any): void;
    /**
     * Centers the visualization around a specific point.
     * @param position - The position to center on. Can be one of:
     *   - 'full': Fit the full view
     *   - Array<Number>: An array of atomic indices, the COP will be used.
     *   - Array<Array<Number>>: An array of positions, the COP will be used.
     */
    fit(positions: any, margin?: number): void;
    /**
     * Translate the atoms.
     *
     * @param translation - Cartesian translation to apply.
     */
    translate(translation: number[]): void;
    /**
     * Rotates the structure.
     *
     * @param {number[][]} rotations The rotations as a list. Each rotation
     * should be an array containing four numbers: [x, y, z, angle]. The
     * rotations are given as a list of 4-element arrays containing the
     * rotations axis and rotation angle in degrees. E.g. [[1, 0, 0, 90]] would
     * apply a 90 degree rotation with respect to the x-coordinate. If multiple
     * rotations are specified, they will be applied in the given order. Notice
     * that these rotations are applied with respect to a global coordinate
     * system, not the coordinate system of the structure. In this global
     * coordinate system [1, 0, 0] points to the right, [0, 1, 0] points upwards
     * and [0, 0, 1] points away from the screen. The rotations are applied in
     * the given order.
     */
    rotate(rotations: number[]): void;
    /**
     * Used to rotate the structure based of the alignment of the basis cell
     * vectors with respect to the cartesian axes.
     *
     * @param alignments List of  up to two alignments for any two axis vectors.
     * E.g. [["up", "c"], ["right", "b"]] will force the third basis vector to
     * point exactly up, and the second basis vector to as close to right as
     * possible. The alignments are applied in the given order.
     */
    align(alignments: string[][]): void;
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
    atoms(options: any): void;
    /**
     * Creates/updates bond representation based on the given config.
     *
     * @param {boolean} options A Javascript object containing the options. See
     *   below for the subparameters.
     * @param {boolean} options.enabled Show bonds.
     * @param {any} options.include The atom indices to take into account when
     *   creating bonds. Either provide a array or leave undefined to include all.
     * @param {string} options.color Color of bonds.
     * @param {number} options.radius Bond radius.
     * @param {number} options.smoothness A value between 0-180 that
     *   controls the number of polygons. Used as the angle between adjacent
     *   cylinder/sphere sectors that indirectly controls the number of
     *   polygons.
     * @param {number} options.material.phong.shininess Shininess of the
     * bond material (for phong material)
     * @param {number} options.material.toon.tones Tone-steps for toon
     * material.
     * @param {number} options.threshold Controls the automatic
     *   detection of bonds between atoms. If custom bonds have not been
     *   specified for the structure, bonds will be detected automatically with
     *   the following criteria: distance <=
     *   this.options.bonds.threshold * 1.1 * (radius1 + radius2)
     * @param {boolean} options.outline.enabled Used to enable or disable a
     *   fixed color outline around the bond. Notice that enabling the
     *   outline incurs a performance penalty.
     * @param {string} options.outline.color Outline color.
     * @param {number} options.outline.size Outline size.
     */
    bonds(options: any): void;
    /**
     * Returns the color for the given atomic number.
     * @param {boolean} options.enabled Show unit cell wireframe.
     * @param {boolean} options.color Unit cell wireframe color.
     * @param {boolean} options.linewidth Unit cell wireframe line width.
     * @param {boolean} options.dashSize Unit cell wireframe dash size.
     * Provide a value > 0 for a dashed line.
     * @param {boolean} options.gapSize Unit cell wireframe dash size.
     * Provide a value > 0 for a dashed line.
     * @param {boolean} options.periodicity Periodicity of the cell. The
     * non-periodic directions will be flattened.
     *
     */
    cell(options: any): void;
    /**
     * Visualizes the lattice constants using the given visualization options.
     *
     * @param {boolean} options.enabled Show lattice parameters
     * @param {boolean} options.periodicity Periodicity of the lattice
     * @param {string} options.font Font size for lattice
     * constants. Applied as default to all labels, can be overridden
     * individually for each lattice constant.
     * @param {string} options.color Font color for lattice
     * constants. Applied as default to all labels, can be overridden
     * individually for each lattice constant.
     * @param {string} options.stroke.color Font stroke color
     * for lattice constants. Applied as default to all labels, can be
     * overridden individually for each lattice constant.
     * @param {string} options.stroke.width Font stroke width
     * for lattice constants. Applied as default to all labels, can be
     * overridden individually for each lattice constant.
     * @param {string} options.a.color Font color
     * @param {string} options.a.font Font family
     * @param {number} options.a.size Font size
     * @param {number} options.a.stroke.width Font stroke width
     * @param {string} options.a.stroke.color Font stroke color
     * @param {string} options.b.color Font color
     * @param {string} options.b.font Font family
     * @param {number} options.b.size Font size
     * @param {number} options.b.stroke.width Font stroke width
     * @param {string} options.b.stroke.color Font stroke color
     * @param {string} options.c.color Font color
     * @param {string} options.c.font Font family
     * @param {number} options.c.size Font size
     * @param {number} options.c.stroke.width Font stroke width
     * @param {string} options.c.stroke.color Font stroke color
     * @param {string} options.alpha.color Font color
     * @param {string} options.alpha.font Font family
     * @param {number} options.alpha.size Font size
     * @param {number} options.alpha.stroke.width Font stroke width
     * @param {string} options.alpha.stroke.color Font stroke color
     * @param {string} options.beta.color Font color
     * @param {string} options.beta.font Font family
     * @param {number} options.beta.size Font size
     * @param {number} options.beta.stroke.width Font stroke width
     * @param {string} options.beta.stroke.color Font stroke color
     * @param {string} options.gamma.color Font color
     * @param {string} options.gamma.font Font family
     * @param {number} options.gamma.size Font size
     * @param {number} options.gamma.stroke.width Font stroke width
     * @param {string} options.gamma.stroke.color Font stroke color
     *
     */
    latticeConstants(options: any): void;
    /**
     * Set the position for atoms in the currently loaded structure.
     */
    setPositions(positions: number[][], fractional?: boolean): void;
    /**
     * Gets the positions for atoms in the currently loaded structure.
     */
    getPositions(fractional?: boolean): Array<THREE.Vector3>;
    /**
     * Get the positions of atoms in the global coordinate system.
     */
    getPositionsGlobal(): Array<THREE.Vector3>;
    /**
     * Converts a list of list of numbers into vectors.
     *
     * @param positions
     * @returns {THREE.Vector3[]} The positions as an array of THREE.Vector3.
     */
    toVectors(positions: number[][]): THREE.Vector3[];
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
    setupLights(): void;
    /**
     * Creates a list of THREE.Vector3s from the given list of arrays.
     *
     * @param vectors - The positions from which to create vectors.
     */
    createBasisVectors(basis: number[][]): void;
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
    createAtoms(positions: any, labels: any, pbc: Array<boolean>, fractional?: boolean, wrap?: string): void;
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
    addBond(i: number, j: number, pos1: THREE.Vector3, pos2: THREE.Vector3, bondMaterial: any, options: any): void;
    /**
     * Creates atoms and directly adds them to the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     */
    updateAtom(index: number, config: any, configHash: string): void;
    createAtomGeometry(config: any, atomicNumber: number): THREE.SphereGeometry;
    createAtomMaterial(config: any, atomicNumber: number): THREE.Material;
    createAtomOutlineGeometry(config: any, atomicNumber: number): THREE.SphereGeometry;
    createAtomOutlineMaterial(config: any): THREE.Material;
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
    elementNumbers: any;
    radii_unknown: number;
    covalentRadii: number[];
    color_unknown: string;
    jmolColors: string[];
}
