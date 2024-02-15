import { clone } from 'lodash';
import { Layer } from './app.component';

interface Coords3 {
  x: number;
  y: number;
  z: number;
}

export class Cubicle {
  #coords: Coords3;
  #index: number;
  #layers: Layer[];

  get classList(): string {
    return ['cubicle']
      .concat(this.#layers.map((layer) => `cubicle__layer--${layer}`))
      .join(' ');
  }

  get coordX(): number {
    return this.#coords.x;
  }

  get coordY(): number {
    return this.#coords.y;
  }

  get coordZ(): number {
    return this.#coords.z;
  }

  get index(): number {
    return this.#index;
  }

  get layers(): Layer[] {
    return this.#layers.slice();
  }

  constructor({ coords, index }: { coords: Coords3; index: number }) {
    this.#coords = clone(coords);
    this.#index = index;
    this.#layers = [
      { 0: 'L' as const, 1: 'M' as const, 2: 'R' as const }[coords.x]!,
      { 0: 'U' as const, 1: 'E' as const, 2: 'D' as const }[coords.y]!,
      { 0: 'B' as const, 1: 'S' as const, 2: 'F' as const }[coords.z]!,
    ];
  }
}
