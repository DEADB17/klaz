import { strict as assert } from "assert";

const NONE = "X";

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
   * @arg {string | undefined} pseudo
   * @arg {string} prop
   * @arg {string} val
   */
  function klazFunc(pseudo, prop, val) {
    if (arguments.length === 2) {
      val = prop;
      prop = /** @type {string} */ (pseudo);
      pseudo = undefined;
    }
    if (prop == null || val == null) {
      throw new Error("Invalid klaz domain: prop and val must be defined");
    }
    // NOTE: Normalizes all falsy values of pseudo
    return classNameOf(at, pseudo ? pseudo : NONE, prop, val);
  }
  return klazFunc;
}

/** @type {any} */
const klaz = createKlazFunc(NONE);
klaz.sm = createKlazFunc("sm");
klaz.md = createKlazFunc("md");
klaz.lg = createKlazFunc("lg");

// /////////////////////////////////////////////////////////////////////////////
// Tests

assert.throws(() => klaz());
assert.throws(() => klaz("one"));
assert.equal(klaz("color", "red"), "X_X_color_red");
assert.equal(
  klaz.lg("background-image", "url(./pic)"),
  "lg_X_background-image_url(./pic)"
);
assert.equal(
  klaz.sm("hover", "margin-bottom", "-6rem"),
  "sm_hover_margin-bottom_-6rem"
);
