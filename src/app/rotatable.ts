import { HostListener, Injectable } from '@angular/core';
import { Vector3 } from 'three';
import { Rotation3 } from './rotation';

@Injectable()
export class RotatableComponent {
  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDownOrTouchStart(event: MouseEvent | TouchEvent): void {
    this.free = true;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    delete this.free;
  }

  @HostListener('touchcancel', ['$event'])
  onTouchcancel(event: TouchEvent): void {
    delete this.free;

    delete this.previousTouch;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.rotate(event.movementX, event.movementY);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];

    if (this.previousTouch != null) {
      this.rotate(
        touch.screenX - this.previousTouch.screenX,
        touch.screenY - this.previousTouch.screenY
      );
    }

    this.previousTouch = touch;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    delete this.free;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    delete this.free;

    delete this.previousTouch;
  }

  private free?: boolean;

  private previousTouch?: Touch;

  protected readonly rotation: Rotation3 = new Rotation3()
    .applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 4)
    .applyAxisAngle(new Vector3(1, 0, 0), -Math.PI / 4);

  private rotate(movementX: number, movementY: number): void {
    if (this.free) {
      const axis = new Vector3(-movementY, movementX, 0);

      this.rotation.applyAxisAngle(axis, axis.length() / 80);
    }
  }
}
