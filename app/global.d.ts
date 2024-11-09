declare module "https://cdn.jsdelivr.net/gh/mikechambers/es6-perlin-module@master/perlin.js" {
  export default function perlin(x: number, y: number): number;
}

declare class SimplexNoise {
  constructor(seed?: string | number);
  noise2D(x: number, y: number): number;
}

// declare module "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/WebGL.js" {
//   class WEBGL {
//     constructor() {}
//     static isWebGL2Available(): boolean;
//   }
//   export default WEBGL;
// }

declare module "stats-js" {
  class Stats {
    constructor() {}
    update(): void;
  }
  export default Stats;
}
