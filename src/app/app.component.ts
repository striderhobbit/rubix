import { Component, HostBinding, HostListener } from '@angular/core';
import { at, clone, intersection, times } from 'lodash';
import { Subject, concatMap, take, tap, toArray } from 'rxjs';
import { Quaternion, Vector3 } from 'three';

type Face = 'back' | 'down' | 'front' | 'left' | 'right' | 'up';
type Layer = 'B' | 'D' | 'E' | 'F' | 'L' | 'M' | 'R' | 'S' | 'U';

interface Coords3 {
  x: number;
  y: number;
  z: number;
}

class Cubicle {
  #coords: Coords3;
  #index: number;
  #layers: Layer[];

  get classList(): string {
    return ['cubicle']
      .concat(this.#layers.map((layer) => `cubicle__layer--${layer}`))
      .join(' ');
  }

  get index(): number {
    return this.#index;
  }

  get layers(): Layer[] {
    return this.#layers.slice();
  }

  get x(): number {
    return this.#coords.x;
  }

  get y(): number {
    return this.#coords.y;
  }

  get z(): number {
    return this.#coords.z;
  }

  constructor({ coords, index }: { coords: Coords3; index: number }) {
    this.#coords = clone(coords);
    this.#index = index;
    this.#layers = [
      { 0: 'L' as const, 1: 'M' as const, 2: 'R' as const }[coords.x]!,
      { 0: 'U' as const, 1: 'E' as const, 2: 'D' as const }[coords.y]!,
      { 0: 'B' as const, 1: 'S' as const, 2: 'F' as const }[coords.z]!,
    ];
  }
}

class Permutation {
  #map: number[];

  constructor(map: number | number[]) {
    if (typeof map === 'number') {
      map = times(map);
    }

    this.#map = map.slice();
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

  apply(permutation: Permutation): Permutation {
    this.#map = at(permutation.#map, this.#map);

    return this;
  }

  image(x: number): number {
    return this.#map[x];
  }

  inverse(): Permutation {
    return new Permutation(
      this.#map.reduce(
        (inverse, y, x) => Object.assign(inverse, { [y]: x }),
        Array(this.#map.length)
      )
    );
  }

  preimage(y: number): number {
    return this.#map.indexOf(y);
  }
}

interface AxialRotation {
  axis: Vector3;
  angle: number;
}

class Rotation {
  #axialRotation: AxialRotation;
  #quaternion: Quaternion;

  get axisX(): number {
    return this.#axialRotation.axis.x;
  }

  get axisY(): number {
    return this.#axialRotation.axis.y;
  }

  get axisZ(): number {
    return this.#axialRotation.axis.z;
  }

  get angle(): number {
    return this.#axialRotation.angle;
  }

  constructor(axialRotation?: AxialRotation) {
    this.#quaternion = new Quaternion();

    if (axialRotation != null) {
      this.#quaternion.setFromAxisAngle(
        axialRotation.axis,
        axialRotation.angle
      );
    }

    this.#axialRotation = this.#toAxialRotation();
  }

  apply(axialRotation: AxialRotation): Rotation {
    this.#quaternion.premultiply(
      new Quaternion().setFromAxisAngle(
        axialRotation.axis.clone().normalize(),
        axialRotation.angle
      )
    );

    this.#axialRotation = this.#toAxialRotation();

