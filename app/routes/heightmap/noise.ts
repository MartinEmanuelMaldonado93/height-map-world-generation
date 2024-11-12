import perlin from "https://cdn.jsdelivr.net/gh/mikechambers/es6-perlin-module@master/perlin.js";
import "https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js";

class _PerlinWrapper {
  constructor() {}

  noise2D(x: number, y: number): number {
    return perlin(x, y) * 2.0 - 1.0;
  }
}

class _NoiseGenerator {
  private _params: any;
  private _noise: any;

  constructor(params: any) {
    this._params = params;
    this._Init();
  }

  private _Init() {
    this._noise = {
      simplex: new SimplexNoise(this._params.seed),
      perlin: new _PerlinWrapper(),
    };
  }

  Get(x: number, y: number): number {
    const xs = x / this._params.scale;
    const ys = y / this._params.scale;
    const noiseFunc = this._noise[this._params.noiseType];
    let amplitude = 1.0;
    let frequency = 1.0;
    let normalization = 0;
    let total = 0;

    for (let o = 0; o < this._params.octaves; o++) {
      const noiseValue =
        noiseFunc.noise2D(xs * frequency, ys * frequency) * 0.5 + 0.5;
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= this._params.persistence;
      frequency *= this._params.lacunarity;
    }

    total /= normalization;
    return Math.pow(total, this._params.exponentiation) * this._params.height;
  }
}

export { _NoiseGenerator as Noise };
