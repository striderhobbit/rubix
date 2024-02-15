import { at, pull, times } from 'lodash';

export class Permutation {
  #map: number[];

  get n(): number {
    return this.#map.length;
  }

  constructor(map: number | number[]) {
    if (typeof map === 'number') {
      map = times(map);
    }

    this.#map = map.slice();
  }

  apply(permutation: Permutation): Permutation {
    this.#map = at(permutation.#map, this.#map);

    return this;
  }

  static fromDisjointCycles(cycles: string, n: number): Permutation {
    return new Permutation(
      Array.from(cycles.matchAll(/\((\d+(\s+\d+)*)\)/g))
        .map(([_, cycle]) => cycle.split(/\s+/).map(Number))
        .reduce((map, cycle) => {
          cycle.forEach((x, i) => (map[x] = cycle[(i + 1) % cycle.length]));

          return map;
        }, times(n))
    );
  }

  image(x: number): number {
    return this.#map[x];
  }

  inverse(): Permutation {
    return new Permutation(
      this.#map.reduce(
        (inverse, y, x) => Object.assign(inverse, { [y]: x }),
        Array(this.n)
      )
    );
  }

  preimage(y: number): number {
    return this.#map.indexOf(y);
  }

  toDisjointCycles(): string {
    const domain = times(this.n);
    const cycles: number[][] = [];

    while (domain.length) {
      let next: number;
      const cycle: number[] = [(next = domain[0])];

      while (cycle[0] !== (next = this.image(next))) {
        cycle.push(next);
      }

      pull(domain, ...cycle);

      if (cycle.length > 1) {
        cycles.push(cycle);
      }
    }

    return cycles.map((cycle) => `(${cycle.join(' ')})`).join('');
  }
}
