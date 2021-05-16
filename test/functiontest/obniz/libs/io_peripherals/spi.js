const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('obniz.libs.spi', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this);
  });
  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('start', function () {
    this.obniz.spi0.start({
      clk: 0,
      frequency: 1000000,
      miso: 2,
      mode: 'master',
      mosi: 1,
    });

    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { spi0: { clk: 0, clock: 1000000, miso: 2, mode: 'master', mosi: 1 } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('startWithGnd', function () {
    this.obniz.spi0.start({
      clk: 0,
      frequency: 1000000,
      miso: 2,
      mode: 'master',
      mosi: 1,
      gnd: 7,
    });

    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io7: false }]);
    expect(this.obniz).send([
      {
        display: {
          pin_assign: {
            7: {
              module_name: 'spi0',
              pin_name: 'gnd',
            },
          },
        },
      },
    ]);
    expect(this.obniz).send([
      { spi0: { clk: 0, clock: 1000000, miso: 2, mode: 'master', mosi: 1 } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('write', function () {
    this.obniz.spi0.start({
      clk: 0,
      frequency: 1000000,
      miso: 2,
      mode: 'master',
    });
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { spi0: { clk: 0, clock: 1000000, miso: 2, mode: 'master' } },
    ]);

    const r = this.obniz.spi0.writeWait([0x12, 0x98]).then(
      function (value) {
        expect(value).to.be.deep.equal([0x61, 0xf2]);
        expect(this.obniz).to.be.finished;
      }.bind(this)
    );

    expect(this.obniz).send([{ spi0: { data: [0x12, 0x98], read: true } }]);
    setTimeout(
      function () {
        testUtil.receiveJson(this.obniz, [{ spi0: { data: [0x61, 0xf2] } }]);
      }.bind(this),
      10
    );
    return r;
  });

  it('write over 32 to <1.0.3', async function () {
    const firmver_ver = this.obniz.firmware_ver;
    this.obniz.firmware_ver = '1.0.2';
    this.obniz.spi0.start({
      clk: 0,
      frequency: 1000000,
      miso: 2,
      mode: 'master',
    });
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { spi0: { clk: 0, clock: 1000000, miso: 2, mode: 'master' } },
    ]);

    const data = [];
    for (let i = 0; i < 33; i++) {
      data.push(i);
    }

    let didThrow = false;
    try {
      await this.obniz.spi0.writeWait(data);
    } catch (e) {
      didThrow = true;
    }
    expect(didThrow).to.be.true;
    expect(this.obniz).to.be.finished;
    this.obniz.firmware_ver = firmver_ver;
  });

  it('write over 32 to >=1.0.3', function () {
    const firmver_ver = this.obniz.firmware_ver;
    this.obniz.firmware_ver = '1.0.3';
    this.obniz.spi0.start({
      clk: 0,
      frequency: 1000000,
      miso: 2,
      mode: 'master',
    });
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { spi0: { clk: 0, clock: 1000000, miso: 2, mode: 'master' } },
    ]);

    const data = [];
    for (let i = 0; i < 33; i++) {
      data.push(i);
    }

    const r = this.obniz.spi0.writeWait(data).then(
      function (value) {
        expect(value).to.be.deep.equal(data);
        expect(this.obniz).to.be.finished;
      }.bind(this)
    );

    expect(this.obniz).send([{ spi0: { data, read: true } }]);
    setTimeout(
      function () {
        testUtil.receiveJson(this.obniz, [{ spi0: { data } }]);
      }.bind(this),
      10
    );
    this.obniz.firmware_ver = firmver_ver;
    return r;
  });

  it.skip('SPI send 2byte and receive 3byte', function () {
    this.obniz.spi0.start({
      clk: 0,
      frequency: 1000000,
      miso: 2,
      mode: 'master',
      mosi: 1,
    });
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { spi0: { clk: 0, clock: 1000000, miso: 2, mode: 'master', mosi: 1 } },
    ]);

    const r = this.obniz.spi0.writeWait([0x12, 0x98]).then(
      function (value) {
        expect(value).to.be.deep.equal([0x61, 0xf2]);
        expect(this.obniz).to.be.finished;
      }.bind(this)
    );

    expect(this.obniz).send([{ spi0: { data: [0x12, 0x98], read: true } }]);
    setTimeout(
      function () {
        testUtil.receiveJson(this.obniz, [
          { spi0: { data: [0x61, 0xf2, 0x34] } },
        ]);
      }.bind(this),
      10
    );
    return r;
  });

  it('end', function () {
    this.obniz.spi0.start({
      clk: 0,
      frequency: 1000000,
      miso: 2,
      mode: 'master',
      mosi: 1,
    });

    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { spi0: { clk: 0, clock: 1000000, miso: 2, mode: 'master', mosi: 1 } },
    ]);
    expect(this.obniz).to.be.finished;

    this.obniz.spi0.end();
    expect(this.obniz).send([{ spi0: null }]);
    expect(this.obniz).to.be.finished;
  });
});
