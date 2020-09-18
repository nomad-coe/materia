import * as THREE from "three";
/**
 * Customized version of the three.js ConvexGeometry that additionally stores
 * the face edges.
 */
declare const ConvexGeometry: {
    (points: THREE.Vector3[]): void;
    prototype: any;
};
export { ConvexGeometry };
