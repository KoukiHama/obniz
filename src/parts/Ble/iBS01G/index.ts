/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS01GOptions {}

export interface IBS01G_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  fall: boolean;
}

export default class IBS01G implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS01G',
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (this.deviceAdv.length > peripheral.adv_data.length) {
      return false;
    }
    for (let index = 0; index < this.deviceAdv.length; index++) {
      if (this.deviceAdv[index] === -1) {
        continue;
      }
      if (peripheral.adv_data[index] === this.deviceAdv[index]) {
        continue;
      }
      return false;
    }
    return (
      peripheral.adv_data[12] === 0xff &&
      peripheral.adv_data[13] === 0xff &&
      peripheral.adv_data[14] === 0xff &&
      peripheral.adv_data[15] === 0xff
    );
  }

  public static getData(peripheral: BleRemotePeripheral): IBS01G_Data | null {
    if (!IBS01G.isDevice(peripheral)) {
      return null;
    }
    const data: IBS01G_Data = {
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      button: false,
      moving: false,
      fall: false,
    };

    if (peripheral.adv_data[11] & 0b0001) {
      data.button = true;
    }
    if (peripheral.adv_data[11] & 0b0010) {
      data.moving = true;
    }
    if (peripheral.adv_data[11] & 0b1000) {
      data.fall = true;
    }
    return data;
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x59, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x80, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // Event
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    0x06, // subtype
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
