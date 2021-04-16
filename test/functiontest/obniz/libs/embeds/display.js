let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../../testUtil.js');

describe('obniz.libs.display', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this);
    if (this.obniz.isNode) {
      // disable node-canvas
      this.obniz.display._ctx = () => {};
    }
  });

   afterEach(async function () {
    await testUtil.releaseObnizePromise(this);
  });

  it('clear', function () {
    if (this.obniz.isNode) {
      this.obniz.display.clear();
      expect(this.obniz).to.be.obniz;
      expect(this.obniz).send([{ display: { clear: true } }]);
      expect(this.obniz).to.be.finished;
    }
  });

  it('print', function () {
    if (this.obniz.isNode) {
      this.obniz.display.print('Hello!!');
      expect(this.obniz).to.be.obniz;
      expect(this.obniz).send([{ display: { text: 'Hello!!' } }]);
      expect(this.obniz).to.be.finished;
    }
  });

  it('print_bool', function () {
    if (this.obniz.isNode) {
      this.obniz.display.print(true);
      expect(this.obniz).to.be.obniz;
      expect(this.obniz).send([{ display: { text: 'true' } }]);
      expect(this.obniz).to.be.finished;
    }
  });

  it('qr', function () {
    this.obniz.display.qr('https://obniz.io');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([
      {
        display: {
          qr: {
            text: 'https://obniz.io',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });
  it('qr-low', function () {
    this.obniz.display.qr('HELLO!', 'L');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([
      {
        display: {
          qr: {
            correction: 'L',
            text: 'HELLO!',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });
  it('qr-high', function () {
    this.obniz.display.qr('p8baerv9uber:q', 'H');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([
      {
        display: {
          qr: {
            correction: 'H',
            text: 'p8baerv9uber:q',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('setPinName', function () {
    this.obniz.display.setPinName(0, 'io', 'input');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([
      {
        display: {
          pin_assign: {
            0: {
              module_name: 'io',
              pin_name: 'input',
            },
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('setPinNames', function () {
    expect(this.obniz).to.be.obniz;
    this.obniz.display.setPinNames('io', {
      1: 'input',
      2: 'output',
    });
    expect(this.obniz).send([
      {
        display: {
          pin_assign: {
            1: {
              module_name: 'io',
              pin_name: 'input',
            },
            2: {
              module_name: 'io',
              pin_name: 'output',
            },
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('raw', function () {
    expect(this.obniz).to.be.obniz;

    this.obniz.display.raw([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      16,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      255,
      240,
      56,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7,
      255,
      224,
      120,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      63,
      255,
      192,
      240,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      127,
      255,
      129,
      248,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      255,
      255,
      3,
      254,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      255,
      254,
      7,
      255,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      255,
      252,
      15,
      255,
      128,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      255,
      248,
      31,
      255,
      192,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      63,
      255,
      240,
      63,
      255,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      63,
      255,
      224,
      127,
      255,
      240,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      127,
      255,
      192,
      255,
      255,
      248,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      255,
      255,
      129,
      255,
      255,
      252,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      255,
      255,
      3,
      255,
      255,
      254,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      255,
      254,
      7,
      255,
      255,
      254,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      255,
      252,
      15,
      255,
      255,
      255,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7,
      255,
      248,
      31,
      255,
      255,
      255,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7,
      255,
      240,
      63,
      255,
      255,
      255,
      128,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7,
      255,
      224,
      127,
      193,
      255,
      255,
      128,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      252,
      64,
      255,
      128,
      255,
      255,
      128,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      240,
      1,
      255,
      0,
      127,
      255,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      224,
      3,
      254,
      0,
      127,
      254,
      14,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      224,
      7,
      254,
      0,
      63,
      252,
      30,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      224,
      7,
      254,
      0,
      63,
      248,
      60,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      192,
      7,
      254,
      0,
      63,
      240,
      120,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      192,
      7,
      254,
      0,
      127,
      224,
      240,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      224,
      7,
      252,
      0,
      127,
      193,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      224,
      15,
      248,
      0,
      255,
      131,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      240,
      31,
      240,
      39,
      255,
      7,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      252,
      63,
      224,
      127,
      254,
      15,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      255,
      255,
      192,
      255,
      252,
      31,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      255,
      255,
      129,
      255,
      248,
      63,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      255,
      255,
      3,
      255,
      240,
      127,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      255,
      254,
      7,
      255,
      224,
      255,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      255,
      252,
      15,
      255,
      193,
      255,
      192,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      255,
      248,
      31,
      255,
      131,
      255,
      192,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      255,
      240,
      63,
      255,
      7,
      255,
      192,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      255,
      224,
      127,
      254,
      15,
      255,
      192,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      255,
      192,
      255,
      252,
      31,
      255,
      128,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7,
      255,
      129,
      255,
      0,
      63,
      255,
      128,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7,
      255,
      3,
      254,
      0,
      127,
      255,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      254,
      7,
      252,
      0,
      255,
      255,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      252,
      15,
      252,
      0,
      255,
      254,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      248,
      31,
      252,
      0,
      255,
      254,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      240,
      63,
      252,
      0,
      255,
      252,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      224,
      127,
      252,
      0,
      255,
      252,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      255,
      252,
      0,
      255,
      248,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      255,
      254,
      1,
      255,
      240,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      255,
      255,
      3,
      255,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7,
      255,
      255,
      255,
      255,
      192,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      255,
      255,
      255,
      255,
      128,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      31,
      255,
      255,
      255,
      254,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      12,
      255,
      255,
      255,
      252,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      63,
      255,
      255,
      240,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      255,
      255,
      192,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      255,
      255,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      63,
      224,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]);
    expect(this.obniz).send([
      {
        display: {
          raw: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            16,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            255,
            240,
            56,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            7,
            255,
            224,
            120,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            63,
            255,
            192,
            240,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            127,
            255,
            129,
            248,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            255,
            255,
            3,
            254,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            255,
            254,
            7,
            255,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            255,
            252,
            15,
            255,
            128,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            255,
            248,
            31,
            255,
            192,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            63,
            255,
            240,
            63,
            255,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            63,
            255,
            224,
            127,
            255,
            240,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            127,
            255,
            192,
            255,
            255,
            248,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            255,
            255,
            129,
            255,
            255,
            252,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            255,
            255,
            3,
            255,
            255,
            254,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            255,
            254,
            7,
            255,
            255,
            254,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            255,
            252,
            15,
            255,
            255,
            255,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            7,
            255,
            248,
            31,
            255,
            255,
            255,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            7,
            255,
            240,
            63,
            255,
            255,
            255,
            128,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            7,
            255,
            224,
            127,
            193,
            255,
            255,
            128,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            252,
            64,
            255,
            128,
            255,
            255,
            128,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            240,
            1,
            255,
            0,
            127,
            255,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            224,
            3,
            254,
            0,
            127,
            254,
            14,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            224,
            7,
            254,
            0,
            63,
            252,
            30,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            224,
            7,
            254,
            0,
            63,
            248,
            60,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            192,
            7,
            254,
            0,
            63,
            240,
            120,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            192,
            7,
            254,
            0,
            127,
            224,
            240,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            224,
            7,
            252,
            0,
            127,
            193,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            224,
            15,
            248,
            0,
            255,
            131,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            240,
            31,
            240,
            39,
            255,
            7,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            252,
            63,
            224,
            127,
            254,
            15,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            255,
            255,
            192,
            255,
            252,
            31,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            255,
            255,
            129,
            255,
            248,
            63,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            255,
            255,
            3,
            255,
            240,
            127,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            255,
            254,
            7,
            255,
            224,
            255,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            255,
            252,
            15,
            255,
            193,
            255,
            192,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            255,
            248,
            31,
            255,
            131,
            255,
            192,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            255,
            240,
            63,
            255,
            7,
            255,
            192,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            255,
            224,
            127,
            254,
            15,
            255,
            192,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            255,
            192,
            255,
            252,
            31,
            255,
            128,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            7,
            255,
            129,
            255,
            0,
            63,
            255,
            128,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            7,
            255,
            3,
            254,
            0,
            127,
            255,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            254,
            7,
            252,
            0,
            255,
            255,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            252,
            15,
            252,
            0,
            255,
            254,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            248,
            31,
            252,
            0,
            255,
            254,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            240,
            63,
            252,
            0,
            255,
            252,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            224,
            127,
            252,
            0,
            255,
            252,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            64,
            255,
            252,
            0,
            255,
            248,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            255,
            254,
            1,
            255,
            240,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            255,
            255,
            3,
            255,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            7,
            255,
            255,
            255,
            255,
            192,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            255,
            255,
            255,
            255,
            128,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            31,
            255,
            255,
            255,
            254,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            12,
            255,
            255,
            255,
            252,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            63,
            255,
            255,
            240,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            15,
            255,
            255,
            192,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            255,
            255,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            63,
            224,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('text', function () {
    let isNode = typeof window === 'undefined';
    if (!isNode) {
      this.skip();
      return;
    }
    expect(this.obniz).to.be.obniz;

    this.obniz.display.print('Hello!');

    expect(this.obniz).send([
      {
        display: {
          text: 'Hello!',
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });
});
