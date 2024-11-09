declare module "https://cdn.jsdelivr.net/gh/mikechambers/es6-perlin-module@master/perlin.js" {
  export default function perlin(x: number, y: number): number;
}

declare class SimplexNoise {
  constructor(seed?: string | number);
  noise2D(x: number, y: number): number;
}
