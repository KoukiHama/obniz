"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 *
 * @ignore
 */
const crypto_1 = __importDefault(require("crypto"));
/**
 * @ignore
 */
const r = () => {
    return crypto_1.default.randomBytes(16);
};
/**
 * @ignore
 */
const c1 = (k, _r, pres, preq, iat, ia, rat, ra) => {
    const p1 = Buffer.concat([iat, rat, preq, pres]);
    const p2 = Buffer.concat([ra, ia, Buffer.from('00000000', 'hex')]);
    let res = xor(_r, p1);
    res = e(k, res);
    res = xor(res, p2);
    res = e(k, res);
    return res;
};
const s1 = (k, r1, r2) => {
    return e(k, Buffer.concat([r2.slice(0, 8), r1.slice(0, 8)]));
};
const e = (key, data) => {
    key = swap(key);
    data = swap(data);
    const cipher = crypto_1.default.createCipheriv('aes-128-ecb', key, '');
    cipher.setAutoPadding(false);
    return swap(Buffer.concat([cipher.update(data), cipher.final()]));
};
const xor = (b1, b2) => {
    const result = Buffer.alloc(b1.length);
    for (let i = 0; i < b1.length; i++) {
        result[i] = b1[i] ^ b2[i];
    }
    return result;
};
const swap = (input) => {
    const output = Buffer.alloc(input.length);
    for (let i = 0; i < output.length; i++) {
        output[i] = input[input.length - i - 1];
    }
    return output;
};
exports.default = {
    r,
    c1,
    s1,
    e,
};
