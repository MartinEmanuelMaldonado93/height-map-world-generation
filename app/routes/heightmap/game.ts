// import * as THREE from "three";
// import WEBGL from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/WebGL.js";
import { _Graphics, imageAPI } from "./graphics.js";

export class Game {
  private static _graphics: _Graphics;
  private static _previousRAF: number | null = null;
  private static _minFrameTime: number = 1.0 / 10.0;
  private static _entities: { [key: string]: any } = {};
  private imageApi: ReturnType<typeof imageAPI>;

  constructor() {
    this.imageApi = imageAPI();
    Game._Initialize();
  }

  private static _Initialize(): void {
    Game._graphics = new _Graphics();
    if (!Game._graphics.Initialize()) {
      Game._DisplayError("WebGL2 is not available.");
      return;
    }
    console.log("WebGL2 is available");
    Game._OnInitialize();
    Game._RAF();
  }

  private static _DisplayError(errorText: string): void {
    const error = document.getElementById("error");
    if (error) {
      error.innerText = errorText;
    }
  }

  private static _RAF(): void {
    requestAnimationFrame((t) => {
      if (Game._previousRAF === null) {
        Game._previousRAF = t;
      }
      Game._Render(t - Game._previousRAF);
      Game._previousRAF = t;
    });
  }

  private static _StepEntities(timeInSeconds: number): void {
    for (let k in Game._entities) {
      Game._entities[k].Update(timeInSeconds);
    }
  }

  private static _Render(timeInMS: number): void {
    const timeInSeconds = Math.min(timeInMS * 0.001, Game._minFrameTime);

    Game._OnStep(timeInSeconds);
    Game._StepEntities(timeInSeconds);
    Game._graphics.Render(timeInSeconds);

    Game._RAF();
  }

  private static _OnInitialize(): void {
    console.log("On initialize ...");
  }

  private static _OnStep(timeInSeconds: number): void {
    // todoo
  }
}
