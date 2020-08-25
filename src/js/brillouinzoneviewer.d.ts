import { Viewer } from "./viewer";
export declare class BrillouinZoneViewer extends Viewer {
    private info;
    private zone;
    private sceneZone;
    private sceneInfo;
    private basis;
    private labelPoints;
    setupScenes(): void;
    setupLights(): void;
    /**
     * Used to initialize the viewer with data.
     *
     * @data {object} Data that describes the Brillouin Zone.
     */
    load(data: object): boolean;
    /**
     * Used to setup the visualization according to the given options.
     */
    setOptions(opt: Object): void;
    setupInitialView(): void;
    createBrillouinZone(vertices: number[][], faces: number[][], basis: number[][], segments: number[][][], labels: string[][]): void;
}
