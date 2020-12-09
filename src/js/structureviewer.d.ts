import { Viewer } from "./viewer";
import * as THREE from "three";
/**
 * Class for visualizing an atomic structure.
 */
export declare class StructureViewer extends Viewer {
    structure: Object;
    atomPos: any[];
    atomNumbers: any[];
    B: THREE.Matrix3;
    Bi: THREE.Matrix3;
    basisVectors: THREE.Vector3[];
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
     * @param {string} options.layout.viewRotation.align.top Optional alignment
     * indicating which lattice basis vector should point upwards. Possible
     * values are: "a", "b", "c", "-a", "-b", "-c".
     * @param {string} options.layout.viewRotation.align.right Optional alignment
     * indicating which lattice basis vector should point to the right (more
     * precisely: the cross-product of options.layout.viewRotation.align.top
     * and options.layout.viewRotation.align.right will point away from the
     * screen.). Possible values are: "a", "b", "c", "-a", "-b", "-c".
     * @param {number[][]} options.layout.viewRotation.align.rotations Optional
     * rotations that are applied after the alignment has been done (see
     * options.layout.viewRotation.align). The rotations are given as a list of
     * 4-element arrays containing the rotations axis and rotation angle in
     * degrees. E.g. [[1, 0, 0, 90]] would apply a 90 degree rotation with
     * respect to the x-coordinate. If multiple rotations are specified, they
     * will be applied in the given order. Notice that these rotations are
     * applied with respect to a global coordinate system, not the coordinate
     * system of the structure. In this global coordinate system [1, 0, 0]
     * points to the right, [0, 1, 0] points upwards and [0, 0, 1] points away
     * from the screen.
     *
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
     *     numbers where the index corresponds to an atomic number.
     *
     * @param {string|string[]} options.atoms.colors The colors to use
     * for atoms. Available options are:
     *
     *   - "Jmol" (default): Jmol colors.
     *   - Custom list of colors. Provide an array of hexadecimal colors where
     *     the index corresponds to an atomic number.
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
    setOptions(options: any, render?: boolean, reload?: boolean): void;
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
     *
     */
    calculateCOP(positions: any): THREE.Vector3;
    /**
     * Centers the visualization around a specific point.
     * @param centerPos - The center position as a cartesian vector.
     */
    setViewCenter(centerPos: THREE.Vector3): void;
    /**
     * Translate the atoms.
     *
     * @param translation - Cartesian translation to apply.
     */
    translate(translation: number[]): void;
    /**
     * Set the position for atoms in the currently loaded structure.
     */
    setPositions(positions: number[][], fractional?: boolean, render?: boolean): void;
    /**
     * Gets the positions for atoms in the currently loaded structure.
     */
    getPositions(fractional?: boolean): any[];
    toCartesian(position: THREE.Vector3): THREE.Vector3;
    toScaled(position: THREE.Vector3): THREE.Vector3;
    /**
     * Get a specific atom as defined by a js Group.
     *
     * @param index - Index of the atom.
     * @return THREE.js Group containing the visuals for the atom. The position
     * of the atom is determined by the position of the group.
     */
    getAtom(index: number): THREE.Object3D;
    /**
     * Set the zoom level
     *
     * @param zoomLevel - The zoom level as a scalar.
     */
    setZoom(zoomLevel: number[]): void;
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
     * Create the conventional cell
     *
     */
    createConventionalCell(periodicity: boolean[], visible: boolean): void;
    /**
     * Creates outlines for a cell specified by the given basis vectors.
     * @param origin - The origin for the cell
     * @param basisVectors - The cell basis vectors
     * @param periodicity - The periodicity of the cell
     * @param color - Color fo the cell wireframe
     * @param linewidth - Line width fo the wireframe
     * @param dashed - Is wireframe dashed
     */
    createCell(origin: any, basisVectors: any, periodicity: any, color: any, linewidth: number, dashSize: number, gapSize: number): THREE.Object3D;
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
    wrap(fracPos: any, pbc: any): void;
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
     * @param fractional - Are the coordinates relatice to the cell basis vectors
     */
    addBond(i: any, j: any, pos1: any, pos2: any, bondMaterial: any): void;
    /**
     * Creates atoms and directly adds themto the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     * @param fractional - Are the coordinates relatice to the cell basis vectors
     */
    addAtom(index: any, position: any, atomicNumber: any, mesh: any, fractional?: boolean): void;
    render(): void;
    /**
     * Used to get a number of repetitions that are needed for the given
     * latticevector to reach the target size.
     *
     * @param latticeVector - The vector that is to be extended.
     * @param targetSize - The targeted size.
     */
    getRepetitions(latticeVector: any, targetSize: any): number;
    /**
     * Setup the view for 0D systems (atoms, molecules).
     */
    setup0D(fracPos: any, cartPos: any, labels: any): void;
    /**
     * Replicates the structure along the specified direction to emphasize the
     * 1D nature of the material.
     *
     * @param dim - The index of the periodic dimension.
     */
    setup1D(fracPos: any, cartPos: any, labels: any, pbc: any, periodicIndices: any): void;
    /**
     * Replicates the structure along the specified direction to emphasize the
     * 2D nature of the material.
     *
     * @param periodicIndices - The indices of the periodic dimension.
     */
    setup2D(fracPos: any, cartPos: any, labels: any, pbc: any, periodicIndices: any): void;
    /**
     * Setup the view for 3D systems (crystals)
     */
    setup3D(fracPos: any, cartPos: any, labels: any): void;
    elementNames: string[];
    elementNumbers: object;
    missing: number;
    covalentRadii: number[];
    jmolColors: string[];
}
