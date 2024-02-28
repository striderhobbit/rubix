import { Vector3 } from 'three';

export class Cubicle {
  readonly #coords: Vector3;
  readonly #index: number;

  get coords(): Vector3 {
    return this.#coords.clone();
  }

  get index(): number {
    return this.#index;
  }

  constructor({ coords, index }: { coords: Vector3; index: number }) {
    this.#coords = coords.clone();
    this.#index = index;
  }
}