    return this;
  }

  #toAxialRotation(): AxialRotation {
    const axis = new Vector3(
      this.#quaternion.x,
      this.#quaternion.y,
      this.#quaternion.z
    );

    const angle = 2 * Math.atan2(axis.length(), this.#quaternion.w);

    return {
      axis: angle != 0 ? axis.divideScalar(Math.sin(angle / 2)) : new Vector3(),
      angle,
    };
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('attr.data-move') move?: Layer;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.free = true;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    delete this.free;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.free) {
      const axis = new Vector3(-event.movementY, event.movementX, 0);

      this.rotation.apply({
        axis,
        angle: axis.length() / 80,
      });
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    delete this.free;
  }

  private free?: boolean;

  private moves: Subject<Layer> = new Subject();

  private permutations: Record<Layer, Permutation> = {
    B: new Permutation([
      36, 40, 38, 37, 41, 39, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 90,
      94, 92, 91, 95, 93, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 144,
      148, 146, 145, 149, 147, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
      18, 22, 20, 19, 23, 21, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
      72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      126, 130, 128, 127, 131, 129, 96, 97, 98, 99, 100, 101, 102, 103, 104,
      105, 106, 107, 0, 4, 2, 1, 5, 3, 114, 115, 116, 117, 118, 119, 120, 121,
      122, 123, 124, 125, 54, 58, 56, 55, 59, 57, 132, 133, 134, 135, 136, 137,
      138, 139, 140, 141, 142, 143, 108, 112, 110, 109, 113, 111, 150, 151, 152,
      153, 154, 155, 156, 157, 158, 159, 160, 161,
    ]),
    D: new Permutation([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 51, 49, 52,
      50, 48, 53, 105, 103, 106, 104, 102, 107, 159, 157, 160, 158, 156, 161,
      54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
      72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      45, 43, 46, 44, 42, 47, 96, 97, 98, 99, 100, 101, 153, 151, 154, 152, 150,
      155, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
      122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136,
      137, 138, 139, 140, 141, 142, 143, 39, 37, 40, 38, 36, 41, 93, 91, 94, 92,
      90, 95, 147, 145, 148, 146, 144, 149,
    ]),
    E: new Permutation([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 33, 31, 34,
      32, 30, 35, 87, 85, 88, 86, 84, 89, 141, 139, 142, 140, 138, 143, 36, 37,
      38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
      56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 27, 25,
      28, 26, 24, 29, 78, 79, 80, 81, 82, 83, 135, 133, 136, 134, 132, 137, 90,
      91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
      107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
      122, 123, 124, 125, 21, 19, 22, 20, 18, 23, 75, 73, 76, 74, 72, 77, 129,
      127, 130, 128, 126, 131, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,
      154, 155, 156, 157, 158, 159, 160, 161,
    ]),
    F: new Permutation([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 120, 123, 122, 125, 121, 124, 18,
      19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 66, 69, 68, 71, 67, 70, 36,
      37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 12, 15, 14, 17, 13, 16, 54,
      55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 138, 141, 140, 143, 139, 142,
      72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 30, 33, 32, 35, 31, 34,
      108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 156, 159, 158,
      161, 157, 160, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137,
      102, 105, 104, 107, 103, 106, 144, 145, 146, 147, 148, 149, 150, 151, 152,
      153, 154, 155, 48, 51, 50, 53, 49, 52,
    ]),
    L: new Permutation([
      17, 12, 13, 15, 16, 14, 35, 30, 31, 33, 34, 32, 53, 48, 49, 51, 52, 50,
      11, 6, 7, 9, 10, 8, 24, 25, 26, 27, 28, 29, 47, 42, 43, 45, 46, 44, 5, 0,
      1, 3, 4, 2, 23, 18, 19, 21, 22, 20, 41, 36, 37, 39, 40, 38, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
      75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
      93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
      109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
      124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
      139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,
      154, 155, 156, 157, 158, 159, 160, 161,
    ]),
    M: new Permutation([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 71, 66, 67,
      69, 70, 68, 89, 84, 85, 87, 88, 86, 107, 102, 103, 105, 106, 104, 65, 60,
      61, 63, 64, 62, 78, 79, 80, 81, 82, 83, 101, 96, 97, 99, 100, 98, 59, 54,
      55, 57, 58, 56, 77, 72, 73, 75, 76, 74, 95, 90, 91, 93, 94, 92, 108, 109,
      110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124,
      125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
      140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154,
      155, 156, 157, 158, 159, 160, 161,
    ]),
    R: new Permutation([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
      75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
      93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 145,
      146, 149, 147, 148, 144, 127, 128, 131, 129, 130, 126, 109, 110, 113, 111,
      112, 108, 151, 152, 155, 153, 154, 150, 132, 133, 134, 135, 136, 137, 115,
      116, 119, 117, 118, 114, 157, 158, 161, 159, 160, 156, 139, 140, 143, 141,
      142, 138, 121, 122, 125, 123, 124, 120,
    ]),
    S: new Permutation([
      0, 1, 2, 3, 4, 5, 114, 117, 116, 119, 115, 118, 12, 13, 14, 15, 16, 17,
      18, 19, 20, 21, 22, 23, 60, 63, 62, 65, 61, 64, 30, 31, 32, 33, 34, 35,
      36, 37, 38, 39, 40, 41, 6, 9, 8, 11, 7, 10, 48, 49, 50, 51, 52, 53, 54,
      55, 56, 57, 58, 59, 132, 135, 134, 137, 133, 136, 66, 67, 68, 69, 70, 71,
      72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      90, 91, 92, 93, 94, 95, 24, 27, 26, 29, 25, 28, 102, 103, 104, 105, 106,
      107, 108, 109, 110, 111, 112, 113, 150, 153, 152, 155, 151, 154, 120, 121,
      122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 96, 99, 98, 101, 97,
      100, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 42, 45,
      44, 47, 43, 46, 156, 157, 158, 159, 160, 161,
    ]),
    U: new Permutation([
      112, 109, 111, 108, 110, 113, 58, 55, 57, 54, 56, 59, 4, 1, 3, 0, 2, 5,
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
      118, 115, 117, 114, 116, 119, 60, 61, 62, 63, 64, 65, 10, 7, 9, 6, 8, 11,
      72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
      107, 124, 121, 123, 120, 122, 125, 70, 67, 69, 66, 68, 71, 16, 13, 15, 12,
      14, 17, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
      139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,
      154, 155, 156, 157, 158, 159, 160, 161,
    ]),
  };

  protected animations: Subject<Layer[]> = new Subject();

  protected cubicles: Cubicle[] = times(3)
    .flatMap((x) => times(3).flatMap((y) => times(3).map((z) => ({ x, y, z }))))
    .map((coords, i) => new Cubicle({ coords, index: 6 * i }));

  protected faces: Face[] = Array(27)
    .fill(['back', 'down', 'front', 'left', 'right', 'up'])
    .flat();

  protected permutation: Permutation = new Permutation(27 * 6);

  protected rotation: Rotation = new Rotation()
    .apply({
      axis: new Vector3(0, 1, 0),
      angle: -Math.PI / 4,
    })
    .apply({
      axis: new Vector3(1, 0, 0),
      angle: -Math.PI / 4,
    });

  protected times = times;

  constructor() {
    this.moves
      .pipe(
        concatMap((move) => {
          this.move = move;

          return this.animations.pipe(
            take(9),
            toArray(),
            tap((layers) =>
              this.permutation.apply(
                this.permutations[intersection(...layers)[0]]
              )
            )
          );
        })
      )
      .subscribe();

    this.moves.next('M');
    this.moves.next('E');
    this.moves.next('S');
    this.moves.next('R');
    this.moves.next('U');
    this.moves.next('F');
  }
}
