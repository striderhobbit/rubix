import { Component, HostBinding, HostListener } from '@angular/core';
import { intersection, mapValues, times } from 'lodash';
import { Subject, concatMap, take, tap, toArray } from 'rxjs';
import { Quaternion, Vector3 } from 'three';
import { Cubicle } from './cubicle';
import { Permutation } from './permutation';
import { Rotation } from './rotation';

type Face = 'back' | 'down' | 'front' | 'left' | 'right' | 'up';

export type Layer = 'B' | 'D' | 'E' | 'F' | 'L' | 'M' | 'R' | 'S' | 'U';

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

  private moves: Subject<Layer> = new Subject();

  private permutations: Record<Layer, Permutation> = mapValues(
    {
      B: '(0 36 144 108)(1 40 149 111)(2 38 146 110)(3 37 148 113)(4 41 147 109)(5 39 145 112)(18 90 126 54)(19 94 131 57)(20 92 128 56)(21 91 130 59)(22 95 129 55)(23 93 127 58)',
      D: '(36 51 158 148)(37 49 157 145)(38 52 156 147)(39 50 160 144)(40 48 159 146)(41 53 161 149)(42 105 152 94)(43 103 151 91)(44 106 150 93)(45 104 154 90)(46 102 153 92)(47 107 155 95)',
      E: '(18 33 140 130)(19 31 139 127)(20 34 138 129)(21 32 142 126)(22 30 141 128)(23 35 143 131)(24 87 134 76)(25 85 133 73)(26 88 132 75)(27 86 136 72)(28 84 135 74)(29 89 137 77)',
      F: '(12 120 156 48)(13 123 161 52)(14 122 158 50)(15 125 160 49)(16 121 159 53)(17 124 157 51)(30 66 138 102)(31 69 143 106)(32 68 140 104)(33 71 142 103)(34 67 141 107)(35 70 139 105)',
      L: '(0 17 50 37)(1 12 53 38)(2 13 48 41)(3 15 51 39)(4 16 52 40)(5 14 49 36)(6 35 44 19)(7 30 47 20)(8 31 42 23)(9 33 45 21)(10 34 46 22)(11 32 43 18)',
      M: '(54 71 104 91)(55 66 107 92)(56 67 102 95)(57 69 105 93)(58 70 106 94)(59 68 103 90)(60 89 98 73)(61 84 101 74)(62 85 96 77)(63 87 99 75)(64 88 100 76)(65 86 97 72)',
      R: '(108 145 158 125)(109 146 161 120)(110 149 156 121)(111 147 159 123)(112 148 160 124)(113 144 157 122)(114 127 152 143)(115 128 155 138)(116 131 150 139)(117 129 153 141)(118 130 154 142)(119 126 151 140)',
      S: '(6 114 150 42)(7 117 155 46)(8 116 152 44)(9 119 154 43)(10 115 153 47)(11 118 151 45)(24 60 132 96)(25 63 137 100)(26 62 134 98)(27 65 136 97)(28 61 135 101)(29 64 133 99)',
      U: '(0 112 122 15)(1 109 121 13)(2 111 120 16)(3 108 124 14)(4 110 123 12)(5 113 125 17)(6 58 116 69)(7 55 115 67)(8 57 114 70)(9 54 118 68)(10 56 117 66)(11 59 119 71)',
    },
    (cycles) => new Permutation(27 * 6).setFromCycles(cycles)
  );

  protected animations: Subject<Layer[]> = new Subject();

  protected cubicles: Cubicle[] = times(3)
    .flatMap((x) => times(3).flatMap((y) => times(3).map((z) => ({ x, y, z }))))
    .map((coords, i) => new Cubicle({ coords, index: 6 * i }));

  protected faces: Face[] = Array(27)
    .fill(['back', 'down', 'front', 'left', 'right', 'up'])
    .flat();

  protected permutation: Permutation = new Permutation(27 * 6);

  protected rotation: Rotation = ((a: number): Rotation => {
    const x = -Math.sin(a) / 2,
      y = x,
      z = Math.sin(a / 2) ** 2,
      w = Math.cos(a / 2) ** 2;

    return new Rotation().setFromQuaternion(new Quaternion(x, y, z, w));
  })(Math.PI / 4);

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

    console.log(this.rotation);

    this.moves.next('M');
    this.moves.next('E');
    this.moves.next('S');
    this.moves.next('R');
    this.moves.next('U');
    this.moves.next('F');
  }
}
