import { NONE } from "../lib/tabs.js";

/**
 * @typedef {Record<string, object>} Kv
 * @typedef {Record<string, object>} Sheet
 */

/**
 * @arg {Sheet?} sheet
 * @arg {string} _at
 * @arg {string} _pseudo
 * @arg {string} _prop
 * @arg {string} val
 */
function addRule(sheet, _at, _pseudo, _prop, val) {
  /** @type {Kv[]} */
  const stack = [sheet || /** @type {Kv} */ ({})];
  for (let i = 1, n = arguments.length - 1; i < n; i++) {
    stack[i] = /** @type {Kv} */ (stack[i - 1][arguments[i]] || {});
  }
  /** @type {any} */
  let top;
  for (let tmp = val, n = arguments.length; --n; ) {
    top = stack[n - 1];
    top[arguments[n]] = tmp;
    tmp = top;
  }
  return top;
}

// /////////////////////////////////////////////////////////////////////////////
// Tests

import { strict as assert } from "assert";

{
  let actual, expected;
  actual = addRule(null, NONE, NONE, "margin", "0");
  expected = {
    [NONE]: {
      [NONE]: {
        margin: {
          "0": "0",
        },
      },
    },
  };
  assert.deepEqual(actual, expected, "creates missing");

  actual = addRule(actual, NONE, NONE, "margin", "0");
  expected = {
    [NONE]: {
      [NONE]: {
        margin: {
          "0": "0",
        },
      },
    },
  };
  assert.deepEqual(actual, expected, "is idempotent");

  actual = addRule(actual, NONE, NONE, "margin", "2px");
  actual = addRule(actual, NONE, "first", "display", "flex");
  actual = addRule(actual, "md", "hover", "overflow", "auto");
  expected = {
    [NONE]: {
      [NONE]: {
        margin: {
          "2px": "2px",
          "0": "0",
        },
      },
      first: {
        display: {
          flex: "flex",
        },
      },
    },
    md: {
      hover: {
        overflow: {
          auto: "auto",
        },
      },
    },
  };
  assert.deepEqual(actual, expected, "add variations");
}

console.log("ok");
