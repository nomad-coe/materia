import { Vector3 } from "three/build/three.module.js";
/**
 * Customized version of the three.js ConvexGeometry that additionally stores
 * the face edges.
 */
declare const ConvexGeometry: {
    (points: Vector3[]): void;
    prototype: any;
};
export { ConvexGeometry };
