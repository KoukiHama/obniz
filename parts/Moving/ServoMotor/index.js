class ServoMotor {
  constructor() {
    this.keys = [ "gnd", "vcc", "signal"];
    this.requiredKeys = ["signal"];
  };

  wired(obniz) {
    this.obniz = obniz;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.pwm = obniz.getFreePwm();
    this.pwm_io_num = this.params.signal;

    this.pwm.start({io: this.pwm_io_num});
    this.pwm.freq(50);
  };

// Module functions

  angle(ratio) {
    var max = 2.4;
    var min = 0.5;
    var val = (max-min) * ratio / 180.0 + min;
    this.pwm.pulse(val);
  };

  on() {
    if (this.params.vcc) {
      this.obniz.getIO(this.params.vcc).output(true);
    }
  };

  off() {
    if (this.params.vcc) {
      this.obniz.getIO(this.params.vcc).output(false);
    }
  };
}

let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("ServoMotor", ServoMotor);
