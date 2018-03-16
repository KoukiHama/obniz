/* global showObnizDebugError */

var isNode = (typeof window === 'undefined') ;

class Obniz {

  constructor(id, options) {
    this.isNode     = isNode;
    this.apiversion = 1;
    this.id         = id;
    this.socket     = null;
    this.debugprint = false;
    this.debugs     = [];
  
    this.bufferdAmoundWarnBytes = 100 * 1000; // 100k bytes
  
    this.init();
  
    if (!options) {
      options = {};
    }
    this.server_obnizio = options.obniz_server || "wss://obniz.io";
    this._access_token = options.access_token;
    this.auto_connect = typeof(options.auto_connect) === "boolean" ? options.auto_connect : true;

    if (options.binary !== false) {
      this.wscommand = this.constructor.WSCommand;
      let classes = this.constructor.WSCommand.CommandClasses;
      this.wscommands = [];
      for (let class_name in classes) {
       this.wscommands.push(new classes[class_name]());
      }
    }

    if (this.isNode === false) { showOffLine(); }
  
    if (!this.isValidObnizId(this.id)) {
      if (isNode)  {
        this.error("invalid obniz id")
      } else {
        let filled = _ReadCookie("obniz-last-used") || "";
        this.prompt(filled , function(obnizid){
          this.id = obnizid;
          this.wsconnect();
        }.bind(this))
      }
      return;
    }

    if(this.auto_connect){
      this.wsconnect();
    }
  }

  static get WSCommand() {
    return WSCommand;
  }

  isValidObnizId(str) {
    if (typeof str != "string" || str.length < 8) {
      return null;
    }
    str = str.replace("-", "");
    var id = parseInt(str);
    if (isNaN(id))
      id = null;
    return id != null;
  }

  prompt(filled, callback) {
    var obnizid = prompt("Please enter obniz id", filled);
    if (!obnizid) {
    } else {
      callback(obnizid);
    }
  }

  wsOnOpen() {
    this.print_debug("ws connected");
    // wait for {ws:{ready:true}} object
    if(typeof this.onopen === "function"){
      this.onopen(this);
    }
  }

  wsOnMessage(data) {
    this.print_debug(data);
    let obj = {};
    if (typeof (data) === "string") {
      obj = JSON.parse(data);
    } else {
      return;
    }
  
    // notify messaging
    if (typeof (obj.message) === "object" && this.onmessage) {
      this.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof (obj.debug) === "object") {
      if (obj.debug.warning) {
        let msg = "Warning: " + obj.debug.warning;
        this.error(msg);
      }
      if (obj.debug.error) {
        let msg = "Error: " + obj.debug.error;
        this.error(msg);
      }
      if (obj.debug.errors) {
        for (let i=0; i<obj.debug.errors.length; i++) {
          let msg = "Error: " + obj.debug.errors[i].message;
          this.error(msg);
        }
      }
      if (this.ondebug) {
        this.ondebug(obj.debug);
      }
    }
    // ws command
    if (obj["ws"]) {
      this.handleWSCommand(obj["ws"]);
      return;
    }
  
    // notify
    let notifyHandlers = ["io", "uart", "spi", "i2c", "ad"];
    for (let handerIndex = 0; handerIndex < notifyHandlers.length; handerIndex++) {
      let i = -1;
      let peripheral = notifyHandlers[handerIndex];
      while (true) {
        i++;
        if (this[peripheral + "" + i] === undefined) {
          break;
        }
        let module_value = obj[peripheral + "" + i];
        if (module_value === undefined)
          continue;
        this[peripheral + "" + i].notified(module_value);
      }
    }
    let names = ["switch", "ble", "measure"];
    for (let i = 0; i < names.length; i++) {
      if (obj[names[i]]) {
        this[names[i]].notified(obj[names[i]]);
      }
    }
    if (obj.logic_analyzer) {
      this.logicAnalyzer.notified(obj.logic_analyzer)
    }
  }

  wsOnClose(event) {
    this.print_debug("closed");
    if (this.isNode === false) { showOffLine(); }
    if (this.looper) {
      this.looper = null;
    }
  
    this.clearSocket(this.socket);

    if(typeof this.onclose === "function"){
      this.onclose(this);
    }

    if(this.auto_connect) {
      setTimeout(function () {
        // always connect to mainserver if ws lost
        this.wsconnect();
      }.bind(this), 1000);
    }
  }

  wsOnError(event) {
    console.error("websocket error.");
  }


