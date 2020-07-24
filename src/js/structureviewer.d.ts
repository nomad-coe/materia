import { Viewer } from "./viewer";
import * as THREE from 'three';
/**
 * Class for visualizing a 3D crystal structure. Uses three.js to do the
 * visualization with WegGL or alternatively in html5 canvas.
 */
export declare class StructureViewer extends Viewer {
    root: THREE.Object3D;
    atoms: THREE.Object3D;
    convCell: THREE.Object3D;
    primCell: THREE.Object3D;
    bonds: THREE.Object3D;
    atomPos: any[];
    atomNumbers: any[];
    latticeParameters: any;
    basisVectors: any[];
    primitiveVectors: any[];
    elements: Object;
    sceneStructure: any;
    sceneInfo: any;
    settings: Object;
    settingsHandler: any;
    elementLegend: any;
    updateBonds: boolean;
    lights: Array<any>;
    bondFills: Array<any>;
    atomFills: Array<any>;
    atomOutlines: Array<any>;
    cellVectorLines: any;
    angleArcs: any;
    axisLabels: Array<any>;
    wrapTolerance: number;
    setupScenes(): void;
    /**
     * Used to setup the visualization options.
     *
     * @param {boolean} options A Javascript object containing the options. See
     *   below for the subparameters.
     * @param {boolean} options.structure.showParam Show lattice parameters
     * @param {boolean} options.structure.showBonds Show bonds
     * @param {boolean} options.structure.showCell Show cell wireframe
     * @param {(string|number[])} options.structure.periodicity How periodicity
     *   is handled in the visualization. Available options are:
     *    - "none": Visualized as is.
     *    - "wrap": Positions wrapped within unit cell.
     *    - "boundary": Positions that are on the cell boundaries are repeated.
     *    - [a, b, c]: Positions are repeated along each lattice vector the
     *      given amount of times.
     * @param {number} options.structure.radiusScale Scaling factor for the
     *   atomic radii.
     * @param {number} options.structure.bondScale Scaling factor for
     *   automatically detecting the bonds.
     * @param {number[]} options.structure.translation A fixed cartesian
     *   translation to be applied for the atoms.
     * @param {string} options.structure.viewCenter Determines how the view is
     *   initially centered. Available options are:
     *    - "COC": Center of cell.
     *    - "COP": Center of atom positions.
     * @param {boolean} options.structure.showShadows Whether shows are cast by
     *   atoms onto others. Note that enabling this increases the computational
     *   cost for doing the visualization.
     */
    setOptions(options: Object): void;
    /**
     * Returns the currently set options.
     * @returns {Object} The current options.
     */
    getOptions(): any;
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
     * @param {string[]} structure.primitiveCell The lattice vectors of the
     *   primitive unit cell as rows of a 3x3 array. This is optional and will be
     *   displayed as an additional wireframe in addition to the unit cell.
     * @param {boolean[]} structure.pbc The periodic boundary conditions for
     *   the structure as a list of three boolean values for each lattice
     *   vector direction.
     * @param {number[][]} structure.bonds Optional manually set bonds. Use of
     *   list of atomic index pairs, each pair specifying a bond between atoms.
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
     * Set the zoom level
     *
     * @param zoomLevel - The zoom level as a scalar.
     */
    setZoom(zoomLevel: number[]): void;
    /**
     * This function will setup the element legend div.
     */
    setupStatic(): void;
    setupLights(): void;
    /**
     *
     */
    toggleElementLegend(value: boolean): void;
    /**
     * Hides or shows the lattice parameter labels.
     */
    toggleLatticeParameters(value: boolean): void;
    /**
     * Hides or shows the cell.
     */
    toggleCell(value: boolean): void;
    /**
     * Toggles the periodic copies.
     */
    /**
     * Hides or shows the bonds.
     */
    toggleBonds(value: boolean): void;
    /**
     * Hides or shows the shadows.
     */
    toggleShadows(value: boolean): void;
    /**
     * Create the visuals to show the lattice parameter labels.
     */
    createLatticeParameters(basis: any, periodicity: any, periodicIndices: any): void;
    /**
     * Creates a list of THREE.Vector3s from the given list of arrays.
     *
     * @param vectors - The positions from which to create vectors.
     */
    createBasisVectors(vectors: number[][]): any[];
    createVisualizationBoundaryPositions(positions: any, atomicNumbers: any): void;
    createVisualizationBoundaryCell(origin: any, basis: any): void;
    /**
     * Create the conventional cell
     *
     */
    createConventionalCell(periodicity: any, visible: any): void;
    /**
     * Create the primitive cell
     *
     */
    createPrimitiveCell(periodicity: any, visible: any): void;
    /**
     * Creates outlines for a cell specified by the given basis vectors.
     * @param origin - The origin for the cell
     * @param basisVectors - The cell basis vectors
     * @param periodicity - The periodicity of the cell
     * @param color - Color fo the cell wireframe
     * @param linewidth - Line width fo the wireframe
     * @param dashed - Is wireframe dashed
     */
    createCell(origin: any, basisVectors: any, periodicity: any, color: any, linewidth: number, dashed: boolean): THREE.Object3D;
    /**
     * Setups the initial view so that the scene is centered and rotated
     * slightly to emphasize 3D nature.
     */
    setupInitialView1D(periodicity: boolean[]): void;
    /**
     * Setups the initial view so that the scene is centered and rotated
     * slightly to emphasize 3D nature.
     */
    setupInitialView2D(periodicity: boolean[], periodicIndices: any): void;
    /**
     * Setups the initial view so that the scene is centered and rotated
     * slightly to emphasize 3D nature.
     */
    setupInitialView3D(): void;
    /**
     * Used to add periodic repetitions of atoms.
     */
    repeat(multipliers: Array<number>, relPos: any, labels: any): void;
    /**
     * Wraps all atoms to be within the unit cell.
     */
    wrap(relPos: any, pbc: any): void;
    /**
     * Used to add periodic repetitions of atoms at the unit cell boundary.
     */
    addBoundaryAtoms(relPos: any, labels: any): void;
    /**
     * Creates representation for all the given atoms.
     *
     * @param positions - Positions of the atoms
     * @param labels - The element numbers for the atoms
     */
    createAtoms(relPos: any, labels: any, pbc: Array<boolean>): void;
    /**
     * Creates bonds between the atoms based on radii and distance.
     *
     * @param bonds - A Nx2 list of atom indices specifying the bonded atoms. Alternatively
     *                you can use "auto" to automatically create the bonds.
     */
    createBonds(bonds?: string): void;
    /**
     * Used to check if the given relative position component is almost the
     * given target value with a tolerance given in cartesian corodinates.
     */
    almostEqual(target: number, coordinate: number, basisVector: any, tolerance: number): boolean;
    /**
     * Creates atom to the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     * @param relative - Are the coordinates relatice to the cell basis vectors
     */
    addBond(i: any, j: any, pos1: any, pos2: any): void;
    /**
     * Creates atoms.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     * @param relative - Are the coordinates relatice to the cell basis vectors
     */
    createAtom(position: any, atomicNumber: any, meshMap: any, relative?: boolean): any[];
    /**
     * Creates atoms and directly adds themto the scene.
     *
     * @param position - Position of the atom
     * @param atomicNumber - The atomic number for the added atom
     * @param relative - Are the coordinates relatice to the cell basis vectors
     */
    addAtom(index: any, position: any, atomicNumber: any, mesh: any, relative?: boolean): void;
    render(): void;
    /**
     * Setup the view for 0D systems (atoms, molecules).
     */
    setup0D(relPos: any, cartPos: any, labels: any): void;
    /**
     * Replicates the structure along the specified direction to emphasize the
     * 1D nature of the material.
     *
     * @param dim - The index of the periodic dimension.
     */
    setup1D(relPos: any, cartPos: any, labels: any, pbc: any, periodicIndices: any): void;
    /**
     * Used to get a number of repetitions that are needed for the given
     * latticevector to reach the target size.
     *
     * @param latticeVector - The vector that is to be extended.
     * @param targetSize - The targeted size.
     */
    getRepetitions(latticeVector: any, targetSize: any): number;
    /**
     * Replicates the structure along the specified direction to emphasize the
     * 2D nature of the material.
     *
     * @param periodicIndices - The indices of the periodic dimension.
     */
    setup2D(relPos: any, cartPos: any, labels: any, pbc: any, periodicIndices: any): void;
    /**
     * Setup the view for 3D systems (crystals)
     */
    setup3D(relPos: any, cartPos: any, labels: any): void;
    elementNames: string[];
    elementNumbers: object;
    missing: number;
    elementRadii: number[];
    elementColors: number[];
}
