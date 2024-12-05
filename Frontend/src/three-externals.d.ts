declare module 'three/examples/jsm/loaders/PLYLoader' {
    import { Loader, LoadingManager, BufferGeometry } from 'three';
  
    export class PLYLoader extends Loader {
      constructor(manager?: LoadingManager);
      load(
        url: string,
        onLoad: (geometry: BufferGeometry) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
      ): void;
      parse(data: ArrayBuffer | string): BufferGeometry;
    }
  }