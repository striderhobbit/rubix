import { clone, mapValues } from 'lodash';
import { CubeSliceX, CubeSliceY, CubeSliceZ } from './rubik';

type Slice = 'x' | 'y' | 'z';

type Degree<S extends Slice> = {
  [_ in {
    x: CubeSliceX;
    y: CubeSliceY;
    z: CubeSliceZ;
  }[S]]?: number;
};

export class Twist<S extends Slice = Slice> {
  #degree: Degree<S>;

  readonly #slice: S;

  get degree(): Degree<S> {
    return clone(this.#degree);
  }

  get size(): number {
    return 9 * Object.keys(this.#degree).length;
  }

  get slice(): S {
    return this.#slice;
  }

  constructor({ degree, slice }: { degree: Degree<S>; slice: S }) {
    this.#degree = clone(degree);
    this.#slice = slice;
  }

  clone(): Twist<S> {
    return new Twist(this);
  }

  power(exp: number): Twist<S> {
    this.#degree = mapValues(this.#degree, (degree) => degree && degree * exp);

    return this;
  }
}
