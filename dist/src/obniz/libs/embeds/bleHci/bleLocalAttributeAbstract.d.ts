/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleAttributeAbstract from './bleAttributeAbstract';
import BleCharacteristic from './bleCharacteristic';
import BleService from './bleService';
/**
 * @category Use as Peripheral
 */
export default class BleLocalAttributeAbstract<ParentClass, ChildrenClass> extends BleAttributeAbstract<ParentClass, ChildrenClass> {
    /**
     * @ignore
     */
    protected characteristic: BleCharacteristic;
    /**
     * @ignore
     */
    protected service: BleService;
    constructor(params: any);
    /**
     * @ignore
     */
    toBufferObj(): any;
    /**
     * @ignore
     * @param name
     * @param params
     */
    emit(name: any, ...params: any): boolean;
    /**
     * @ignore
     * @param offset
     * @param callback
     * @private
     */
    _onReadRequest(offset: any, callback?: any): void;
    /**
     * @ignore
     * @param data
     * @param offset
     * @param withoutResponse
     * @param callback
     * @private
     */
    _onWriteRequest(data: any, offset?: any, withoutResponse?: any, callback?: any): void;
    /**
     * @ignore
     * @param dataArray
     */
    writeWait(dataArray: number[]): Promise<boolean>;
    /**
     * @ignore
     * @return dataArray
     */
    readWait(): Promise<number[]>;
}
