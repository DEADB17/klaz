import { addRule } from "../lib/index.js";
import { NONE } from "../lib/tabs.js";
import { strict as assert } from "assert";

console.log("addRule");

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

console.log("ok");
