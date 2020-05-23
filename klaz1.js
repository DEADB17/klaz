import { strict as assert } from "assert";

const NONE = "X";

const breakpoints = {
  sm: true,
  md: true,
  lg: true,
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
  const args = str.split(";").map((it) => it.trim());
  let at,
    pseudo,
    prop,
    val,
    n = args.length;
  if (n < 2) {
    throw new Error("klaz: prop and val must be defined");
  } else if (4 < n) {
    throw new Error("klaz: at most 4 arguments");
  } else {
    val = args.pop();
    prop = args.pop();
    if (prop == null || val == null) {
      throw new Error("klaz: prop and val must be defined");
    }
  }
  n = args.length;
  if (n === 2) [at, pseudo] = args;
  if (n === 1) {
    if (args[0] in breakpoints) at = args[0];
    else pseudo = args[0];
  } // else at and pseudo are undefined
  // Normalize at and pseudo
  at = typeof at === "string" && at.length ? at : NONE;
  pseudo = typeof pseudo === "string" && pseudo.length ? pseudo : NONE;
  return classNameOf(at, pseudo, prop, val);
}

// /////////////////////////////////////////////////////////////////////////////
// Tests

assert.throws(() => kz``);
assert.throws(() => kz`one`);
assert.equal(kz`color;red`, "X_X_color_red");
assert.equal(
  kz`lg;background-image;url(./pic)`,
  "lg_X_background-image_url(./pic)"
);
assert.equal(
  kz`lg ; background-image ; url(./pic)`,
  "lg_X_background-image_url(./pic)"
);
assert.equal(kz`sm;hover;margin-bottom;-6rem`, "sm_hover_margin-bottom_-6rem");
