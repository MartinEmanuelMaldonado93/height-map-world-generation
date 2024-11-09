// Define a namespace for math utilities
export const math = {
  /**
   * Generates a random number in the range [a, b).
   * @param a - The lower bound of the range.
   * @param b - The upper bound of the range.
   * @returns A random number between a (inclusive) and b (exclusive).
   */
  rand_range: function (a: number, b: number): number {
    return Math.random() * (b - a) + a;
  },

  /**
   * Generates a random number that is roughly normally distributed.
   * @returns A random number between -1 and 1.
   */
  rand_normalish: function (): number {
    const r = Math.random() + Math.random() + Math.random() + Math.random();
    return (r / 4.0) * 2.0 - 1;
  },

  /**
   * Generates a random integer in the range [a, b].
   * @param a - The lower bound of the range.
   * @param b - The upper bound of the range.
   * @returns A random integer between a and b (inclusive).
   */
  rand_int: function (a: number, b: number): number {
    return Math.round(Math.random() * (b - a) + a);
  },

  /**
   * Performs linear interpolation between a and b based on x.
   * @param x - The interpolation factor (0 <= x <= 1).
   * @param a - The starting value.
   * @param b - The ending value.
   * @returns The interpolated value between a and b.
   */
  lerp: function (x: number, a: number, b: number): number {
    return x * (b - a) + a;
  },

  /**
   * Smoothstep interpolation function.
   * @param x - The interpolation factor (0 <= x <= 1).
   * @param a - The starting value.
   * @param b - The ending value.
   * @returns The interpolated value between a and b with smoothstep easing.
   */
  smoothstep: function (x: number, a: number, b: number): number {
    x = x * x * (3.0 - 2.0 * x);
    return x * (b - a) + a;
  },

  /**
   * Smootherstep interpolation function.
   * @param x - The interpolation factor (0 <= x <= 1).
   * @param a - The starting value.
   * @param b - The ending value.
   * @returns The interpolated value between a and b with smootherstep easing.
   */
  smootherstep: function (x: number, a: number, b: number): number {
    x = x * x * x * (x * (x * 6 - 15) + 10);
    return x * (b - a) + a;
  },

  /**
   * Clamps a value to be within the range [a, b].
   * @param x - The value to clamp.
   * @param a - The lower bound.
   * @param b - The upper bound.
   * @returns The clamped value.
   */
  clamp: function (x: number, a: number, b: number): number {
    return Math.min(Math.max(x, a), b);
  },

  /**
   * Clamps a value to be within the range [0, 1].
   * @param x - The value to clamp.
   * @returns The clamped value between 0 and 1.
   */
  sat: function (x: number): number {
    return Math.min(Math.max(x, 0.0), 1.0);
  },
};
