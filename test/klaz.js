import { NONE } from "../lib/tabs.js";

/**
 * @typedef {Record<string, object>} Kv
 * @typedef {Record<string, object>} Sheet
 */

/**
 * @arg {Sheet?} sheet
 * @arg {string} at
 * @arg {string} pseudo
 * @arg {string} prop
 * @arg {string} val
 */
function addRule(sheet, at, pseudo, prop, val) {
  const args = [at, prop, pseudo, val];
  const len = args.length;
  /** @type {Kv[]} */
  const stack = new Array(len);
  stack[0] = sheet || /** @type {Kv} */ ({});
  for (let i = 0, n = len - 1; i < n; i++) {
    stack[i + 1] = /** @type {Kv} */ (stack[i][args[i]] || {});
  }
  /** @type {any} */
  let top;
  for (let tmp = val, n = len; n--; ) {
    top = stack[n];
    top[args[n]] = tmp;
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
      margin: {
        [NONE]: {
          "0": "0",
        },
      },
    },
  };
  assert.deepEqual(actual, expected, "creates missing");

  actual = addRule(actual, NONE, NONE, "margin", "0");
  expected = {
    [NONE]: {
      margin: {
        [NONE]: {
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
      margin: {
        [NONE]: {
          "2px": "2px",
          "0": "0",
        },
      },
      display: {
        first: {
          flex: "flex",
        },
      },
    },
    md: {
      overflow: {
        hover: {
          auto: "auto",
        },
      },
    },
  };
  assert.deepEqual(actual, expected, "add variations");
}

console.log("ok");
