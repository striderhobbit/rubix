import { Component } from '@angular/core';
import { Quaternion, Vector3 } from 'three';

type Face = 'back' | 'down' | 'front' | 'left' | 'right' | 'up';

interface Cubicle {
  index: number;
  coords: {
    x: number;
    y: number;
    z: number;
  };
  faces: Face[];
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

  append(axialRotation: AxialRotation): void {
    this.#quaternion.premultiply(
      new Quaternion().setFromAxisAngle(
        axialRotation.axis.clone().normalize(),
        axialRotation.angle
      )
    );

    this.#axialRotation = this.#toAxialRotation();
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
  private free?: boolean;

  protected faces: Face[] = Array(27)
    .fill(['back', 'down', 'front', 'left', 'right', 'up'])
    .flat();

  protected cubicles: Cubicle[] = [
    { index: 0, coords: { x: 0, y: 0, z: -1 }, faces: ['left', 'up', 'back'] },
    { index: 6, coords: { x: 0, y: 0, z: 0 }, faces: ['left', 'up'] },
    { index: 12, coords: { x: 0, y: 0, z: 1 }, faces: ['left', 'up', 'front'] },
    { index: 18, coords: { x: 0, y: 1, z: -1 }, faces: ['left', 'back'] },
    { index: 24, coords: { x: 0, y: 1, z: 0 }, faces: ['left'] },
    { index: 30, coords: { x: 0, y: 1, z: 1 }, faces: ['left', 'front'] },
    {
      index: 36,
      coords: { x: 0, y: 2, z: -1 },
      faces: ['left', 'down', 'back'],
    },
    { index: 42, coords: { x: 0, y: 2, z: 0 }, faces: ['left', 'down'] },
    {
      index: 48,
      coords: { x: 0, y: 2, z: 1 },
      faces: ['left', 'down', 'front'],
    },
    { index: 54, coords: { x: 1, y: 0, z: -1 }, faces: ['up', 'back'] },
    { index: 60, coords: { x: 1, y: 0, z: 0 }, faces: ['up'] },
    { index: 66, coords: { x: 1, y: 0, z: 1 }, faces: ['up', 'front'] },
    { index: 72, coords: { x: 1, y: 1, z: -1 }, faces: ['back'] },
    { index: 78, coords: { x: 1, y: 1, z: 0 }, faces: [] },
    { index: 84, coords: { x: 1, y: 1, z: 1 }, faces: ['front'] },
    { index: 90, coords: { x: 1, y: 2, z: -1 }, faces: ['down', 'back'] },
    { index: 96, coords: { x: 1, y: 2, z: 0 }, faces: ['down'] },
    { index: 102, coords: { x: 1, y: 2, z: 1 }, faces: ['down', 'front'] },
    {
      index: 108,
      coords: { x: 2, y: 0, z: -1 },
      faces: ['right', 'up', 'back'],
    },
    { index: 114, coords: { x: 2, y: 0, z: 0 }, faces: ['right', 'up'] },
    {
      index: 120,
      coords: { x: 2, y: 0, z: 1 },
      faces: ['right', 'up', 'front'],
    },
    { index: 126, coords: { x: 2, y: 1, z: -1 }, faces: ['right', 'back'] },
    { index: 132, coords: { x: 2, y: 1, z: 0 }, faces: ['right'] },
    { index: 138, coords: { x: 2, y: 1, z: 1 }, faces: ['right', 'front'] },
    {
      index: 144,
      coords: { x: 2, y: 2, z: -1 },
      faces: ['right', 'down', 'back'],
    },
    { index: 150, coords: { x: 2, y: 2, z: 0 }, faces: ['right', 'down'] },
    {
      index: 156,
      coords: { x: 2, y: 2, z: 1 },
      faces: ['right', 'down', 'front'],
    },
  ];

  protected rotation: Rotation = new Rotation();

  protected onMouseDown(event: MouseEvent): void {
    this.free = true;
  }

  protected onMouseLeave(event: MouseEvent): void {
    delete this.free;
  }

  protected onMouseMove(event: MouseEvent): void {
    if (this.free) {
      const axis = new Vector3(-event.movementY, event.movementX, 0);

      this.rotation.append({
        axis,
        angle: axis.length() / 100,
      });
    }
  }

  protected onMouseUp(event: MouseEvent): void {
    delete this.free;
  }
}
