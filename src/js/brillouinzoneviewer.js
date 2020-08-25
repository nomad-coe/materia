import { Viewer } from "./viewer";
import * as THREE from 'three';
/*
 * A 3D visualizer for the Brillouin Zone and the k-point path within it.
 */
export class BrillouinZoneViewer extends Viewer {
    /*
     * Overrides the implementation from the base class, as we need two scenes:
     * one for the BZ mesh and another for the information that is laid on top.
     */
    setupScenes() {
        this.scenes = [];
        this.sceneZone = new THREE.Scene();
        this.scenes.push(this.sceneZone);
        this.sceneInfo = new THREE.Scene();
        this.scenes.push(this.sceneInfo);
        //this.setupControlVariables(10, 2.5, 50);
    }
    setupLights() {
        // White directional light shining from the top.
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.05);
        directionalLight.position.set(0, 0, 30);
        this.sceneZone.add(directionalLight);
        // White ambient light.
        let ambientLight = new THREE.AmbientLight(0x404040, 4.1); // soft white light
        this.sceneZone.add(ambientLight);
    }
    /**
     * Used to initialize the viewer with data.
     *
     * @data {object} Data that describes the Brillouin Zone.
     */
    load(data) {
        // Add the Brillouin zone and the k-point path
        let vertices = data["vertices"];
        let faces = data["faces"];
        let basis = data["basis"];
        let segments = data["segments"];
        let labels = data["labels"];
        this.basis = data["basis"];
        if (!vertices || !faces || !basis || !segments) {
            console.log("The data given for the Brillouin zone viewer is incomplete.");
            return false;
        }
        else {
            if (!labels) {
                console.log("No labels provided for Brillouin zone viewer.");
            }
            this.createBrillouinZone(vertices, faces, basis, segments, labels);
        }
        this.setupInitialView();
        return true;
    }
    /**
     * Used to setup the visualization according to the given options.
     */
    setOptions(opt) {
        // The default settings object
        let options = {
            controls: {
                rotateSpeed: 40,
                enablePan: false
            },
            view: {
                fitMargin: 0.01,
            },
            segments: {
                color: "#E56400"
            },
            labels: {
                font: "Arial",
                size: 0.7,
                color: "#E56400",
            },
            renderer: {
                backgroundColor: ["#ffffff", 1]
            }
        };
        this.fillOptions(opt, options);
        // Handle base class settings
        super.setOptions(options);
    }
    setupInitialView() {
        //Rotate the scene so that the first basis vector is pointing up.
        let yAxis = new THREE.Vector3(0, 1, 0);
        let xAxis = new THREE.Vector3(1, 0, 0);
        let zAxis = new THREE.Vector3(0, 0, 1);
        let direction = new THREE.Vector3().fromArray(this.basis[0]);
        let quaternion = new THREE.Quaternion().setFromUnitVectors(yAxis, direction.clone().normalize());
        quaternion.conjugate();
        this.info.quaternion.copy(quaternion);
        this.zone.quaternion.copy(quaternion);
        // Rotate the scene so that the segments are shown properly
        this.info.updateMatrixWorld(); // The positions are not otherwise updated properly
        this.zone.updateMatrixWorld();
        let average = new THREE.Vector3();
        let nLabelPoints = this.labelPoints.length;
        for (let iSegmentPoint = 0; iSegmentPoint < nLabelPoints; ++iSegmentPoint) {
            let segmentPoint = this.labelPoints[iSegmentPoint];
            average.add(segmentPoint.getWorldPosition(new THREE.Vector3()));
        }
        average.multiplyScalar(1 / nLabelPoints);
        average.y = 0;
        let segmentQ = new THREE.Quaternion().setFromUnitVectors(zAxis, average.clone().normalize());
        segmentQ.conjugate();
        this.info.quaternion.premultiply(segmentQ);
        this.zone.quaternion.premultiply(segmentQ);
        // Rotate the zone so that it is shown from slightly above
        let qX = new THREE.Quaternion();
        qX.setFromAxisAngle(xAxis, Math.PI / 8);
        this.info.quaternion.premultiply(qX);
        this.zone.quaternion.premultiply(qX);
    }
    /*
     * Used to create the representation for the first Brillouin Zone.
     */
    createBrillouinZone(vertices, faces, basis, segments, labels) {
        this.zone = new THREE.Object3D();
        this.zone.name = "zone";
        this.sceneZone.add(this.zone);
        this.info = new THREE.Object3D();
        this.info.name = "info";
        this.sceneInfo.add(this.info);
        let bzGeometry = new THREE.Geometry();
        let bzMaterial = new THREE.MeshLambertMaterial({
            color: 0xeeeeee,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        let lineMaterial = new THREE.LineBasicMaterial({
            color: 0x3333333,
            linewidth: 2,
        });
        // Create vertices
        for (let iVertex = 0; iVertex < vertices.length; ++iVertex) {
            let vertex = vertices[iVertex];
            bzGeometry.vertices.push(new THREE.Vector3().fromArray(vertex).multiplyScalar(1E-10));
        }
        // Create faces
        let faceMap = {};
        for (let iFace = 0; iFace < faces.length; ++iFace) {
            let faceIndices = faces[iFace];
            let nPoints = faceIndices.length;
            for (let iPoint = 0; iPoint < nPoints; ++iPoint) {
                // Create edges
                let firstIndex = faceIndices[iPoint];
                let secondIndex = faceIndices[(iPoint + 1) % nPoints];
                let key1 = [firstIndex, secondIndex];
                let key2 = [secondIndex, firstIndex];
                if (!faceMap.hasOwnProperty(key1.toString()) && !faceMap.hasOwnProperty(key2.toString())) {
                    faceMap[key1.toString()] = true;
                    faceMap[key2.toString()] = true;
                    let lineGeometry = new THREE.Geometry();
                    lineGeometry.vertices.push(new THREE.Vector3().fromArray(vertices[firstIndex]).multiplyScalar(1E-10), new THREE.Vector3().fromArray(vertices[secondIndex]).multiplyScalar(1E-10));
                    let line = new THREE.Line(lineGeometry, lineMaterial);
                    this.zone.add(line);
                }
                // Create surfaces
                if (iPoint < nPoints - 2) {
                    let face = new THREE.Face3(faceIndices[0], faceIndices[(iPoint + 1) % nPoints], faceIndices[(iPoint + 2) % nPoints]
                    //normal
                    );
                    bzGeometry.faces.push(face);
                }
            }
        }
        // Compute normals that are needed for shading the surface
        bzGeometry.computeFaceNormals();
        // Create the reciprocal space axes
        let createAxisLabel = (position, label) => {
            // Configure canvas
            let canvas = document.createElement('canvas');
            let size = 256;
            canvas.width = size;
            canvas.height = size;
            let ctx = canvas.getContext('2d');
            // Draw label
            ctx.fillStyle = "#000000";
            ctx.font = "90px " + this.options.labels.font;
            ctx.textAlign = "center";
            ctx.fillText(label, size / 2, size / 2);
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            let material = new THREE.SpriteMaterial({ map: texture });
            let sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            let scale = 1 / 11;
            sprite.scale.set(scale, scale, 1);
            return sprite;
        };
        for (let iBasis = 0; iBasis < 3; ++iBasis) {
            let length = 0.7;
            let basisVector = basis[iBasis];
            let origin = new THREE.Vector3(0, 0, 0);
            let dir = new THREE.Vector3()
                .fromArray(basisVector)
                .multiplyScalar(1E-10)
                .multiplyScalar(length);
            // Add a dashed line
            let lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(origin, dir);
            let lineMaterial = new THREE.LineDashedMaterial({
                color: 0x000000,
                linewidth: 0.1,
                dashSize: 0.005,
                gapSize: 0.005
            });
            let line = new THREE.Line(lineGeometry, lineMaterial);
            line.computeLineDistances();
            this.info.add(line);
            // Add an axis label
            let textOffset = 0.020;
            let textPos = new THREE.Vector3()
                .copy(dir)
                .multiplyScalar(1 + textOffset / dir.length());
            let axisLabel;
            switch (iBasis) {
                case 0:
                    axisLabel = "b₁";
                    break;
                case 1:
                    axisLabel = "b₂";
                    break;
                case 2:
                    axisLabel = "b₃";
                    break;
            }
            axisLabel = createAxisLabel(textPos, axisLabel);
            this.info.add(axisLabel);
            // Add axis arrow
            let arrowGeometry = new THREE.CylinderGeometry(0, 0.003, 0.012, 12);
            let arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            let arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
            arrow.position.copy(dir);
            arrow.lookAt(new THREE.Vector3());
            arrow.rotateX(-Math.PI / 2);
            this.info.add(arrow);
        }
        /*
         * For creating high symmetry points.
         */
        let merged = [].concat.apply([], basis);
        let basisMatrix = new THREE.Matrix3().fromArray(merged);
        let labelMap = {};
        let labelPositions = [];
        let generateSymmPoint = (position, label) => {
            // Configure canvas
            let canvas = document.createElement('canvas');
            let size = 256;
            canvas.width = size;
            canvas.height = size;
            let ctx = canvas.getContext('2d');
            // Draw circle
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 15, 0, 2 * Math.PI);
            ctx.fillStyle = this.options.segments.color;
            ctx.fill();
            // Draw label
            ctx.fillStyle = "#000000";
            ctx.font = "100px " + this.options.labels.font;
            ctx.textAlign = "center";
            ctx.fillText(label, canvas.width / 2, 80);
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            let material = new THREE.SpriteMaterial({ map: texture });
            let sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            let scale = 1 / 15;
            sprite.scale.set(scale, scale, 1);
            return sprite;
        };
        // Create the k-point path from the given segments. Currently assumes
        // that the segments are linear and the segment path is determined by
        // the start and end point.
        let kpathMaterial = new THREE.LineBasicMaterial({
            color: this.options.segments.color,
            linewidth: 3,
        });
        let kpathGeometry = new THREE.Geometry();
        this.labelPoints = [];
        for (let iSegment = 0; iSegment < segments.length; ++iSegment) {
            let segment = segments[iSegment];
            let nKpoints = segment.length;
            let kPointIndices = [0, nKpoints - 1];
            for (let iKpoint of kPointIndices) {
                let kpoint = new THREE.Vector3().fromArray(segment[iKpoint]).multiplyScalar(1E-10);
                kpoint.applyMatrix3(basisMatrix);
                kpathGeometry.vertices.push(kpoint);
                // Create the label for the first point in the segment
                if (labels) {
                    if (iKpoint === 0 || iKpoint === nKpoints - 1) {
                        let label = "";
                        if (iKpoint === 0) {
                            label = labels[iSegment][0];
                        }
                        else if (iKpoint === nKpoints - 1) {
                            label = labels[iSegment][1];
                        }
                        // Check if this position has alread been marked
                        let labelExists = false;
                        for (let iLabel = 0; iLabel < this.labelPoints.length; ++iLabel) {
                            let testPos = this.labelPoints[iLabel].position;
                            let delta = new THREE.Vector3()
                                .copy(kpoint)
                                .addScaledVector(testPos, -1.0)
                                .length();
                            if (delta < 1E-5) {
                                labelExists = true;
                            }
                        }
                        // Add a label position if it wasn't marked already
                        if (!labelExists) {
                            labelMap[label] = true;
                            let symmPoint = generateSymmPoint(kpoint, label);
                            this.info.add(symmPoint);
                            this.labelPoints.push(symmPoint);
                        }
                    }
                }
            }
        }
        let kpath = new THREE.Line(kpathGeometry, kpathMaterial);
        this.info.add(kpath);
        let mesh = new THREE.Mesh(bzGeometry, bzMaterial);
        this.zone.add(mesh);
        this.cornerPoints = new THREE.Points(bzGeometry);
        this.cornerPoints.visible = true;
    }
}
