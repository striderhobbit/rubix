import { Quaternion, Vector3 } from 'three';

interface AxialRotation {
  axis: Vector3;
  angle: number;
}

export class Rotation {
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

  apply(axialRotation: AxialRotation): Rotation {
    this.#quaternion.premultiply(
      new Quaternion().setFromAxisAngle(
        axialRotation.axis.clone().normalize(),
        axialRotation.angle
      )
    );

    this.#axialRotation = this.#toAxialRotation();

    return this;
  }

  /**
   *
   * @see https://www.wikiwand.com/en/Axis%E2%80%93angle_representation#Unit_quaternions
   */
  #toAxialRotation(): AxialRotation {
    const s = this.#quaternion.w;
    const x = new Vector3(
      this.#quaternion.x,
      this.#quaternion.y,
      this.#quaternion.z
    );

    const theta = 2 * Math.atan2(x.length(), s);

    return {
      axis: theta !== 0 ? x.divideScalar(Math.sin(theta / 2)) : new Vector3(),
      angle: theta,
    };
  }
}
