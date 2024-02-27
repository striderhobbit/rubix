import { Vector3 } from 'three';
import { CubeSliceX, CubeSliceY, CubeSliceZ } from './rubik';

export class Cubicle {
  readonly #index: number;
  readonly #vector: Vector3;

  get index(): number {
    return this.#index;
  }

  get vector(): Vector3 {
    return this.#vector.clone();
  }

  constructor({ index, vector }: { index: number; vector: Vector3 }) {
    this.#index = index;
    this.#vector = vector.clone();
  }
}
