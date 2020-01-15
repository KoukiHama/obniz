import BleAttributeAbstract from "./bleAttributeAbstract";
declare class BleCharacteristic extends BleAttributeAbstract {
    addDescriptor: any;
    addChild: any;
    getDescriptor: any;
    getChild: any;
    properties: any;
    permissions: any;
    children: any;
    service: any;
    uuid: any;
    constructor(obj: any);
    readonly parentName: string;
    readonly childrenClass: any;
    readonly childrenName: string;
    readonly descriptors: any;
    toJSON(): any;
    addProperty(param: any): void;
    removeProperty(param: any): void;
    addPermission(param: any): void;
    removePermission(param: any): void;
    write(data: any): void;
    read(): void;
    notify(): void;
}
export default BleCharacteristic;
