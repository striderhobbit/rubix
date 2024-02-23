import { at, isEqual, pull, sortBy, times } from 'lodash';

export class Permutation {
  #map: number[];

  constructor(public n: number) {
    this.#map = times(n);
  }

  apply(permutation: Permutation): Permutation {
    this.#map = at(permutation.#map, this.#map);

    return this;
  }

  identity(): Permutation {
    return new Permutation(this.n);
  }

  inverse(): Permutation {
    return this.identity().setFromArray(
      this.#map.reduce(
        (map, y, x) => Object.assign(map, { [y]: x }),
        Array(this.n)
      )
    );
  }

  map(x: number): number {
    return this.#map[x];
  }

  pull(y: number): number {
    return this.#map.indexOf(y);
  }

  setFromArray(map: number[]): Permutation {
    if (!isEqual(sortBy(map), times(this.n))) {
      throw new Error(
        `map ${JSON.stringify(map)} is not an element of S(${this.n})`
      );
    }

    this.#map = map.slice();

    return this;
  }

  setFromCycles(cycles: string): Permutation {
    return Array.from(cycles.matchAll(/\((\d+(\s+\d+)*)\)/g))
      .map(([_, cycle]) => cycle.split(/\s+/).map(Number))
      .reduce((permutation, cycle) => {
        return permutation.apply(
          this.identity().setFromArray(
            cycle.reduce(
              (map, x, i) =>
                Object.assign(map, {
                  [x]: cycle[(i + 1) % cycle.length],
                }),
              times(this.n)
            )
          )
        );
      }, this.identity());
  }

  toDisjointCycles(): string {
    const domain = times(this.n);
    const cycles: number[][] = [];

    while (domain.length) {
      let x: number;
      const cycle = [(x = domain[0])];

      while (cycle[0] !== (x = this.map(x))) {
        cycle.push(x);
      }

      pull(domain, ...cycle);

      if (cycle.length > 1) {
        cycles.push(cycle);
      }
    }

    return cycles.map((cycle) => `(${cycle.join(' ')})`).join('');
  }
}
