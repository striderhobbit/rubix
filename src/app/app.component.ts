import { Component, HostBinding } from '@angular/core';
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
import { RotatableComponent } from './rotatable';
import { SLICES, Slice } from './twist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends RotatableComponent {
  @HostBinding('attr.twist-axis')
  get twistAxis(): string | undefined {
    return this.move?.twist.axis;
  }

  protected readonly animations: Subject<string> = new Subject();

  protected readonly cubicles: Cubicle[] = times(3)
    .flatMap((x) =>
      times(3).flatMap((y) => times(3).map((z) => new Vector3(x, y, z)))
    )
    .map((coords, i) => new Cubicle({ coords, index: 6 * i }));

  protected move?: Move;

  private readonly moves: Subject<Move> = new Subject();

  protected readonly permutation: Permutation<Slice | undefined> =
    new Permutation(
      Object.values(this.cubicles).flatMap((cubicle) =>
        SLICES.map((SLICE) => cubicle.slices.find((slice) => slice === SLICE))
      )
    );

  protected readonly SLICES = SLICES;

  protected readonly times = times;

  constructor() {
    super();

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
