import { cloneDeep, uniqueId } from 'lodash';
import { baseMoves } from './baseMoves';
import { Permutation } from './permutation';
import { BaseMove, Twist } from './rubik';

export class Move {
  readonly id: string = uniqueId();
  readonly permutation: Permutation;
  readonly twist: Twist;

  get size(): number {
    return 9 * Object.keys(this.twist.degree).length;
  }

  constructor(name: `${BaseMove}`) {
    const { cycles, twist } = baseMoves[name];

    this.permutation = new Permutation(27 * 6).setFromCycles(cycles);
    this.twist = cloneDeep(twist);
  }
}
