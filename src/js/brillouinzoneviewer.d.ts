import { Viewer } from "./viewer";
import * as THREE from "three";
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
    load(data: object, render?: boolean): boolean;
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
    setOptions(options: any, render?: boolean, reload?: boolean): void;
    createBrillouinZone(basis: number[][], segments: number[][][], kpoints: [string, number[]][]): void;
    getCornerPoints(): {
        points: any[];
        margin: number;
    };
    /**
     * @param rotations The rotations as a list. Each rotation should be an
     * array containing four numbers: [x, y, z, angle]. The rotations are
     * applied in the given order.
     */
    rotateView(rotations: number[], render?: boolean): void;
    alignView(alignments: string[][], render?: boolean): void;
    createCircle(position: THREE.Vector3, diameter: number, color: string): THREE.Object3D;
}
