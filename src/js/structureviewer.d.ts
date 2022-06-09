import { Viewer } from "./viewer";
import * as THREE from "three";
/**
 * Class for visualizing an atomic structure.
 */
export declare class StructureViewer extends Viewer {
    hostElement: any;
    structure: unknown;
    atomPos: number[][];
    positions: THREE.Vector3[];
    positionsOriginal: THREE.Vector3[];
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
    info: THREE.Object3D;
    elements: any;
    sceneInfo: THREE.Scene;
    sceneStructure: THREE.Scene;
    lights: Array<any>;
    bondFills: Array<any>;
    atomFills: Array<any>;
    atomOutlines: Array<any>;
    angleArcs: any;
    axisLabels: Array<any>;
    atomDefaults: any;
    bondDefaults: any;
    cellDefaults: any;
    latticeConstantDefaults: any;
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
    constructor(hostElement: any, options?: any);
    /**
     * Saves the default options.
    */
    setOptions(options: any): void;
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
    fit(positions: any, margin?: number): void;
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
    bonds(options: any): void;
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
    cell(options: any): void;
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
    latticeConstants(options: any): void;
    /**
     * Gets the local positions of the atoms.
     */
    getPositionsLocal(): Array<THREE.Vector3>;
    /**
     * Get the positions of atoms in the global coordinate system.
     */
    getPositionsGlobal(): Array<THREE.Vector3>;
    /**
     * Get the positions of the center of cell in the global coordinate system.
     */
    getCOCGlobal(): Array<THREE.Vector3>;
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
     * Controls the wrapping of atoms. Notice that only cell directions with
     * periodic boundaries will be wrapped.
     *
     * @param {boolean} wrap - Whether to wrap or not.
     */
    wrap(wrap?: boolean): void;
    /**
     * Set the position for atoms in the currently loaded structure.
     */
    setPositions(positions: THREE.Vector3[], fractional?: boolean): void;
    /**
     * Used to add periodic repetitions of atoms at the unit cell boundary.
     */
    addBoundaryAtoms(fracPos: any, labels: any, tolerance: any): void;
    /**
     * Creates representation for all the given atoms.
     *
     * @param positions - Positions of the atoms
     * @param labels - The element numbers for the atoms
     */
    createAtoms(positions: any, labels: any, pbc: Array<boolean>, fractional: boolean, wrap: any): void;
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
