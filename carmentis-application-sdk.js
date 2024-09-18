/**
  Licensed under the Apache License, Version 2.0
  (c)2022-2024 Carmentis SAS
  Built 2024-09-18T13:29:01.362Z
  --
  Third party libraries:
  noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com)
*/
import https from 'https';
import { webcrypto } from 'crypto';
import * as secp256k1 from '@noble/secp256k1';

let digest$1;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$2(cryptoInterface) {
  cryptoInterface.getRandomValues;
  digest$1          = cryptoInterface.digest;
  cryptoInterface.generateKey;
  cryptoInterface.deriveBits;
  cryptoInterface.deriveKey;
  cryptoInterface.importKey;
  cryptoInterface.exportKey;
  cryptoInterface.encrypt;
  cryptoInterface.decrypt;
  cryptoInterface.sign;
  cryptoInterface.verify;
  cryptoInterface.secp256k1;
}

const POSITIVE = 0;

// ============================================================================================================================ //
//  fromHexaString()                                                                                                            //
// ---------------------------------------------------------------------------------------------------------------------------- //
//  Creates a positive BigInt from a hexadecimal string. The input is assumed to match /^[A-F\d]+$/i.                           //
// ============================================================================================================================ //
function fromHexaString(str) {
  let nibble = [ 0 ];

  [...str].forEach((digit, i) => {
    nibble[str.length - i - 1] = parseInt(digit, 16);
  });

  return fromNibbles(nibble);
}

// ============================================================================================================================ //
//  fromNibbles()                                                                                                               //
// ============================================================================================================================ //
function fromNibbles(nibble) {
  let array = new Uint16Array(nibble.length + 3 >> 2);

  for(let i = 0; i < nibble.length; i += 4) {
    array[i >> 2] = nibble[i] | nibble[i + 1] << 4 | nibble[i + 2] << 8 | nibble[i + 3] << 12;
  }

  return {
    value: array,
    sign : POSITIVE
  };
}

new TextEncoder();
new TextDecoder();

// B parameter of secp256r1
fromHexaString("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B");

// P parameter of secp256r1: 2 ** 256 - 2 ** 224 + 2 ** 192 + 2 ** 96 - 1
fromHexaString("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF");

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize$1(cryptoInterface) {
  initialize$2(cryptoInterface);
}

// ============================================================================================================================ //
//  sha256()                                                                                                                    //
// ============================================================================================================================ //
async function sha256$1(data) {
  let hash = await digest$1("SHA-256", data);

  return new Uint8Array(hash);
}

const subtle = webcrypto.subtle;

const getRandomValues = webcrypto.getRandomValues.bind(webcrypto);
const digest          = subtle.digest.bind(subtle);
const generateKey     = subtle.generateKey.bind(subtle);
const deriveBits      = subtle.deriveBits.bind(subtle);
const deriveKey       = subtle.deriveKey.bind(subtle);
const importKey       = subtle.importKey.bind(subtle);
const exportKey       = subtle.exportKey.bind(subtle);
const encrypt         = subtle.encrypt.bind(subtle);
const decrypt         = subtle.decrypt.bind(subtle);
const sign            = subtle.sign.bind(subtle);
const verify          = subtle.verify.bind(subtle);

var nodeCrypto = /*#__PURE__*/Object.freeze({
  __proto__: null,
  decrypt: decrypt,
  deriveBits: deriveBits,
  deriveKey: deriveKey,
  digest: digest,
  encrypt: encrypt,
  exportKey: exportKey,
  generateKey: generateKey,
  getRandomValues: getRandomValues,
  importKey: importKey,
  secp256k1: secp256k1,
  sign: sign,
  verify: verify
});

// ============================================================================================================================ //
//  toHexa()                                                                                                                    //
// ============================================================================================================================ //
function toHexa(array) {
  if(!array instanceof Uint8Array && !Array.isArray(array)) {
    return "";
  }

  return [...array].map(n => n.toString(16).toUpperCase().padStart(2, "0")).join("");
}

initialize$1(nodeCrypto);

let config = {},
    crc32Table;

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
function initialize(options = {}) {
  config.operatorHost = options.host;
  config.operatorPort = options.port;
}

// ============================================================================================================================ //
//  query()                                                                                                                     //
// ============================================================================================================================ //
async function query(method, data) {
  return new Promise(function(resolve, reject) {
    let options = {
      hostname: config.operatorHost,
      port    : config.operatorPort,
      path    : "/" + method,
      method  : "POST"
    };

    let req = https.request(options, res => {
      res.on("data", answer => {
        let obj = JSON.parse(answer.toString());
        resolve(obj);
      });
    });

    req.on("error", answer => {
      console.error(answer);
      reject(answer);
    });

    req.write(
      Buffer.from(JSON.stringify(data))
    );
    req.end();
  });
}

// ============================================================================================================================ //
//  crc32()                                                                                                                     //
// ============================================================================================================================ //
function crc32(arr) {
  const poly = 0xEDB88320;

	function makeTable() {
		let c;

    crc32Table = [];

		for(let n = 0; n < 256; n += 1) {
			c = n;
			for(let k = 0; k < 8; k += 1) {
				c = c & 1 ? poly ^ (c >>> 1) : c >>> 1;
			}
			crc32Table[n] = c >>> 0;
		}
	}

  if(!crc32Table) {
    makeTable();
  }

  let crc = ~0;

  for(let i = 0; i < arr.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ arr[i]) & 0xff];
  }

  return (~crc >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

// ============================================================================================================================ //
//  sha256()                                                                                                                    //
// ============================================================================================================================ //
async function sha256(arr) {
  return toHexa(await sha256$1(arr));
}

export { crc32, initialize, query, sha256 };
