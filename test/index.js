import { addRule, escapeValue, formatValue, createKlaz } from "../lib/klaz.js";
import { NONE } from "../lib/tabs.js";
import { strict as assert } from "assert";

/** @type {import('../lib/klaz.js').Brk} */
const breakpoints = {
  [NONE]: "X",
  sm: "s",
  md: "m",
  lg: "l",
};

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
  const kz = createKlaz(breakpoints);
  assert.equal(kz`color:red`, "X01yred");
  assert.throws(() => kz`one`, "Too few: Single arg");
  assert.equal(kz``, "", "OK: no arguments");
  assert.equal(kz`margin-bottom:-6rem`, "X04i-6rem");
  assert.equal(kz`sm:margin-bottom:-6rem`, "s04i-6rem");
  assert.equal(kz`hover:margin-bottom:-6rem`, "Xd4i-6rem");
  assert.equal(kz`sm:hover:margin-bottom:-6rem`, "sd4i-6rem");
  assert.equal(kz`md:background-size:cover`, "m00n25");
  assert.equal(kz`lg : background-size : auto 6px`, "l00n0j6px");
  assert.equal(kz`background-size : auto, 50%, contain`, "X00n0j,50%,1y");
}

console.log("ok");

////////////////////////////////////////////////////////////////////////////////

console.log("kz: Multiple rules");

{
  const kz = createKlaz(breakpoints);
  const actual = kz`
color: red;
padding-top: 0;
text-decoration: none
`;
  const expected = "X01yred X05q0 X07h7e";
  assert.equal(actual, expected);
}
{
  const kz = createKlaz(breakpoints);
  const actual = kz`;
color: red;;
padding-top: 0;
text-decoration: none;
`;
  const expected = "X01yred X05q0 X07h7e";
  assert.equal(actual, expected, "extra ;");
}
console.log("ok");