  wsOnUnexpectedResponse(req, res) {
    let reconnectTime = 1000;
    if (res && res.statusCode == 404) {
      // obniz not online
      this.print_debug("obniz not online");
    } else {
      // servder error or someting
      reconnectTime = 5000;
      this.print_debug("invalid server response " + (res) ? res.statusCode :  '');
    }
    this.clearSocket(this.socket);
    if(this.auto_connect) {
      setTimeout(function () {
        // always connect to mainserver if ws lost
        this.wsconnect();
      }.bind(this), reconnectTime);
    }
  }

  wsconnect(desired_server) {
    let server = this.server_obnizio;
    if (desired_server) {
      server = "" + desired_server;
    }
    if (this.socket) {
      this.socket.close();
      this.clearSocket(this.socket);
    }
    let url = server + "/obniz/" + this.id + "/ws/"+this.apiversion;
    if (_obniz_js_version) {
      url += "?obnizjs="+_obniz_js_version;
    }
    if (this._access_token) {
      url += "&access_token="+this._access_token;
    }
    if (this.wscommand) {
      url += "&accept_binary=true";
    }
    this.print_debug("connecting to " + url);
  
    if (this.isNode) {
      const wsClient = require('ws');
      this.socket = new wsClient(url);
      this.socket.on('open', this.wsOnOpen.bind(this));
      this.socket.on('message', this.wsOnMessage.bind(this));
      this.socket.on('close', this.wsOnClose.bind(this));
      this.socket.on('error', this.wsOnError.bind(this));
      this.socket.on('unexpected-response', this.wsOnUnexpectedResponse.bind(this));
    } else {
      this.socket = new WebSocket(url);
      this.socket.binaryType = 'arraybuffer';
      this.socket.onopen = this.wsOnOpen.bind(this);
      this.socket.onmessage = function (event) {
        this.wsOnMessage(event.data);
      }.bind(this);
      this.socket.onclose = this.wsOnClose.bind(this);
      this.socket.onerror = this.wsOnError.bind(this);
    }
  }

  clearSocket(socket) {
    if (this.isNode) {
      let shouldRemoveObservers = ['open', 'message', 'close', 'error'];
      for (let i = 0; i < shouldRemoveObservers.length; i++) {
        socket.removeAllListeners(shouldRemoveObservers[i]);
      }
    } else {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
    }
    this.socket = null;
  }


  connect(){
    this.wsconnect();
  }

  close() {
    if (this.socket) {
      this._drainQueued();
      this.socket.close(1000, 'close');
      this.clearSocket(this.socket);
    }
  }

  wired(partsname) {
    var parts = new _parts[partsname]();
    if (!parts) {
      throw new Error("No such a parts [" + partsname + "] found");
      return;
    }
    var args = Array.from(arguments);
    args.shift();
    args.unshift(this); 
    if(parts.keys){
      if(parts.requiredKeys){
        var err = ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
        if (err) {
          throw new Error(partsname + " wired param '" + err + "' required, but not found ");
          return;
        }
      }
      parts.params = ObnizUtil._keyFilter(args[1], parts.keys);
    }
    parts.obniz = this;
    parts.wired.apply(parts, args);
    if(parts.keys || parts.ioKeys){
      var keys = parts.ioKeys || parts.keys;
      var displayPartsName = parts.displayName || partsname;
      var ioNames = {};
      for( var index in keys){
        var pinName = keys[index];
        var io = args[1][pinName];
        if(parts.displayIoNames && parts.displayIoNames[pinName]){
          pinName = parts.displayIoNames[pinName];
        }
        ioNames[io]=pinName;
      }
      this.display.setPinNames(displayPartsName,ioNames);
    }
    return parts;
  }

  print_debug(str) {
    if (this.debugprint) {
      console.log("Obniz: " + str);
    }
  }

