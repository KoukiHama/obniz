declare class BlePeripheral {
    Obniz: any;
    _services: any;
    constructor(Obniz: any);
    readonly services: any;
    addService(obj: any): void;
    setJson(json: any): void;
    getService(uuid: any): any;
    removeService(uuid: any): void;
    stopAllService(): void;
    toJSON(): {
        services: any;
    };
    findCharacteristic(param: any): any;
    findDescriptor(param: any): any;
    end(): void;
    onconnectionupdates(): void;
    onerror(): void;
}
export default BlePeripheral;
