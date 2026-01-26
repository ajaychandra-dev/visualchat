export const isNonEmptyArray = (arr: unknown): arr is any[] =>
  Array.isArray(arr) && arr.length > 0;
