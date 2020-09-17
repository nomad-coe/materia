import {
	BufferGeometry,
	Float32BufferAttribute,
	Geometry,
	Vector3,
} from "three/build/three.module.js";
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull';


/**
 * Customized version of the three.js ConvexGeometry that additionally stores
 * the face edges.
 */
const ConvexGeometry = function(points: Vector3[]): void {
	Geometry.call( this );
    const bufferGeometry = new ConvexBufferGeometry(points) 
    this.faceEdges = bufferGeometry.faceEdges
    this.fromBufferGeometry(bufferGeometry);
    this.mergeVertices();
};

ConvexGeometry.prototype = Object.create( Geometry.prototype );
ConvexGeometry.prototype.constructor = ConvexGeometry;

/**
 * Customized version of the three.js ConvexBufferGeometry that additionally
 * identifies and stores the face edges.
 */
const ConvexBufferGeometry = function(points: Vector3[]): void {
	BufferGeometry.call( this );

	// Calculate convex hull from given points
	const convexHull = new ConvexHull().setFromPoints( points );

	// Generate vertices and normals
	const vertices = [];
	const normals = [];
	const faces = convexHull.faces;
	for ( let i = 0; i < faces.length; i ++ ) {
		const face = faces[ i ];
		let edge = face.edge;
		// we move along a doubly-connected edge list to access all face points (see HalfEdge docs)
		do {
			const point = edge.head().point;
			vertices.push( point.x, point.y, point.z );
			normals.push( face.normal.x, face.normal.y, face.normal.z );
			edge = edge.next;
		} while ( edge !== face.edge );
	}
	this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );

    // Identify the edges: loop through the triangle edges, add points that are
    // on the edge by checking if the 'twin' edge is coplanar.
    const faceEdges = []
    const faceIndices = new Set(faces)
    for (let currentTriangle of faceIndices) {
        const faceEdge = []
        const startEdge = currentTriangle.edge
        let currentEdge = currentTriangle.edge
        faceEdge.push(startEdge.tail().point)
        do {
            const currentNormal = currentTriangle.normal
            const neighbour = currentEdge.twin.face
            const neighbourNormal = neighbour.normal
            const coplanar = Math.abs(currentNormal.dot(neighbourNormal) - 1) <= 1E-8
            if (coplanar) {
                currentTriangle = neighbour
                currentEdge = currentEdge.twin.next
            } else {
                faceEdge.push(currentEdge.head().point)
                currentEdge = currentEdge.next
            }
            faceIndices.delete(currentTriangle)
        } while (currentEdge !== startEdge)
        faceEdges.push(faceEdge)
    }
    this.faceEdges = faceEdges
};

ConvexBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
ConvexBufferGeometry.prototype.constructor = ConvexBufferGeometry;

export { ConvexGeometry };
