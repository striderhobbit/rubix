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

  constructor(name: BaseMove) {
    const { permutation, twist } = baseMoves[name];

    this.permutation = permutation.clone();
    this.twist = twist.clone();
  }

  exp(cubicle: Cubicle): number {
    switch (this.twist.slice) {
      case 'x':
        return this.twist.degree[cubicle.slices[0]] ?? 0;
      case 'y':
        return this.twist.degree[cubicle.slices[1]] ?? 0;
      case 'z':
        return this.twist.degree[cubicle.slices[2]] ?? 0;
    }
  }
}
