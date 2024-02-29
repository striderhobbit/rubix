import { uniqueId } from 'lodash';
import { BaseMove, baseMoves } from './baseMoves';
import { Cubicle } from './cubicle';
import { SimplePermutation } from './permutation';
import { Twist } from './twist';

export class Move {
  readonly id: string = uniqueId();
  readonly permutation: SimplePermutation;
  readonly twist: Twist;

  constructor({ key, exp = 1 }: { key: BaseMove; exp?: number }) {
    const move = baseMoves[key];

    this.permutation = move.permutation.clone().pow(exp);
    this.twist = move.twist.clone().pow(exp);
  }

  twistOrder(cubicle: Cubicle): number | undefined {
    return this.twist.orders[cubicle.pick(this.twist.axis)];
  }
}