  send(obj) {
    if (this.sendPool) { this.sendPool.push(obj); return; }
    if (!obj || (typeof obj !== "object")) {
      console.log("obnizjs. didnt send ", obj);
      return;
    }
    let sendData = JSON.stringify(obj);
    this.print_debug("send: " + sendData);
    /* compress */
    if (this.wscommand) {
      let compressed;
      try {
        compressed = this.wscommand.compress(this.wscommands, JSON.parse(sendData));
        if (compressed) {
          sendData = compressed;
          this.print_debug("compressed: " + sendData);
        }
      } catch(e) {
        this.error(e);
      }
    }
    if (true) {
      // queue sending
      if(typeof sendData === "string") {
        this._drainQueued();
        this.socket.send(sendData);
      } else {
        if (this._sendQueue) {
          this._sendQueue.push(sendData);
        } else {
          this._sendQueue = [sendData];
          this._sendQueueTimer = setTimeout(this._drainQueued.bind(this), 1);
        }
      }
    } else {
      // sendImmidiately
      this.socket.send(sendData);
      if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.error('Warning: over ' + this.socket.bufferedAmount + ' bytes queued');
      }
    }
  }

  _drainQueued() {
    if (!this._sendQueue) return;
    var expectSize = 0;
    for (var i=0; i<this._sendQueue.length; i++) {
      expectSize += this._sendQueue[i].length;
    }
    var filled = 0;
    var sendData = new Uint8Array(expectSize);
    for (var i=0; i<this._sendQueue.length; i++) {
      sendData.set(this._sendQueue[i], filled);
      filled += this._sendQueue[i].length;
    }
    this.socket.send(sendData);
    delete this._sendQueue;
    clearTimeout(this._sendQueueTimer);
    this._sendQueueTimer = null;
    
    if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
      this.error('Warning: over ' + this.socket.bufferedAmount + ' bytes queued');
    }
  }

  init() {
    this.io = new PeripheralIO_(this);
    for (var i=0; i<12; i++) { this["io"+i]   = new PeripheralIO(this, i); }
    for (var i=0; i<12; i++) { this["ad"+i]   = new PeripheralAD(this, i); }
    for (var i=0; i<2;  i++) { this["uart"+i] = new PeripheralUART(this, i); }
    for (var i=0; i<1;  i++) { this["spi"+i]  = new PeripheralSPI(this, i); }
    for (var i=0; i<1;  i++) { this["i2c"+i]  = new PeripheralI2C(this, i); }
    for (var i=0; i<6;  i++) { this["pwm"+i]  = new PeripheralPWM(this, i); }
  
    this.display = new Display(this);
    this.switch = new ObnizSwitch(this);
    this.logicAnalyzer = new LogicAnalyzer(this);
    this.ble = new ObnizBLE(this);
    this.measure = new ObnizMeasure(this);
  
    this.util = new ObnizUtil(this);
  }

  isValidIO(io) {
    return (typeof io === "number" && io >= 0 && io < 12);
  }

  setVccGnd(vcc, gnd, drive) {
    if(this.isValidIO(vcc)){
      if(drive){
        this.getIO(vcc).drive(drive);
      }
      this.getIO(vcc).output(true);
    };
    
    if(this.isValidIO(gnd)){
      if(drive){
        this.getIO(gnd).drive(drive);
      }
      this.getIO(gnd).output(false);
    };
  }

  getIO(id) {
    return this["io" + id];
  }

  getAD(id) {
    return this["ad" + id];
  }

  getFreePwm() {
    var i = 0;
    while (true) {
      var pwm = this["pwm" + i];
      if (!pwm) {
        break;
      }
      if (!pwm.isUsed()) {
        pwm.used = true;
        return pwm;
      }
      i++;
    }
    throw new Error("No More PWM Available. max = " + i);
  }

  getFreeI2C() {
    var i = 0;
    while (true) {
      var i2c = this["i2c" + i];
      if (!i2c) {
        break;
      }
      if (!i2c.isUsed()) {
        i2c.used = true;
        return i2c;
      }
      i++;
    }
    throw new Error("No More I2C Available. max = " + i);
  }

  getI2CWithConfig(config) {
    if(typeof config !== "object" ){
      throw new Error("getI2CWithConfig need config arg");
    }
    if(config.i2c){
      return config.i2c;
    }
    var i2c = this.getFreeI2C();
    i2c.start(config);
    return i2c;
  }

  getFreeSpi() {
    var i = 0;
    while (true) {
      var spi = this["spi" + i];
      if (!spi) {
        break;
      }
      if (!spi.isUsed()) {
        spi.used = true;
        return spi;
      }
      i++;
    }
    throw new Error("No More SPI Available. max = " + i);
  }

  getSpiWithConfig(config) {
    if(typeof config !== "object" ){
      throw new Error("getSpiWithConfig need config arg");
    }
    if(config.spi){
      return config.spi;
    }
    var spi = this.getFreeSpi();
    spi.start(config);
    return spi;
  }

  getFreeUart() {
    var i = 0;
    while (true) {
      var uart = this["uart" + i];
      if (!uart) {
        break;
      }
      if (!uart.isUsed()) {
        uart.used = true;
        return uart;
      }
      i++;
    }
    throw new Error("No More uart Available. max = " + i);
  }

  handleWSCommand(wsObj) {
    // ready
    if (wsObj.ready) {
  
      this.resetOnDisconnect(true);
      if (this.isNode === false) { showOnLine(); }
      if (this.onconnect) {
        var promise = this.onconnect(this);
        if(promise instanceof Promise){
          promise.catch((err) => {
            console.error(err);
          });
        }
      }
    }
    if (wsObj.redirect) {
      var server = wsObj.redirect;
      this.print_debug("WS connection changed to " + server);
      this.close();
      this.wsconnect(server);
    }
  }

  message(target, message) {
    var targets = [];
    if (typeof (target) === "string") {
      targets.push(target);
    } else {
      targets = target;
    }
    this.send({
      message: {
        to: targets,
        data: message
      }
    });
  }

