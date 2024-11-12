import { _Graphics, graphics } from "./graphics";
import { WEBGL } from "./utils";

export class _Game {
  _graphics: _Graphics;
  _previousRAF: number | null = null;
  _minFrameTime: number = 1.0 / 10.0;
  _entities: { [key: string]: any } = {};
  imageApi = {
    GetImageData: graphics.GetImageData,
    GetPixel: graphics.GetPixel,
  };

  constructor() {
    this._graphics = new graphics.Graphics();
    this._Initialize();
  }
  //** Initialize RAF  * /
  private _Initialize(): void {
    this._OnInitialize();
    this._RAF();
  }

  private _DisplayError(errorText: string): void {
    const error = document.getElementById("error");
    if (error) {
      error.innerText = errorText;
    }
  }

  private _RAF(): void {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }
      this._Render(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _StepEntities(timeInSeconds: number): void {
    for (let k in this._entities) {
      this._entities[k].Update(timeInSeconds);
    }
  }

  private _Render(timeInMS: number): void {
    const timeInSeconds = Math.min(timeInMS * 0.001, this._minFrameTime);

    this._OnStep(timeInSeconds);
    this._StepEntities(timeInSeconds);
    this._graphics.Render(timeInSeconds);

    this._RAF();
  }

  _OnInitialize(): void {
    console.log("On initialize ...");
  }

  _OnStep(timeInSeconds: number): void {
    // todoo
  }
  onDispose() {
    this._graphics.onDispose();
  }
}

export const game = {
  Game: _Game,
};
