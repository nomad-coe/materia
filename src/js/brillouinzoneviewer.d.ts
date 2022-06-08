import { Viewer } from "./viewer";
import * as THREE from "three";
export declare class BrillouinZoneViewer extends Viewer {
    hostElement: any;
    data: any;
    sceneRoot: THREE.Scene;
    sceneInfo: THREE.Scene;
    root: THREE.Object3D;
    info: THREE.Object3D;
    basis: any;
    segments: any;
    kpoints: any;
    labelPoints: any;
    basisVectors: THREE.Vector3[];
    B: THREE.Matrix3;
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
     */
    constructor(hostElement: any, options?: any);
    /**
     * Saves the default options.
    */
    setOptions(options: any): void;
    setupScenes(): void;
    setupLights(): void;
    /**
     * Used to create a visualization for the first Brillouin Zone together with
     * kpath and segment information.
     *
     * @param {object} data A Javascript object containing the visualized
     * structure. See below for the subparameters.
     * @param {number[][]} data.basis The basis vectors of the reciprocal cell as
     *   rows of a 3x3 array.
     * @param {number[][]} data.segments List containing lists of k-points,
     * each sublist indicating a continuous segment within the Brillouin zone.
     * @param {*} data.kpoints List of pairs of labels and reciprocal
     * lattice coordinates for specific k-points that should be shown.
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
     */
    load(data: any, options: any): void;
    /**
     * Adjust the zoom so that the contents fit on the screen. Notice that is is
     * typically useful to center around a point of interest first.
     *
     * @param {number} margin - Margin to apply.
     */
    fit(margin?: number): void;
    /**
     * Used to rotate the contents based of the alignment of the basis cell
     * vectors or the segments with respect to the cartesian axes.
     *
     * @param alignments List of up to two alignments for any two axis vectors.
     * E.g. [["up", "c"], ["right", "segments"]] will force the third basis
     * vector to point exactly up, and the segments to as close to right as
     * possible. The alignments are applied in the given order.
     */
    align(alignments: string[][]): void;
    createCircle(position: THREE.Vector3, diameter: number, color: string): THREE.Object3D;
}
