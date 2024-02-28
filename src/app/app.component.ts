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
import { Permutation, SimplePermutation } from './permutation';
import { Rotation } from './rotation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('attr.twist-axis')
  get twistAxis(): string | undefined {
    return this.move?.twist.axis;
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
    .map((coords, i) => new Cubicle({ coords, index: 6 * i }));

  protected move?: Move;

  protected permutation: SimplePermutation = new Permutation([
    0, 6, 6, 3, 6, 5, 6, 6, 6, 3, 6, 5, 6, 6, 2, 3, 6, 5, 0, 6, 6, 3, 6, 6, 6,
    6, 6, 3, 6, 6, 6, 6, 2, 3, 6, 6, 0, 1, 6, 3, 6, 6, 6, 1, 6, 3, 6, 6, 6, 1,
    2, 3, 6, 6, 0, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 5, 6, 6, 2, 6, 6, 5, 0, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 6, 6, 6, 0, 1, 6, 6, 6, 6, 6, 1, 6, 6,
    6, 6, 6, 1, 2, 6, 6, 6, 0, 6, 6, 6, 4, 5, 6, 6, 6, 6, 4, 5, 6, 6, 2, 6, 4,
    5, 0, 6, 6, 6, 4, 6, 6, 6, 6, 6, 4, 6, 6, 6, 2, 6, 4, 6, 0, 1, 6, 6, 4, 6,
    6, 1, 6, 6, 4, 6, 6, 1, 2, 6, 4, 6,
  ]);

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
                take(27),
                finalize(() => this.permutation.apply(move.permutation))
              )
            ),
            animationFrameScheduler
          );
        })
      )
      .subscribe();

    this.moves.next(new Move({ key: 'R', exp: -2 }));
    this.moves.next(new Move({ key: 'l', exp: 1 }));
    this.moves.next(new Move({ key: 'u', exp: 1 }));
  }
}
