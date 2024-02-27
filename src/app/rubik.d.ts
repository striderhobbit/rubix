export type BaseMove =
  | 'b'
  | 'B'
  | 'd'
  | 'D'
  | 'E'
  | 'f'
  | 'F'
  | 'l'
  | 'L'
  | 'M'
  | 'r'
  | 'R'
  | 'S'
  | 'u'
  | 'U'
  | 'x'
  | 'y'
  | 'z';

export type CubeSliceX = 'L' | 'M' | 'R';
export type CubeSliceY = 'U' | 'E' | 'D';
export type CubeSliceZ = 'B' | 'S' | 'F';

export type CubeSlice = CubeSliceX | CubeSliceY | CubeSliceZ;
