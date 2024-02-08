import { Component } from '@angular/core';
import { Quaternion, Vector3 } from 'three';

type Face = 'back' | 'down' | 'front' | 'left' | 'right' | 'up';

interface Cubicle {
  coords: {
    x: number;
    y: number;
    z: number;
  };
  faces: Face[];
}

interface Rotation3 {
  axis: Vector3;
  angle: number;
}

class Rotation {
  #quaternion: Quaternion;
  #decomposition: Rotation3;

  get axisX(): number {
    return this.#decomposition.axis.x;
  }

  get axisY(): number {
    return this.#decomposition.axis.y;
  }

  get axisZ(): number {
    return this.#decomposition.axis.z;
  }

  get angle(): number {
    return this.#decomposition.angle;
  }

  constructor();
  constructor(rotation?: Rotation3) {
    this.#quaternion = new Quaternion();

    if (rotation != null) {
      this.#quaternion.setFromAxisAngle(rotation.axis, rotation.angle);
    }

    this.#decomposition = this.decomposition();
  }

  public append(rotation: Rotation3): void {
    this.#quaternion.premultiply(
      new Quaternion().setFromAxisAngle(
        rotation.axis.clone().normalize(),
        rotation.angle
      )
    );

    this.#decomposition = this.decomposition();
  }

  private decomposition(): Rotation3 {
    const angle = 2 * Math.acos(this.#quaternion.w);

    return {
      axis: new Vector3(
        this.#quaternion.x,
        this.#quaternion.y,
        this.#quaternion.z
      ).divideScalar(Math.sin(angle / 2)),
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

  protected cubicles: Cubicle[] = [
    { coords: { x: 0, y: 0, z: -1 }, faces: ['left', 'up', 'back'] },
    { coords: { x: 0, y: 0, z: 0 }, faces: ['left', 'up'] },
    { coords: { x: 0, y: 0, z: 1 }, faces: ['left', 'up', 'front'] },
    { coords: { x: 0, y: 1, z: -1 }, faces: ['left', 'back'] },
    { coords: { x: 0, y: 1, z: 0 }, faces: ['left'] },
    { coords: { x: 0, y: 1, z: 1 }, faces: ['left', 'front'] },
    { coords: { x: 0, y: 2, z: -1 }, faces: ['left', 'down', 'back'] },
    { coords: { x: 0, y: 2, z: 0 }, faces: ['left', 'down'] },
    { coords: { x: 0, y: 2, z: 1 }, faces: ['left', 'down', 'front'] },
    { coords: { x: 1, y: 0, z: -1 }, faces: ['up', 'back'] },
    { coords: { x: 1, y: 0, z: 0 }, faces: ['up'] },
    { coords: { x: 1, y: 0, z: 1 }, faces: ['up', 'front'] },
    { coords: { x: 1, y: 1, z: -1 }, faces: ['back'] },
    { coords: { x: 1, y: 1, z: 0 }, faces: [] },
    { coords: { x: 1, y: 1, z: 1 }, faces: ['front'] },
    { coords: { x: 1, y: 2, z: -1 }, faces: ['down', 'back'] },
    { coords: { x: 1, y: 2, z: 0 }, faces: ['down'] },
    { coords: { x: 1, y: 2, z: 1 }, faces: ['down', 'front'] },
    { coords: { x: 2, y: 0, z: -1 }, faces: ['right', 'up', 'back'] },
    { coords: { x: 2, y: 0, z: 0 }, faces: ['right', 'up'] },
    { coords: { x: 2, y: 0, z: 1 }, faces: ['right', 'up', 'front'] },
    { coords: { x: 2, y: 1, z: -1 }, faces: ['right', 'back'] },
    { coords: { x: 2, y: 1, z: 0 }, faces: ['right'] },
    { coords: { x: 2, y: 1, z: 1 }, faces: ['right', 'front'] },
    { coords: { x: 2, y: 2, z: -1 }, faces: ['right', 'down', 'back'] },
    { coords: { x: 2, y: 2, z: 0 }, faces: ['right', 'down'] },
    { coords: { x: 2, y: 2, z: 1 }, faces: ['right', 'down', 'front'] },
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
