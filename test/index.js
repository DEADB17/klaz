import {
  addRule,
  escapeValue,
  formatValue,
  asClassName,
  asSelector,
  createKlaz,
  kzPrefix,
  createBrkTabSpec,
  render,
} from "../lib/klaz.js";
import { NONE } from "../lib/tabs.js";
import { run, test, suite } from "@deadb17/tester/terminal.js";
import { strict as assert } from "assert";

/** @typedef {import('../lib/klaz.js').Brk} Brk */
/** @typedef {import('../lib/klaz.js').StyleSheet} StyleSheet */
/** @typedef {import('../lib/klaz.js').BrkSpecs} BrkSpecs */
/** @typedef {import('../lib/klaz.js').BrkTabSpec} BrkTabSpec */

/** @type {BrkSpecs} */
const userSpecs = [
  { id: "sm", q: "min-width:  640px" },
  { id: "md", q: "min-width:  960px" },
  { id: "lg", q: "min-width: 1280px" },
];

const { specs } = createBrkTabSpec(userSpecs);

run(
  suite(
    test("Render style sheet: Empty", () => {
      /** @type {StyleSheet} styleSheet */
      let ss = {};
      let actual = render(ss, specs);
      let expected = "";
      assert.equal(actual, expected);
    }),

    test("Render style sheet: Example 1", () => {
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
        "._4h1rem { margin: 1rem; } ._4h2px:hover { margin: 2px; } @media (min-width:  960px) { .md4h1rem { margin: 1rem; } .md4h2px:hover { margin: 2px; } } ";
      assert.equal(actual, expected);
    }),

    test("Render style sheet: Example 2", () => {
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
              "2.5rem": "2.5rem",
              "0": "0",
            },
          },
        },
      };
      let { specs } = createBrkTabSpec(userSpecs);
      let actual = render(ss, specs);
      let expected =
        "._4h0 { margin: 0; } ._4h5rem { margin: 5rem; } ._4h0:hover { margin: 0; } ._4h2px:hover { margin: 2px; } ._2j53 { display: inline; } ._2j3u:first-of-type { display: flex; } @media (min-width:  960px) { .md5i0j:hover { overflow: auto; } } @media (min-width:  960px) { .md4h0:hover { margin: 0; } .md4h2\\.5rem:hover { margin: 2.5rem; } } ";
      assert.equal(actual, expected);
    })
  ),

  // /////////////////////////////////////////////////////////////////////////////

  test("addRule", () => {
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
  }),

  // /////////////////////////////////////////////////////////////////////////////

  test("escapeValue", () => {
    assert.equal(escapeValue("-ab-cd_0"), "-ab-cd_0");
    assert.equal(escapeValue("123456"), "123456");
    assert.equal(escapeValue("123.456"), "123\\.456");
    assert.equal(
      escapeValue("~!@#$%^&*()+="),
      "\\~\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\+\\="
    );
  }),

  ////////////////////////////////////////////////////////////////////////////////

  test("formatValue", () => {
    assert.equal(formatValue(asClassName, "1px"), "1px");
    assert.equal(formatValue(asSelector, "1px"), "1px");
    assert.equal(formatValue(asClassName, "auto"), "0j");
    assert.equal(formatValue(asSelector, "auto"), "0j");
    assert.equal(formatValue(asClassName, "auto auto auto"), "0j0j0j");
    assert.equal(formatValue(asSelector, "auto auto auto"), "0j0j0j");
    assert.equal(formatValue(asClassName, "auto,auto,auto"), "0j,0j,0j");
    assert.equal(formatValue(asSelector, "auto,auto,auto"), "0j\\,0j\\,0j");
  }),

  ////////////////////////////////////////////////////////////////////////////////

  test("kz: Single rule", () => {
    const { kz } = createKlaz(userSpecs);
    assert.equal(kz`color:red`, "_1yred");
    assert.throws(() => kz`one`, "Too few: Single arg");
    assert.equal(kz``, "", "OK: no arguments");
    assert.equal(kz`margin-bottom:-6rem`, "_4i-6rem");
    assert.equal(kz`sm:margin-bottom:-6rem`, "sm4i-6rem");
    assert.equal(kz`hover:margin-bottom:-6rem`, "_4i-6rem");
    assert.equal(kz`sm:hover:margin-bottom:-6rem`, "sm4i-6rem");
    assert.equal(kz`md:background-size:cover`, "md0n25");
    assert.equal(kz`lg : background-size : auto 6px`, "lg0n0j6px");
    assert.equal(kz`background-size : auto, 50%, contain`, "_0n0j,50%,1y");
  }),

  test("kz: Rules with interpolated values", () => {
    const { kz } = createKlaz(userSpecs);
    assert.equal(kz`color:${"red"}`, "_1yred");
    assert.throws(() => kz`o${"n"}e`, "Too few: Single arg");
    assert.equal(kz`${""}`, "", "OK: no arguments");
    assert.equal(kz`${""}m${"ar"}gin-bottom:${"-6rem"}`, "_4i-6rem");
    assert.equal(
      kz`${"sm"}:${"hover"}:${"margin-bottom"}:${"-6rem"}`,
      "sm4i-6rem"
    );
  }),

  ////////////////////////////////////////////////////////////////////////////////

  suite(
    test("kz: Multiple rules", () => {
      const { kz } = createKlaz(userSpecs);
      const actual = kz`
color: red;
padding-top: 0;
text-decoration: none
`;
      const expected = "_1yred _5q0 _7h7e";
      assert.equal(actual, expected);
    }),
    test("kz: Multiple rules with multiple ;", () => {
      const { kz } = createKlaz(userSpecs);
      const actual = kz`;
color: red;;
padding-top: 0;
text-decoration: none;
`;
      const expected = "_1yred _5q0 _7h7e";
      assert.equal(actual, expected, "extra ;");
    }),
    test("kz: Multiple rules with multiple ; and spaces", () => {
      const { kz } = createKlaz(userSpecs);
      const actual = kz`;
sm:color: red;; ;;
md:hover:padding-top: 0;;
active:text-decoration: none   ; ;; ;
`;
      const expected = "sm1yred md5q0 _7h7e";
      assert.equal(actual, expected, "combo");
    }),

    test("kz: Multiple rules", () => {
      const { kz } = createKlaz(userSpecs);
      const actual = kz`;
sm:color: red;
sm:color: red;
md:active:text-decoration: none;
md:hover:padding-top: 0;
active:text-decoration: none;
lg:hover:padding-top: 0;
`;
      const expected = "sm1yred md7h7e md5q0 _7h7e lg5q0";
      assert.equal(actual, expected, "duplicates");
    })
  ),

  ////////////////////////////////////////////////////////////////////////////////

  suite(
    test("ks: Join strings before parsing", () => {
      const { ks } = createKlaz(userSpecs);
      const color = { red: "#F00" };
      const gut = ["0", "1px", "2px"];
      const actual = ks(
        "sm:hover:padding-left:" + gut[1],
        "color:" + color.red
      );
      const expected = "sm5o1px _1y#F00";
      assert.equal(actual, expected);
    })
  ),

  ////////////////////////////////////////////////////////////////////////////////

  suite(
    test("kzPrefix: Single string", () => {
      const actual = "color: red";
      const expected = "hover:color: red;";
      assert.equal(kzPrefix("hover", actual), expected);
    }),

    test("kzPrefix: Multiple strings", () => {
      const actual = kzPrefix("sm", "color: red", "padding-top: 0");
      const expected = "sm:color: red;sm:padding-top: 0;";
      assert.equal(actual, expected);
    }),

    test("kzPrefix: No prefix. Multiple strings", () => {
      const actual = kzPrefix("", "color: red", "padding-top: 0");
      const expected = "color: red;padding-top: 0;";
      assert.equal(actual, expected);
    }),

    test("kzPrefix: Multiple strings with ; and spaces", () => {
      const actual = kzPrefix("", "color: red ;   ;; ;  ", "padding-top: 0; ");
      const expected = "color: red;padding-top: 0;";
      assert.equal(actual, expected);
    })
  )
);
