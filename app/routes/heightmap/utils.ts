type basecDic = Record<string, any>;

export const utils = {
  // Method to get the intersection of two dict
  DictIntersection: function (dictA: basecDic, dictB: basecDic): basecDic {
    const intersection: basecDic = {};

    for (const k in dictB) {
      if (k in dictA) {
        intersection[k] = dictA[k];
      }
    }
    return intersection;
  },

  //  Method to get the diff of two dict
  DictDifference: function (dictA: basecDic, dictB: basecDic): basecDic {
    const diff: basecDic = { ...dictA };

    for (const k in dictB) {
      delete diff[k]; // Delete the keys of dictB
    }
    return diff;
  },
};

//WEBGL
export const WEBGL = {
  isWebGL2Available() {
    try {
      var canvas = document.createElement("canvas");
      return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"));
    } catch (e) {
      return false;
    }
  },
};
