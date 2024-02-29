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
import { Rotation3 } from './rotation';
import { SLICES, Slice } from './twist';

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

      this.rotation.applyAxisAngle(axis, axis.length() / 80);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    delete this.free;
  }

  protected readonly animations: Subject<string> = new Subject();

  protected readonly cubicles: Cubicle[] = times(3)
    .flatMap((x) =>
      times(3).flatMap((y) => times(3).map((z) => new Vector3(x, y, z)))
    )
    .map((coords, i) => new Cubicle({ coords, index: 6 * i }));

  private free?: boolean;

  protected move?: Move;

  private readonly moves: Subject<Move> = new Subject();

  protected readonly permutation: Permutation<Slice | undefined> =
    new Permutation(
      Object.values(this.cubicles).flatMap((cubicle) =>
        SLICES.map((SLICE) => cubicle.slices.find((slice) => slice === SLICE))
      )
    );

  protected readonly rotation: Rotation3 = new Rotation3()
    .applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 4)
    .applyAxisAngle(new Vector3(1, 0, 0), -Math.PI / 4);

  protected readonly SLICES = SLICES;

  protected readonly times = times;

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
