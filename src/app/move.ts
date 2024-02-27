import { cloneDeep, uniqueId } from 'lodash';
import { baseMoves } from './baseMoves';
import { Permutation } from './permutation';
import { BaseMove, MoveDomain } from './rubik';

export class Move {
  readonly domain: MoveDomain;
  readonly id: string = uniqueId();
  readonly permutation: Permutation;

  get size(): number {
    return 9 * Object.keys(this.domain.exp).length;
  }

  constructor(name: `${BaseMove}`) {
    const { domain, cycles } = baseMoves[name];

    this.domain = cloneDeep(domain);
    this.permutation = new Permutation(27 * 6).setFromCycles(cycles);
  }
}
