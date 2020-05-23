import { strict as assert } from "assert";

const NONE = "X";

// const breakpoints = {
//   sm: true,
//   md: true,
//   lg: true,
// };

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

/** @arg {string} at */
function createKlazFunc(at) {
  /**
   * @arg {TemplateStringsArray} strings
   * @arg {(string|number)[]} keys
   */
  function klazFunc(strings, ...keys) {
    const str = (keys.length
      ? keys.map((it, i) => strings[i] + it.toString())
      : strings
    ).join("");
    const args = str.split(":").map((it) => it.trim());
    const n = args.length;
    let pseudo, prop, val;
    if (3 <= n) [pseudo, prop, val] = args;
    else if (2 === n) [prop, val] = args;
    else throw new Error("klaz: prop and val must be defined");
    if (prop == null || val == null) {
      throw new Error("klaz: prop and val must be defined");
    }
    // NOTE: Normalizes all falsy values of pseudo
    return classNameOf(at, pseudo ? pseudo : NONE, prop, val);
  }
  return klazFunc;
}

/** @type {any} */
const kz = createKlazFunc(NONE);
kz.sm = createKlazFunc("sm");
kz.md = createKlazFunc("md");
kz.lg = createKlazFunc("lg");

// /////////////////////////////////////////////////////////////////////////////
// Tests

assert.throws(() => kz``);
assert.throws(() => kz`one`);
assert.equal(kz`1:2:3:4:5`, "X_1_2_3");
assert.equal(kz`color:red`, "X_X_color_red");
assert.equal(
  kz.lg`background-image:url(./pic)`,
  "lg_X_background-image_url(./pic)"
);
assert.equal(
  kz.md` background-image : url(./pic)`,
  "md_X_background-image_url(./pic)"
);
assert.equal(kz.sm`hover:margin-bottom:-6rem`, "sm_hover_margin-bottom_-6rem");
