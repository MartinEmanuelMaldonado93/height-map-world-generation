import * as THREE from "three";
import Stats from "stats-js";
import WEBGL from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/WebGL.js";

export const graphics = function () {
  function _GetImageData(image: HTMLImageElement): ImageData {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
  }

  function _GetPixel(
    imagedata: ImageData,
    x: number,
    y: number
  ): { r: number; g: number; b: number; a: number } {
    const position = (x + imagedata.width * y) * 4;
    const data = imagedata.data;
    return {
      r: data[position],
      g: data[position + 1],
      b: data[position + 2],
      a: data[position + 3],
    };
  }

  class _Graphics {
    private _threejs: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    private _camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    private _scene: THREE.Scene = new THREE.Scene();
    private _stats!: Stats;

    constructor(private _game: any) {}

    Initialize(): boolean {
      if (!WEBGL.isWebGL2Available()) {
        return false;
      }

      this._threejs = new THREE.WebGLRenderer({ antialias: true });
      this._threejs.setPixelRatio(window.devicePixelRatio);
      this._threejs.setSize(window.innerWidth, window.innerHeight);

      const target = document.getElementById("target")!;
      target.appendChild(this._threejs.domElement);

      this._stats = new Stats();
      // target.appendChild(this._stats.dom);

      window.addEventListener("resize", () => this._OnWindowResize(), false);

      const fov = 60;
      const aspect = 1920 / 1080;
      const near = 0.1;
      const far = 10000.0;
      this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this._camera.position.set(75, 20, 0);

      this._scene = new THREE.Scene();
      this._scene.background = new THREE.Color(0xaaaaaa);

      this._CreateLights();

      return true;
    }

    private _CreateLights(): void {
      let light = new THREE.DirectionalLight(0x808080, 50);
      light.position.set(-100, 100, -100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._scene.add(light);

      light = new THREE.DirectionalLight(0x404040, 50);
      light.position.set(100, 100, -100);
      light.target.position.set(0, 0, 0);
      light.castShadow = false;
      this._scene.add(light);
    }

    private _OnWindowResize(): void {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();
      this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    get Scene(): THREE.Scene {
      return this._scene;
    }

    get Camera(): THREE.PerspectiveCamera {
      return this._camera;
    }

    Render(timeInSeconds: number): void {
      this._threejs.render(this._scene, this._camera);
      this._stats.update();
    }
  }

  return {
    Graphics: _Graphics,
    GetPixel: _GetPixel,
    GetImageData: _GetImageData,
  };
};
