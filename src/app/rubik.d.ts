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

export type MoveDomain = {
  [S in Slice]: {
    slice: S;
    exp: {
      [_ in {
        x: CubeSliceX;
        y: CubeSliceY;
        z: CubeSliceZ;
      }[S]]?: number;
    };
  };
}[Slice];

type Slice = 'x' | 'y' | 'z';
