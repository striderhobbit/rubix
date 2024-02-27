import { clone, mapValues } from 'lodash';
import { CubeSliceX, CubeSliceY, CubeSliceZ } from './rubik';

type Axis = 'x' | 'y' | 'z';

type Order<A extends Axis> = {
  [Slice in {
    x: CubeSliceX;
    y: CubeSliceY;
    z: CubeSliceZ;
  }[A]]?: number;
};

export class Twist<A extends Axis = Axis> {
  readonly #axis: A;

  #order: Order<A>;

  get axis(): A {
    return this.#axis;
  }

  get order(): Order<A> {
    return clone(this.#order);
  }

  get size(): number {
    return 9 * Object.keys(this.#order).length;
  }

  constructor({ axis, order }: { axis: A; order: Order<A> }) {
    this.#axis = axis;
    this.#order = clone(order);
  }

  clone(): Twist<A> {
    return new Twist(this);
  }

  pow(order: number): Twist<A> {
    this.#order = mapValues(this.#order, (x) => x && x * order);

    return this;
  }
}
