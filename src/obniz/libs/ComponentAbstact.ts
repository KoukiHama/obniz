import EventEmitter from "eventemitter3";
import Obniz from "../index";
import { ObnizError, ObnizOfflineError, ObnizTimeoutError } from "../ObnizError";

import WSSchema from "./wscommand/WSSchema";

export type EventHandler = (...args: any) => any;

export interface ReceiveJsonOptions {
  timeout?: number;
  queue?: boolean;
  errors?: { [schema: string]: typeof ObnizError };
}

export abstract class ComponentAbstract<EventTypes extends string = string> extends EventEmitter<EventTypes> {
  public Obniz: Obniz;
  public timeout: number = 30 * 1000;
  protected _eventHandlerQueue: { [key: string]: EventHandler[] } = {};

  constructor(obniz: Obniz) {
    super();
    this.Obniz = obniz;
  }

  public notifyFromObniz(json: any) {
    for (const eventName of this.eventNames()) {
      if (typeof eventName !== "string" || !eventName.startsWith("/response/")) {
        continue;
      }
      const errors = this.validate(eventName, json);
      if (errors.valid) {
        this.emit(eventName, json);
      }
    }
    for (const eventName in this._eventHandlerQueue) {
      if (typeof eventName !== "string" || !eventName.startsWith("/response/")) {
        continue;
      }
      if (this._eventHandlerQueue[eventName].length === 0) {
        continue;
      }
      const errors = this.validate(eventName, json);
      if (errors.valid) {
        const func = this._eventHandlerQueue[eventName].shift();
        if (func) {
          func(json);
        }
      }
    }
  }

  public validate(commandUri: any, json: any): WSSchema.MultiResult {
    const schema = WSSchema.getSchema(commandUri);
    return WSSchema.validateMultiple(json, schema);
  }

  public abstract schemaBasePath(): string | null;

  protected abstract _reset(): void;

  protected onceQueue(eventName: string, func: EventHandler) {
    this._eventHandlerQueue[eventName] = this._eventHandlerQueue[eventName] || [];
    if (typeof func === "function") {
      this._eventHandlerQueue[eventName].push(func);
    }
  }

  protected async sendAndReceiveJsonWait(sendObj: any, schemaPath: string, option?: ReceiveJsonOptions): Promise<any> {
    this.Obniz.send(sendObj);
    return await this.receiveJsonWait(schemaPath, option);
  }

  protected receiveJsonWait(schemaPath: string, option?: ReceiveJsonOptions): Promise<any> {
    option = option || {};
    option.timeout = option.timeout || this.timeout;
    option.queue = option.queue !== false;
    option.errors = option.errors || {};

    return new Promise((resolve, reject) => {
      if (this.Obniz.connectionState !== "connected") {
        reject(new ObnizOfflineError());
        return;
      }
      const clearListeners = () => {
        this.Obniz.off("close", onObnizClosed);
        this.off(schemaPath as any, onDataReceived);
        if (typeof timeoutHandler === "number") {
          clearTimeout(timeoutHandler);
          timeoutHandler = undefined;
        }
        for (const one of onErrorFuncs) {
          this.off(one.path, one.onError);
        }
      };
      const onObnizClosed = () => {
        clearListeners();
        const error = new ObnizOfflineError();
        reject(error);
      };
      const onDataReceived = (schemaData: any) => {
        clearListeners();

        resolve(schemaData);
      };
      const onTimeout = () => {
        clearListeners();

        const error = new ObnizTimeoutError(schemaPath);
        reject(error);
      };
      const onErrorFuncs: any[] = [];

      this.Obniz.once("close", onObnizClosed);
      if (option!.queue) {
        this.onceQueue(schemaPath as any, onDataReceived);
      } else {
        this.once(schemaPath as any, onDataReceived);
      }

      for (const path in option!.errors) {
        const onError = () => {
          clearListeners();
          const error = new (option!.errors![path] as any)();
          reject(error);
        };
        this.on(path as any, onDataReceived);
        onErrorFuncs.push({ onError, path });
      }
      let timeoutHandler: number | undefined = setTimeout(onTimeout, option!.timeout);
    });
  }
}
