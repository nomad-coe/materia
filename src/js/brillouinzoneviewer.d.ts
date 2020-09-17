import { Viewer } from "./viewer";
export declare class BrillouinZoneViewer extends Viewer {
    private data;
    private info;
    private zone;
    private sceneZone;
    private sceneInfo;
    private basis;
    private labelPoints;
    private basisVectors;
    private B;
    setupScenes(): void;
    setupLights(): void;
    /**
     * Used to initialize the viewer with data.
     *
     * @data {object} Data that describes the Brillouin Zone.
     */
    load(data: object): boolean;
    /**
     * Used to setup the visualization options.
     *
     * @param {boolean} options A Javascript object containing the options. See
     *   below for the subparameters.
     * @param {string} options.segments.color Segment color
     * @param {number} options.segments.linewidth Segment linewidth
     *
     * @param {string} options.kpoints.label.color Label color
     * @param {number} options.kpoints.label.size Label size
     * @param {string} options.kpoints.label.font Label font
     * @param {boolean} options.kpoints.label.offset2D Offset of the labels in
     * the sprite's 2D coordinate system. The offset is relative to the font
     * size and the default [0, 0] corresponds to centered labels.
     * @param {string} options.kpoints.stroke.width.font Label outline stroke width
     * @param {string} options.kpoints.stroke.width.font Label outline stroke color
     * @param {string} options.kpoints.point.color Point color
     * @param {number} options.kpoints.point.size Point size
     *
     * @param {boolean} options.basis.enabled Show basis
     * @param {string} options.basis.font Font size for basis labels. Applied as
     * default to all labels, can be overridden individually for each basis.
     * @param {string} options.basis.a.color Color applied to the
     *   label of the first reciprocal lattice vector.
     * @param {string} options.basis.a.font Font family applied to the
     *   label of the first reciprocal lattice vector.
     * @param {number} options.basis.a.size Font size applied to the
     *   label of the first reciprocal lattice vector.
     * @param {string} options.basis.b.color Color applied to the
     *   label of the second reciprocal lattice vector.
     * @param {string} options.basis.b.font Font family applied to the
     *   label of the second reciprocal lattice vector.
     * @param {number} options.basis.b.size Font size applied to the
     *   label of the second reciprocal lattice vector.
     * @param {string} options.basis.c.color Color applied to the
     *   label of the third reciprocal lattice vector.
     * @param {string} options.basis.c.font Font family applied to the
     *   label of the third reciprocal lattice vector.
     * @param {number} options.basis.c.size Font size applied to the
     *   label of the third reciprocal lattice vector.
     */
    setOptions(options: Record<string, unknown>): void;
    setupInitialView(): void;
    createBrillouinZone(basis: number[][], segments: number[][][], labels: string[][]): void;
    /**
     * @param rotations The rotations as a list. Each rotation should be an
     * array containing four numbers: [x, y, z, angle]. The rotations are
     * applied in the given order.
     */
    rotateView(rotations: number[], render?: boolean): void;
    alignView(up: string, segments: string, render?: boolean): void;
}
