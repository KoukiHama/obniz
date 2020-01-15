import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface SharpMemoryTFTOptions {
}
declare class SharpMemoryTFT implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    commands: any;
    _canvas: any;
    obniz: Obniz;
    io_cs: any;
    params: any;
    io_disp: any;
    io_extcomin: any;
    io_extmode: any;
    spi: any;
    width: any;
    height: any;
    _pos: any;
    autoFlush: any;
    fontSize: any;
    createCanvas: any;
    constructor();
    wired(obniz: Obniz): void;
    _reverseBits(data: any): any;
    sendLSB(data: any): void;
    sendClear(): void;
    raw(rawData: any): void;
    _reset(): void;
    warnCanvasAvailability(): void;
    _preparedCanvas(): any;
    _ctx(): any;
    font(font: any, size: any): void;
    clear(): void;
    pos(x: any, y: any): any;
    print(text: any): void;
    line(x_0: any, y_0: any, x_1: any, y_1: any): void;
    rect(x: any, y: any, width: any, height: any, mustFill: any): void;
    circle(x: any, y: any, r: any, mustFill: any): void;
    _draw(ctx: any): void;
    draw(ctx: any): void;
    drawing(autoFlush: any): void;
}
export default SharpMemoryTFT;
