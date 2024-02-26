import { Quaternion, Vector3 } from 'three';

interface AxisAngle3 {
  axis: Vector3;
  angle: number;
}

export class Rotation {
  #axisAngle!: AxisAngle3;
  #quaternion: Quaternion;

  get axis(): Vector3 {
    return this.#axisAngle.axis.clone();
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

  applyAxisAngle(axisAngle: AxisAngle3): Rotation {
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

  rotateX(angle: number): Rotation {
    return this.applyAxisAngle({
      axis: new Vector3(1, 0, 0),
      angle,
    });
  }

  rotateY(angle: number): Rotation {
    return this.applyAxisAngle({
      axis: new Vector3(0, 1, 0),
      angle,
    });
  }

  rotateZ(angle: number): Rotation {
    return this.applyAxisAngle({
      axis: new Vector3(0, 0, 1),
      angle,
    });
  }

  setFromAxisAngle(axisAngle: AxisAngle3): Rotation {
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
  #toAxisAngle(): AxisAngle3 {
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
