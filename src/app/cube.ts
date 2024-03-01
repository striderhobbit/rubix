import { times } from 'lodash';
import { Vector3 } from 'three';
import { Cubicle } from './cubicle';
import { Permutation } from './permutation';
import { Slice } from './twist';

export class Cube {
  readonly cubicles: Cubicle[] = times(3)
    .flatMap((x) =>
      times(3).flatMap((y) => times(3).map((z) => new Vector3(x, y, z)))
    )
    .map((coords, i) => new Cubicle({ coords, index: 6 * i }));

  readonly slices: Slice[] = ['B', 'D', 'F', 'L', 'R', 'U'];

  readonly permutation: Permutation<Slice | undefined> = new Permutation(
    Object.values(this.cubicles).flatMap((cubicle) =>
      this.slices.map((slice) => cubicle.slices.find((s) => s === slice))
    )
  );
}
