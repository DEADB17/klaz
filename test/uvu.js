// tests/demo.js
import { test } from "uvu";
import * as assert from "uvu/assert";

////////////////////////////////////////////////////////////////////////////////

/** @arg {number} num */
export const gut = (num) => 16 * num + "px";

const cls = {
  marginTop: gut(1),
  hover: {
    margin: gut(2)
  },
  '@media (min-width: 640px)': {
    margin: gut(3)
  }
};

////////////////////////////////////////////////////////////////////////////////

// const allSymbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-0123456789'.split('');
// const iniSymbols = allSymbols.slice(0, allSymbols.indexOf('-'));

const allSymbols = 'AB'.split('');
const radix = allSymbols.length;

// console.log(allSymbols);
// console.log(iniSymbols);


function convert1(decimal) {
  const remainder = [0];
  let quotient = decimal;
  let place    = 0;

  while (0 !== quotient) {
    const modulo = quotient % radix;
    quotient = (quotient - modulo) / radix;
    remainder[place++] = modulo;
  }

  const digits = new Array(place + 1);
  let index = 0;
  while (index <= place) digits[index] = allSymbols[remainder[place - index++]];

  console.log(decimal, "in base", radix, "is", digits.join(''), '- Rem', remainder.join(''));
}

function convert2(decimal) {
  const remainder = [0];
  let quotient = decimal;
  let place    = 0;

  do {
    const modulo = quotient % radix;
    quotient = (quotient - modulo) / radix;
    remainder[place++] = modulo;
    console.log('dec:', decimal, 'place:', place - 1, 'modulo:', modulo, 'quotient:', quotient)
  } while (0 !== quotient)

  const digits = new Array(place + 1);
  let index = 0;
  while (index <= place) digits[index] = allSymbols[remainder[place - index++]];

  //console.log(decimal, "in base", radix, "is", digits.join(''), '- Rem', remainder.join(''));
}

// convert1(237)
// for (let i = 0; i <= 16; i++) convert1(i);
// for (let i = 0; i <= 2; i++) convert2(i);
// convert2(2);
// convert(25);
// convert(26);
// convert(27);
// convert(53);
// convert(54);
// convert(63);
// convert(64);
// convert(4095);
// convert(4096);
// convert(4097);

////////////////////////////////////////////////////////////////////////////////

test("", () => {
});

test.run();

/*
function makeRange(s, e) {
  const len = e - s + 1;
  const res = new Array(len);
  for (let i = 0; i < len; i++) res[i] = String.fromCharCode(i + s);
  return res.join('');
}

let s, e;

s = '0'.charCodeAt(0);
e = '9'.charCodeAt(0);
console.log(makeRange(s,e));

s = 'A'.charCodeAt(0);
e = 'Z'.charCodeAt(0);
console.log(makeRange(s,e));

s = 'a'.charCodeAt(0);
e = 'z'.charCodeAt(0);
console.log(makeRange(s,e));
*/

// const digits = [];
// let num = 12;
// let r = radix ** 1;
// console.log(Math.floor(num / r), num % radix)
// num = Math.floor(num / r)
// r = radix ** 2;
// console.log(Math.floor(num / r), num % radix)
// num = Math.floor(num / r)
// r = radix ** 3;
// console.log(Math.floor(num / r), num % radix)

function f(dec) {
  let num = dec;
  const res = [];
  let step, r;
  step = 0;
  do {
    r = (radix ** step);
    const m = num % radix;
    res.unshift(m);
    num = Math.floor((num - m) / r);
    step++;
  } while (num > 0);
  console.log(dec < 10 ? ' ' : '', dec, '=', res);
}
for (let i = 0; i <= 14; i++) f(i);