import {
  addRule,
  escapeValue,
  formatValue,
  klaz,
  createBrkTabSpec,
  render,
} from "../lib/klaz.js";
import { NONE } from "../lib/tabs.js";
import { strict as assert } from "assert";

/** @typedef {import('../lib/klaz.js').Brk} Brk */
/** @typedef {import('../lib/klaz.js').StyleSheet} StyleSheet */
/** @typedef {import('../lib/klaz.js').BrkSpecs} BrkSpecs */
/** @typedef {import('../lib/klaz.js').BrkTabSpec} BrkTabSpec */

// /////////////////////////////////////////////////////////////////////////////

console.log("render");

/** @type {BrkSpecs} */
const userSpecs = [
  { id: "sm", q: "min-width:  640px" },
  { id: "md", q: "min-width:  960px" },
  { id: "lg", q: "min-width: 1280px" },
];

{
  /** @type {StyleSheet} styleSheet */
  let ss = {};
  let { specs } = createBrkTabSpec(userSpecs);
  let actual = render(ss, specs);
  let expected = "";
  assert.equal(actual, expected);
}

{
  let ss = {
    [NONE]: {
      margin: {
        [NONE]: {
          "1rem": "1rem",
        },
        hover: {
          "2px": "2px",
        },
      },
    },
    md: {
      margin: {
        [NONE]: {
          "1rem": "1rem",
        },
        hover: {
          "2px": "2px",
        },
      },
    },
  };
  let { specs } = createBrkTabSpec(userSpecs);
  let actual = render(ss, specs);
  let expected =
    "k4h1rem { margin: 1rem; } k4h2px:hover { margin: 2px; } @media (min-width:  960px) { k4h1rem { margin: 1rem; } k4h2px:hover { margin: 2px; } } ";
  assert.equal(actual, expected);
}

{
  let ss = {
    [NONE]: {
      margin: {
        [NONE]: {
          "5rem": "5rem",
          "0": "0",
        },
        hover: {
          "2px": "2px",
          "0": "0",
        },
      },
      display: {
        [NONE]: {
          inline: "inline",
        },
        "first-of-type": {
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
      margin: {
        hover: {
          "2px": "2px",
          "0": "0",
        },
      },
    },
  };
  let { specs } = createBrkTabSpec(userSpecs);
  let actual = render(ss, specs);
  let expected =
    "k4h0 { margin: 0; } k4h5rem { margin: 5rem; } k4h0:hover { margin: 0; } k4h2px:hover { margin: 2px; } k2j53 { display: inline; } k2j3u:first-of-type { display: flex; } @media (min-width:  960px) { k5i0j:hover { overflow: auto; } } @media (min-width:  960px) { k4h0:hover { margin: 0; } k4h2px:hover { margin: 2px; } } ";
  assert.equal(actual, expected);
}

console.log("ok");

// /////////////////////////////////////////////////////////////////////////////

console.log("addRule");

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

// /////////////////////////////////////////////////////////////////////////////

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

console.log("kz: Single rule");

{
  const { kz } = klaz(userSpecs);
  assert.equal(kz`color:red`, "k1yred");
  assert.throws(() => kz`one`, "Too few: Single arg");
  assert.equal(kz``, "", "OK: no arguments");
  assert.equal(kz`margin-bottom:-6rem`, "k4i-6rem");
  assert.equal(kz`sm:margin-bottom:-6rem`, "k4i-6rem");
  assert.equal(kz`hover:margin-bottom:-6rem`, "k4i-6rem");
  assert.equal(kz`sm:hover:margin-bottom:-6rem`, "k4i-6rem");
  assert.equal(kz`md:background-size:cover`, "k0n25");
  assert.equal(kz`lg : background-size : auto 6px`, "k0n0j6px");
  assert.equal(kz`background-size : auto, 50%, contain`, "k0n0j,50%,1y");
}

console.log("ok");

////////////////////////////////////////////////////////////////////////////////

console.log("kz: Multiple rules");

{
  const { kz } = klaz(userSpecs);
  const actual = kz`
color: red;
padding-top: 0;
text-decoration: none
`;
  const expected = "k1yred k5q0 k7h7e";
  assert.equal(actual, expected);
}
{
  const { kz } = klaz(userSpecs);
  const actual = kz`;
color: red;;
padding-top: 0;
text-decoration: none;
`;
  const expected = "k1yred k5q0 k7h7e";
  assert.equal(actual, expected, "extra ;");
}
{
  const { kz } = klaz(userSpecs);
  const actual = kz`;
sm:color: red;
md:hover:padding-top: 0;
active:text-decoration: none;
`;
  const expected = "k1yred k5q0 k7h7e";
  assert.equal(actual, expected, "combo");
}

{
  const { kz } = klaz(userSpecs);
  const actual = kz`;
sm:color: red;
sm:color: red;
md:active:text-decoration: none;
md:hover:padding-top: 0;
active:text-decoration: none;
lg:hover:padding-top: 0;
`;
  const expected = "k1yred k7h7e k5q0";
  assert.equal(actual, expected, "duplicates");
}

console.log("ok");
