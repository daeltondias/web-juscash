export type UnionToIntersection<T> = (
  T extends T ? (x: T) => void : never
) extends (x: infer I) => void
  ? I
  : never;

export type Overwrite<T, U> = Omit<T, keyof U> & U;
