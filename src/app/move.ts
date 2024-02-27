import { uniqueId } from 'lodash';
import { baseMoves } from './baseMoves';
import { Cubicle } from './cubicle';
import { Permutation } from './permutation';
import { BaseMove } from './rubik';
import { Twist } from './twist';

export class Move {
  readonly id: string = uniqueId();
  readonly permutation: Permutation;
  readonly twist: Twist;

  constructor({ key, exp = 1 }: { key: BaseMove; exp?: number }) {
    const move = baseMoves[key];

    this.permutation = move.permutation.clone().pow(exp);
    this.twist = move.twist.clone().pow(exp);
  }

  order({ vector }: Cubicle): number {
    return (
      this.twist.orders[
        {
          x: ['L' as const, 'M' as const, 'R' as const],
          y: ['U' as const, 'E' as const, 'D' as const],
          z: ['B' as const, 'S' as const, 'F' as const],
        }[this.twist.axis][vector[this.twist.axis]]
      ] ?? 0
    );
  }
}
