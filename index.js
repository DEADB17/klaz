import { strict as assert } from "assert";

const NONE = "X";

const breakpoints = {
  sm: true,
  md: true,
  lg: true,
};

const pseudos = {
  active: true,
  after: true,
  before: true,
  checked: true,
  disabled: true,
  empty: true,
  enabled: true,
  "first-child": true,
  "first-letter": true,
  "first-line": true,
  "first-of-type": true,
  focus: true,
  hover: true,
  "lang(": true,
  "last-child": true,
  "last-of-type": true,
  link: true,
  "not(": true,
  "nth-child(": true,
  "nth-last-child(": true,
  "nth-last-of-type(": true,
  "nth-of-type(": true,
  "only-child": true,
  "only-of-type": true,
  root: true,
  target: true,
  visited: true,
};

const arrayJoin = Array.prototype.join;

/**
 * @arg {string} _at
 * @arg {string} _pseudo
 * @arg {string} _prop
 * @arg {string} _val
 */
function classNameOf(_at, _pseudo, _prop, _val) {
  return arrayJoin.call(arguments, "_");
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
    if (!isValid(at, breakpoints)) throw new Error("klaz: Invalid break-point");
    if (!isValid(pseudo, pseudos))
      throw new Error("klaz: Invalid pseudo-class/element");
  } else {
    // 3 elements
    val = args.pop();
    prop = args.pop();
    if (args[0] in breakpoints) {
      at = args[0];
      pseudo = NONE;
    } else if (args[0] in pseudos) {
      at = NONE;
      pseudo = args[0];
    } else throw new Error("klaz: Invalid break-point or pseudo-class/element");
  }
  if (prop == null || val == null) {
    throw new Error("klaz: prop and val must be defined");
  }
  return classNameOf(at, pseudo, prop, val);
}

/**
 * @arg {any} key
 * @arg {Record<string, any>} set
 */
function isValid(key, set) {
  return typeof key === "string" && 0 < key.length && key in set;
}

// /////////////////////////////////////////////////////////////////////////////
// Tests

assert.equal(kz`color:red`, "X_X_color_red");
assert.throws(() => kz`one`); // too few
assert.throws(() => kz``); // too few
assert.equal(kz`margin-bottom:-6rem`, "X_X_margin-bottom_-6rem");
assert.equal(kz`sm:margin-bottom:-6rem`, "sm_X_margin-bottom_-6rem");
assert.equal(kz`hover:margin-bottom:-6rem`, "X_hover_margin-bottom_-6rem");
assert.equal(kz`sm:hover:margin-bottom:-6rem`, "sm_hover_margin-bottom_-6rem");
assert.equal(kz`md:background-size:cover`, "md_X_background-size_cover");
assert.equal(
  kz`lg : background-size : auto 6px`,
  "lg_X_background-size_auto 6px"
);
assert.equal(
  kz`background-size : auto, 50%, contain`,
  "X_X_background-size_auto, 50%, contain"
);

console.log("ok");
