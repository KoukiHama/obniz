class WSCommand_LogicAnalyzer extends WSCommand {
  
  constructor(delegate) {
    super(delegate);
    this.module = 10;

    this._CommandInit     = 0
    this._CommandDeinit   = 1
    this._CommandRecv     = 2
  }

  // Commands

  init(params) {
    let io = params.io[0];
    let intervalUsec = params.interval * 1000;
    let durationUsec = params.duration * 1000;

    let matchValue = parseInt(params.triger.value);
    let matchCount = params.triger.samples;
    var buf = new Uint8Array(12);
    buf[0] = 1;
    buf[1] = io;
    buf[2] = intervalUsec >> (8*3);
    buf[3] = intervalUsec >> (8*2);
    buf[4] = intervalUsec >> (8*1);
    buf[5] = intervalUsec;
    buf[6] = durationUsec >> (8*3);
    buf[7] = durationUsec >> (8*2);
    buf[8] = durationUsec >> (8*1);
    buf[9] = durationUsec;
    buf[10] = matchValue;
    buf[11] = matchCount;
    this.sendCommand(this._CommandInit, buf);
  }

  deinit(params) {
    var buf = new Uint8Array(0);
    this.sendCommand(this._CommandDeinit, buf);
  }

  parseFromJson(json) {
    var module = json["logic_analyzer"];
    if (module === undefined) {
      return;
    }
    let schemaData = [
      {uri : "/request/logicAnalyzer/init",    onValid: this.init},
      {uri : "/request/logicAnalyzer/deinit",  onValid: this.deinit},
    ];
    let res = this.validateCommandSchema(schemaData, module, "logic_analyzer");

    if(res.valid === 0){
      if(res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      }else{
        throw new WSCommandNotFoundError(`[logic_analyzer]unknown command`);
      }
    }

  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandRecv) {
      var arr = new Array(payload.byteLength);
      for (var i=0; i<payload.byteLength;i++) {
        arr[i] = payload[i];
      }
      objToSend["logic_analyzer"] = {
        data: arr
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}
