import { clone } from 'lodash';
import { Layer } from './app.component';

interface Coords3 {
  x: number;
  y: number;
  z: number;
}

enum LayerX {
  L,
  M,
  R,
}

enum LayerY {
  U,
  E,
  D,
}

enum LayerZ {
  B,
  S,
  F,
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
      LayerX[coords.x] as Layer,
      LayerY[coords.y] as Layer,
      LayerZ[coords.z] as Layer,
    ];
  }
}
