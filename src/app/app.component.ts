import { Component } from '@angular/core';
import { Quaternion, Vector3 } from 'three';

type Face = 'back' | 'down' | 'front' | 'left' | 'right' | 'up';

interface Cubicle {
  x: number;
  y: number;
  z: number;
  faces: Face[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected cubicles: Cubicle[] = [
    { x: 0, y: 0, z: -1, faces: ['left', 'up', 'back'] },
    { x: 0, y: 0, z: 0, faces: ['left', 'up'] },
    { x: 0, y: 0, z: 1, faces: ['left', 'up', 'front'] },
    { x: 0, y: 1, z: -1, faces: ['left', 'back'] },
    { x: 0, y: 1, z: 0, faces: ['left'] },
    { x: 0, y: 1, z: 1, faces: ['left', 'front'] },
    { x: 0, y: 2, z: -1, faces: ['left', 'down', 'back'] },
    { x: 0, y: 2, z: 0, faces: ['left', 'down'] },
    { x: 0, y: 2, z: 1, faces: ['left', 'down', 'front'] },
    { x: 1, y: 0, z: -1, faces: ['up', 'back'] },
    { x: 1, y: 0, z: 0, faces: ['up'] },
    { x: 1, y: 0, z: 1, faces: ['up', 'front'] },
    { x: 1, y: 1, z: -1, faces: ['back'] },
    { x: 1, y: 1, z: 0, faces: [] },
    { x: 1, y: 1, z: 1, faces: ['front'] },
    { x: 1, y: 2, z: -1, faces: ['down', 'back'] },
    { x: 1, y: 2, z: 0, faces: ['down'] },
    { x: 1, y: 2, z: 1, faces: ['down', 'front'] },
    { x: 2, y: 0, z: -1, faces: ['right', 'up', 'back'] },
    { x: 2, y: 0, z: 0, faces: ['right', 'up'] },
    { x: 2, y: 0, z: 1, faces: ['right', 'up', 'front'] },
    { x: 2, y: 1, z: -1, faces: ['right', 'back'] },
    { x: 2, y: 1, z: 0, faces: ['right'] },
    { x: 2, y: 1, z: 1, faces: ['right', 'front'] },
    { x: 2, y: 2, z: -1, faces: ['right', 'down', 'back'] },
    { x: 2, y: 2, z: 0, faces: ['right', 'down'] },
    { x: 2, y: 2, z: 1, faces: ['right', 'down', 'front'] },
  ];

  private movementStartX?: number;
  private movementStartY?: number;
  private rotationQuaternion: Quaternion = new Quaternion();

  get rotateX(): number {
    return this.rotationQuaternion.x / Math.sin(this.rotationQuaternion.w / 2);
  }

  get rotateY(): number {
    return this.rotationQuaternion.y / Math.sin(this.rotationQuaternion.w / 2);
  }

  get rotateZ(): number {
    return this.rotationQuaternion.z / Math.sin(this.rotationQuaternion.w / 2);
  }

  get rotateA(): number {
    return 2 * Math.acos(this.rotationQuaternion.w);
  }

  protected onMouseDown(event: MouseEvent): void {
    this.movementStartX = event.screenX;
    this.movementStartY = event.screenY;
  }

  protected onMouseLeave(event: MouseEvent): void {
    delete this.movementStartX;
    delete this.movementStartY;
  }

  protected onMouseUp(event: MouseEvent): void {
    this.rotateTo(event.screenX, event.screenY);
  }

  private rotateTo(movementEndX: number, movementEndY: number): void {
    if (this.movementStartX != null && this.movementStartY != null) {
      const movementX = movementEndX - this.movementStartX;
      const movementY = movementEndY - this.movementStartY;

      const movement = new Vector3(-movementY, movementX, 0);

      this.rotationQuaternion.premultiply(
        new Quaternion().setFromAxisAngle(
          movement.clone().normalize(),
          movement.length() / 500
        )
      );
    }
  }
}