// --- System ---


  repeat(callback, interval) {
    if (this.looper) {
      this.looper = callback;
      return;
    }
    this.looper = callback;
    var self = this;
    if (!interval)
      interval = 100;
    async function loop() {
      if (typeof (self.looper) === "function") {
        await self.looper();
        setTimeout(loop, interval);
      }
    }
    loop();
  }

  wait(msec) {
    if (msec < 0) {
      msec = 0;
    } else if (msec > 60 * 1000) {
      msec = 60 * 1000;
    }
    this.send({ system: { wait: msec } });
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  reset() { this.send({ system: { reset: true } }); this.init(); }
  selfCheck() { this.send({ system: { self_check: true } }); }
  keepWorkingAtOffline(working) { this.send({ system: { keep_working_at_offline: working } }); }
  resetOnDisconnect(reset) { this.send({ ws: { reset_obniz_on_ws_disconnection: reset } }); }

  warning(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === "object" && msg.alert) {
        this.showAlertUI(msg);
        console.log(msg.message);
        return;
      }
      if (typeof (showObnizDebugError) === "function") {
        showObnizDebugError(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  error(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === "object" && msg.alert) {
        this.showAlertUI(msg);
        msg = msg.message;
      }
      if (typeof (showObnizDebugError) === "function") {
        showObnizDebugError(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  showAlertUI(obj) {
    if (this.isNode || !document.getElementById('obniz-debug')) {
      return;
    }
    const alerts = {
      warning: 'alert-warning alert-dismissible',
      error: 'alert-danger'
    }
    const timeLabel = Math.random().toString(36).slice(-8);
    let dismissButton = `
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>`;
    let dom = `
    <div class="alert ${alerts[obj.alert]} fade show" role="alert">
      ${obj.message}
      ${ obj.alert == "warning" ? dismissButton : ""}
    </div>`;
    document.getElementById('obniz-debug').insertAdjacentHTML('beforeend', dom);
  }
}

/*===================*/
/* Parts */
/*===================*/
var _parts = {};

var PartsRegistrate = function (name, obj) {
  _parts[name] = obj;
};

var Parts = function (name) {
  return new _parts[name]();
};

/*===================*/
/* Utils */
/*===================*/
function _ReadCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
      }
  }
  return null;
}

if (!isNode) {

  if(window && window.parent && window.parent.userAppLoaded){
    window.parent.userAppLoaded(window);
  }

  function showOnLine() {
    if (typeof jQuery !== 'undefined') {
      $('#loader').hide();
      if ($('#obniz-debug #online-status').length == 0) {
        $('#obniz-debug').prepend('<div id="online-status"></div>')
      }
      $('#online-status').text('online');
      $('#online-status').css({ "background-color" : "#449d44","color":"#FFF", "padding":"5px","text-align": "center" });
    }
  }
  function showOffLine() {
    if (typeof jQuery !== 'undefined') {
      $('#loader').show();
      if ($('#obniz-debug #online-status').length == 0) {
        $('#obniz-debug').prepend('<div id="online-status"></div>')
      }
      $('#online-status').text('offline');
      $('#online-status').css({ "background-color" : "#d9534f","color":"#FFF", "padding":"5px","text-align": "center" });
    }
  }
  function showObnizDebugError(err) {
    if(window.parent && window.parent.logger){
      window.parent.logger.onObnizError(err);
    }else{ throw err; }; 
  }
}

/*===================*/
/* Export */
/*===================*/
if (isNode) {
  module.exports = Obniz;
}