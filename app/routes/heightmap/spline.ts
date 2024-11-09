// Cubic Hermite Spline class
class CubicHermiteSpline {
  private _points: [number, number][]; // store points as tuples of [t, d]
  private _lerp: (
    t: number,
    y0: number,
    y1: number,
    y2: number,
    y3: number
  ) => number; 
  // constructor to initialize the spline with a given interpolation function
  constructor(
    lerp: (t: number, y0: number, y1: number, y2: number, y3: number) => number
  ) {
    this._points = []; 
    this._lerp = lerp;
  }

  // Method to add a point with a time value 't' and a data value 'd'
  AddPoint(t: number, d: number) {
    this._points.push([t, d]); // Add the point to the points array
  }

  // Method to get the interpolated value at time 't'
  Get(t: number): number {
    let p1 = 0;

    // Find the index of the point before or at 't'
    for (let i = 0; i < this._points.length; i++) {
      if (this._points[i][0] >= t) {
        break; // Stop when we find the point that is at or after 't'
      }
      p1 = i; // Update p1 to the last valid index
    }

    // Define the neighboring points
    const p0 = Math.max(0, p1 - 1); // Point before p1
    const p2 = Math.min(this._points.length - 1, p1 + 1); // Next point after p1
    const p3 = Math.min(this._points.length - 1, p1 + 2); // Second next point after p1

    // If p1 and p2 are the same, return the value at p1
    if (p1 === p2) {
      return this._points[p1][1]; // Return the data value at p1
    }

    // Interpolate using the neighboring points
    return this._lerp(
      (t - this._points[p1][0]) / (this._points[p2][0] - this._points[p1][0]), // Normalized time
      this._points[p0][1], 
      this._points[p1][1], 
      this._points[p2][1],
      this._points[p3][1]
    );
  }
}

// Export the CubicHermiteSpline class
export { CubicHermiteSpline };
