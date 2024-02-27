import { clone } from 'lodash';
import { CubeSliceX, CubeSliceY, CubeSliceZ } from './rubik';

type Axis = 'x' | 'y' | 'z';

type Orders<A extends Axis> = {
  [Slice in {
    x: CubeSliceX;
    y: CubeSliceY;
    z: CubeSliceZ;
  }[A]]?: number;
};

export class Twist<A extends Axis = Axis> {
  readonly #axis: A;
  readonly #orders: Orders<A>;

  get axis(): A {
    return this.#axis;
  }

  get orders(): Orders<A> {
    return clone(this.#orders);
  }

  constructor({ axis, orders }: { axis: A; orders: Orders<A> }) {
    this.#axis = axis;
    this.#orders = clone(orders);
  }

  clone(): Twist<A> {
    return new Twist(this);
  }

  pow(exp: number): Twist<A> {
    let slice: keyof Orders<A>;

    for (slice in this.#orders) {
      const order = this.#orders[slice];

      if (order != null) {
        this.#orders[slice] = order * exp;
      }
    }

    return this;
  }
}
