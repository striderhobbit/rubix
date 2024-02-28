import { Quaternion, Vector3 } from 'three';

export class Rotation3 {
  readonly #quaternion: Quaternion;

  /**
   *
   * @see https://www.wikiwand.com/en/Axis%E2%80%93angle_representation#Unit_quaternions
   */
  get rotate3d(): string {
    const { w, x, y, z } = this.#quaternion,
      v = new Vector3(x, y, z);

    const theta = 2 * Math.atan2(v.length(), w);

    return `rotate3d(${(theta !== 0
      ? v.divideScalar(Math.sin(theta / 2))
      : new Vector3()
    )
      .toArray()
      .concat(theta)}rad)`;
  }

  constructor() {
    this.#quaternion = new Quaternion();
  }

  apply(rotation: Rotation3): Rotation3 {
    return this.applyQuaternion(rotation.#quaternion);
  }

  applyAxisAngle(axis: Vector3, angle: number): Rotation3 {
    return this.apply(
      new Rotation3().setFromAxisAngle(axis.clone().normalize(), angle)
    );
  }

  applyQuaternion(quaternion: Quaternion): Rotation3 {
    this.#quaternion.premultiply(quaternion);

    return this;
  }

  setFromAxisAngle(axis: Vector3, angle: number): Rotation3 {
    this.#quaternion.setFromAxisAngle(axis, angle);

    return this;
  }

  setFromQuaternion(quaternion: Quaternion): Rotation3 {
    this.#quaternion.copy(quaternion);

    return this;
  }
}
