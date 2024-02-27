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

  constructor({ key, order = 1 }: { key: BaseMove; order?: number }) {
    const { permutation, twist } = baseMoves[key];

    this.permutation = permutation.clone().pow(order);
    this.twist = twist.clone().pow(order);
  }

  order(cubicle: Cubicle): number {
    switch (this.twist.axis) {
      case 'x':
        return this.twist.degree[cubicle.slices[0]] ?? 0;
      case 'y':
        return this.twist.degree[cubicle.slices[1]] ?? 0;
      case 'z':
        return this.twist.degree[cubicle.slices[2]] ?? 0;
    }
  }
}
