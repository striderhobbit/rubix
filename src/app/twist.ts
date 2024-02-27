import { clone, mapValues } from 'lodash';
import { CubeSliceX, CubeSliceY, CubeSliceZ } from './rubik';

type Axis = 'x' | 'y' | 'z';

type Degree<A extends Axis> = {
  [Slice in {
    x: CubeSliceX;
    y: CubeSliceY;
    z: CubeSliceZ;
  }[A]]?: number;
};

export class Twist<A extends Axis = Axis> {
  readonly #axis: A;

  #degree: Degree<A>;

  get axis(): A {
    return this.#axis;
  }

  get degree(): Degree<A> {
    return clone(this.#degree);
  }

  get size(): number {
    return 9 * Object.keys(this.#degree).length;
  }

  constructor({ axis, degree }: { axis: A; degree: Degree<A> }) {
    this.#axis = axis;
    this.#degree = clone(degree);
  }

  clone(): Twist<A> {
    return new Twist(this);
  }

  pow(order: number): Twist<A> {
    this.#degree = mapValues(
      this.#degree,
      (degree) => degree && degree * order
    );

    return this;
  }
}
