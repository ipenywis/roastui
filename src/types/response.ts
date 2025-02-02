export type StandardApiResponse<T, K extends string = 'data'> = {
  [key in K]: T;
};
