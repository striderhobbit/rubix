import { Vector3 } from 'three';
import { Axis, Slice } from './twist';

export class Cubicle {
  readonly #coords: Vector3;
  readonly #index: number;

  get coords(): Record<'--tx' | '--ty' | '--tz', number> {
    return {
      '--tx': this.#coords.x,
      '--ty': this.#coords.y,
      '--tz': this.#coords.z,
    };
  }

  get index(): number {
    return this.#index;
  }

  get slices(): Slice[] {
    return ['x' as const, 'y' as const, 'z' as const].map((axis) =>
      this.pick(axis)
    );
  }

  constructor({ coords, index }: { coords: Vector3; index: number }) {
    this.#coords = coords.clone();
    this.#index = index;
  }

  pick(axis: Axis): Slice {
    return {
      x: ['L' as const, 'M' as const, 'R' as const],
      y: ['U' as const, 'E' as const, 'D' as const],
      z: ['B' as const, 'S' as const, 'F' as const],
    }[axis][this.#coords[axis]];
  }
}
