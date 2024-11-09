type basecDic = Record<string, any>;

export const utils = {
  // Method to get the intersection of two dict
  DictIntersection: function (
    dictA: basecDic,
    dictB: basecDic
  ): basecDic {
    const intersection: basecDic = {};
    
    for (const k in dictB) {
      if (k in dictA) {
        intersection[k] = dictA[k];
      }
    }
    return intersection;
  },

  //  Method to get the diff of two dict
  DictDifference: function (
    dictA: basecDic,
    dictB: basecDic
  ): basecDic {
    const diff: basecDic = { ...dictA };
    
    for (const k in dictB) {
      delete diff[k]; // Delete the keys of dictB
    }
    return diff;
  },
};
