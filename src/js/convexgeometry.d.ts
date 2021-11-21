import * as THREE from "three";
declare type ConvexGeometry = {
    geometry: THREE.BufferGeometry;
    faces: THREE.Vector3[][];
};
/**
 * Customized version of the three.js ConvexBufferGeometry that additionally
 * identifies and stores the face edges.
 */
declare const getConvexGeometry: (points: THREE.Vector3[]) => ConvexGeometry;
export { getConvexGeometry };
