import { Component, HostListener } from '@angular/core';
import { Vector3 } from 'three';
import { Rotation3 } from './rotation';

@Component({
  template: '',
})
export class MouseRotatableComponent {
  @HostListener('mousedown')
  onMouseDown(): void {
    this.free = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    delete this.free;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.rotate(event.movementX, event.movementY);
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    delete this.free;
  }

  protected free?: boolean;

  protected readonly rotation: Rotation3 = new Rotation3()
    .applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 4)
    .applyAxisAngle(new Vector3(1, 0, 0), -Math.PI / 4);

  protected rotate(movementX: number, movementY: number): void {
    if (this.free) {
      const axis = new Vector3(-movementY, movementX, 0);

      this.rotation.applyAxisAngle(axis, axis.length() / 80);
    }
  }
}
