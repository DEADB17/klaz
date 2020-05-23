import { strict as assert } from "assert";

const NONE = "X";

const breakpoints = {
  sm: true,
  md: true,
  lg: true,
};

const pseudos = {
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
  const args = str.split(":").map((it) => it.trim());
  let at,
    pseudo,
    prop,
    val,
    n = args.length;
  if (n < 2) {
    throw new Error("klaz: prop and val must be defined");
  } else if (4 <= n) {
    [at, pseudo, at, pseudo] = args;
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

assert.equal(kz`color:red`, "X_X_color_red");
assert.throws(() => kz`one`); // too few
assert.throws(() => kz``); // too few
assert.equal(kz`margin-bottom:-6rem`, "X_X_margin-bottom_-6rem");
assert.equal(kz`sm:margin-bottom:-6rem`, "sm_X_margin-bottom_-6rem");
assert.equal(kz`hover:margin-bottom:-6rem`, "X_hover_margin-bottom_-6rem");
assert.equal(kz`sm:hover:margin-bottom:-6rem`, "sm_hover_margin-bottom_-6rem");
assert.equal(
  kz`md:background-size:cover`,
  "md_X_background-size_cover"
);
assert.equal(
  kz`lg : background-size : auto 6px`,
  "lg_X_background-size_auto 6px"
);
assert.equal(
  kz`background-size : auto, 50%, contain`,
  "X_X_background-size_auto, 50%, contain"
);
