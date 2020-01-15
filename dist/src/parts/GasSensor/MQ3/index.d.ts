import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface MQ3Options {
}
declare class MQ3 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    onchangeanalog: any;
    onchangedigital: any;
    onexceedvoltage: any;
    voltageLimit: any;
    obniz: Obniz;
    vcc: any;
    params: any;
    gnd: any;
    ad: any;
    do: any;
    constructor();
    wired(obniz: Obniz): void;
    startHeating(): void;
    heatWait(seconds: any): Promise<{}>;
}
export default MQ3;
