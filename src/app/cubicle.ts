import { Vector3 } from 'three';
import { CubeSliceX, CubeSliceY, CubeSliceZ } from './app.component';
import { Move } from './move';

export class Cubicle {
  readonly #index: number;
  readonly #vector: Vector3;

  get index(): number {
    return this.#index;
  }

  get slices(): [CubeSliceX, CubeSliceY, CubeSliceZ] {
    return [
      ['L' as const, 'M' as const, 'R' as const][this.#vector.x],
      ['U' as const, 'E' as const, 'D' as const][this.#vector.y],
      ['B' as const, 'S' as const, 'F' as const][this.#vector.z],
    ];
  }

  get vector(): Vector3 {
    return this.#vector.clone();
  }

  constructor({ index, vector }: { index: number; vector: Vector3 }) {
    this.#index = index;
    this.#vector = vector.clone();
  }

  direction(move?: Move): number | undefined {
    if (move != null) {
      switch (move.domain.slice) {
        case 'x':
          return move.domain.directions[this.slices[0]];
        case 'y':
          return move.domain.directions[this.slices[1]];
        case 'z':
          return move.domain.directions[this.slices[2]];
      }
    }

    return;
  }
}
