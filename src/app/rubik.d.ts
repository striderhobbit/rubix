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

export type CubeSlice = CubeSliceX | CubeSliceY | CubeSliceZ;

export type CubeSliceX = 'L' | 'M' | 'R';
export type CubeSliceY = 'U' | 'E' | 'D';
export type CubeSliceZ = 'B' | 'S' | 'F';

export type Twist = {
  [S in Slice]: {
    slice: S;
    degree: {
      [_ in {
        x: CubeSliceX;
        y: CubeSliceY;
        z: CubeSliceZ;
      }[S]]?: number;
    };
  };
}[Slice];

type Slice = 'x' | 'y' | 'z';
