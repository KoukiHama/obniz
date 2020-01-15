import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface XBeeOptions {
}
declare class XBee implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    displayIoNames: any;
    uart: any;
    currentCommand: any;
    commands: any;
    isAtMode: any;
    onFinishAtModeCallback: any;
    params: any;
    onreceive: any;
    obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    send(text: any): void;
    onAtResultsRecieve(data: any, text: any): void;
    addCommand(command: any, value?: any): void;
    sendCommand(): void;
    enterAtMode(): void;
    exitAtMode(): void;
    configWait(config: any): Promise<{}>;
}
export default XBee;
