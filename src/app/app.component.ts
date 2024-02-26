import { Component, HostBinding, HostListener } from '@angular/core';
import { times } from 'lodash';
import {
  Subject,
  animationFrameScheduler,
  concat,
  concatMap,
  defer,
  filter,
  finalize,
  scheduled,
  take,
} from 'rxjs';
import { Vector3 } from 'three';
import { Cubicle } from './cubicle';
import { Move } from './move';
import { Permutation } from './permutation';
import { Rotation } from './rotation';

type CubeFace = 'back' | 'down' | 'front' | 'left' | 'right' | 'up';

export type CubeSliceX = 'L' | 'M' | 'R';
export type CubeSliceY = 'U' | 'E' | 'D';
export type CubeSliceZ = 'B' | 'S' | 'F';

export type CubeSlice = CubeSliceX | CubeSliceY | CubeSliceZ;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('attr.animated-slices')
  get animatedSlices(): string | undefined {
    if (this.move != null) {
      return Object.keys(this.move.domain.directions).join(' ');
    }

    return;
  }

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

      this.rotation.applyAxisAngle({
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

  private moves: Subject<Move> = new Subject();

  protected animations: Subject<string> = new Subject();

  protected cubicles: Cubicle[] = times(3)
    .flatMap((x) =>
      times(3).flatMap((y) => times(3).map((z) => new Vector3(x, y, z)))
    )
    .map((vector, i) => new Cubicle({ vector, index: 6 * i }));

  protected faces: CubeFace[] = Array(27)
    .fill(['back', 'down', 'front', 'left', 'right', 'up'])
    .flat();

  protected move?: Move;

  protected permutation: Permutation = new Permutation(27 * 6);

  protected rotation: Rotation = new Rotation()
    .rotateY(-Math.PI / 4)
    .rotateX(-Math.PI / 4);

  protected times = times;

  constructor() {
    this.moves
      .pipe(
        concatMap((move) => {
          delete this.move;

          return scheduled(
            concat(
              defer(async () => (this.move = move)),
              this.animations.pipe(
                filter((id) => move.id === id),
                take(move.size),
                finalize(() => this.permutation.apply(move.permutation))
              )
            ),
            animationFrameScheduler
          );
        })
      )
      .subscribe();

    this.moves.next(new Move('U'));
    this.moves.next(new Move("E'"));
    this.moves.next(new Move('M'));
  }
}
