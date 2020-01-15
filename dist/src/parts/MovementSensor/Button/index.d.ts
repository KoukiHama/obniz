import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface ButtonOptions {
}
declare class Button implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    onChangeForStateWait: any;
    io_signal: any;
    params: any;
    io_supply: any;
    isPressed: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
    isPressedWait(): Promise<boolean>;
    stateWait(isPressed: any): Promise<{}>;
}
export default Button;
