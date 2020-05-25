import { strict as assert } from "assert";
import { NONE, pseudos, props, values } from "../lib/tabs.js";

/** @type {Record<string,string>} */
const breakpoints = {
  [NONE]: "X",
  sm: "s",
  md: "m",
  lg: "l",
};

// TODO(db17): Is this spec compliant?
/** @arg {string} val */
function escapeValue(val) {
  return val.replace(/[^_a-zA-Z0-9-]/g, "$&");
}

/** @arg {string} val */
function formatValue(val) {
  /** @type {string[]}*/
  const acc = [];
  return val
    .replace(/,/g, " , ") // Ensure that , are split but preserved
    .split(/\s+/)
    .reduce((acc, it) => {
      const str = it.trim();
      if (str.length < 1) return acc;
      acc.push(values[it] || escapeValue(it));
      return acc;
    }, acc)
    .join("");
}

// TODO(db17): break-points and pseudos are not really needed (Remove them)
/**
 * @arg {string} at
 * @arg {string} pseudo
 * @arg {string} prop
 * @arg {string} val
 */
function classNameOf(at, pseudo, prop, val) {
  const a = breakpoints[at];
  const s = pseudos[pseudo];
  const p = props[prop];
  const v = formatValue(val);
  return a + s + p + v;
}

/**
 * @arg {TemplateStringsArray} strings
 * @arg {(string|number)[]} keys
 */
function kz(strings, ...keys) {
  const str = (keys.length
    ? keys.map((it, i) => strings[i] + it.toString())
    : strings
  ).join("");
  const args = str.split(":").map((it) => it.trim());
  const n = args.length;
  let at, pseudo, prop, val;
  if (n < 2) throw new Error("klaz: prop and val must be defined");
  else if (2 === n) {
    [prop, val] = args;
    at = pseudo = NONE;
  } else if (4 <= n) {
    [at, pseudo, prop, val] = args;
  } else {
    // 3 elements
    val = args.pop();
    prop = args.pop();
    if (args[0] in breakpoints) {
      at = args[0];
      pseudo = NONE;
    } else {
      at = NONE;
      pseudo = args[0];
    }
  }
  if (val == null) throw new Error("klaz: val must be defined");
  if (!(prop && prop in props)) throw new Error("klaz: invalid prop");
  if (!(at in breakpoints)) throw new Error("klaz: Invalid break-point");
  if (!(pseudo in pseudos)) throw new Error("klaz: Invalid pseudo");
  return classNameOf(at, pseudo, prop, val);
}

// /////////////////////////////////////////////////////////////////////////////
// Tests

console.log("escapeValue");

assert.equal(escapeValue("-ab-cd_0"), "-ab-cd_0");
assert.equal(escapeValue("123456"), "123456");
assert.equal(escapeValue("~!@#$%^&*()+="), "~!@#$%^&*()+=");

console.log("ok");

////////////////////////////////////////////////////////////////////////////////

console.log("formatValue");

assert.equal(formatValue("1px"), "1px");
assert.equal(formatValue("auto"), "0j");
assert.equal(formatValue("auto auto auto"), "0j0j0j");
assert.equal(formatValue("auto,auto,auto"), "0j,0j,0j");

console.log("ok");

////////////////////////////////////////////////////////////////////////////////

console.log("kz");

assert.equal(kz`color:red`, "X01yred");
assert.throws(() => kz`one`); // too few
assert.throws(() => kz``); // too few
assert.equal(kz`margin-bottom:-6rem`, "X04i-6rem");
assert.equal(kz`sm:margin-bottom:-6rem`, "s04i-6rem");
assert.equal(kz`hover:margin-bottom:-6rem`, "Xd4i-6rem");
assert.equal(kz`sm:hover:margin-bottom:-6rem`, "sd4i-6rem");
assert.equal(kz`md:background-size:cover`, "m00n25");
assert.equal(kz`lg : background-size : auto 6px`, "l00n0j6px");
assert.equal(kz`background-size : auto, 50%, contain`, "X00n0j\,50\%\,1y");

console.log("ok");
