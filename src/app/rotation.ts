import { Quaternion, Vector3 } from 'three';

interface AxisAngle {
  axis: Vector3;
  angle: number;
}

export class Rotation {
  #axisAngle!: AxisAngle;
  #quaternion: Quaternion;

  get axisX(): number {
    return this.#axisAngle.axis.x;
  }

  get axisY(): number {
    return this.#axisAngle.axis.y;
  }

  get axisZ(): number {
    return this.#axisAngle.axis.z;
  }

  get angle(): number {
    return this.#axisAngle.angle;
  }

  constructor() {
    this.#quaternion = new Quaternion();

    this.#sync();
  }

  apply(rotation: Rotation): Rotation {
    return this.applyQuaternion(rotation.#quaternion);
  }

  applyAxisAngle(axisAngle: AxisAngle): Rotation {
    return this.apply(
      new Rotation().setFromAxisAngle({
        axis: axisAngle.axis.clone().normalize(),
        angle: axisAngle.angle,
      })
    );
  }

  applyQuaternion(quaternion: Quaternion): Rotation {
    this.#quaternion.premultiply(quaternion);

    return this.#sync();
  }

  setFromAxisAngle(axisAngle: AxisAngle): Rotation {
    this.#quaternion.setFromAxisAngle(axisAngle.axis, axisAngle.angle);

    return this.#sync();
  }

  setFromQuaternion(quaternion: Quaternion): Rotation {
    this.#quaternion = quaternion.clone();

    return this.#sync();
  }

  #sync(): Rotation {
    this.#axisAngle = this.#toAxisAngle();

    return this;
  }

  /**
   *
   * @see https://www.wikiwand.com/en/Axis%E2%80%93angle_representation#Unit_quaternions
   */
  #toAxisAngle(): AxisAngle {
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
