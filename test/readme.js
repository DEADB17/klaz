import { run, test } from "@deadb17/tester/terminal.js";
import { strict as assert } from "assert";
import { klaz } from "../lib/klaz.js";

/** @typedef {import('../lib/klaz.js').BrkSpecs} BrkSpecs */

run(
  test("Readme example", () => {
    /** @type {BrkSpecs} */
    const breakPoints = [
      { id: "sm", q: "min-width:  640px" },
      { id: "md", q: "min-width:  960px" },
      { id: "lg", q: "min-width: 1280px" },
    ];

    const { kz, render } = klaz(breakPoints);
    const classNames = kz`;
text-decoration: none;
color:purple;
sm:color: red;
sm:hover:color: yellow;
md:color: green;
md:first-of-type:color: olive;
md:hover:color: brown;
lg:color: red;
lg:hover:color: yellow;
`;

    assert.equal(
      classNames,
      "k7h7e k1ypurple k1yred k1yyellow k1ygreen k1yolive k1ybrown"
    );

    const ss = render();

    const expected =
      ".k7h7e { text-decoration: none; } .k1ypurple { color: purple; } @media (min-width:  640px) { .k1yred { color: red; } .k1yyellow:hover { color: yellow; } } @media (min-width:  960px) { .k1ygreen { color: green; } .k1yolive:first-of-type { color: olive; } .k1ybrown:hover { color: brown; } } @media (min-width: 1280px) { .k1yred { color: red; } .k1yyellow:hover { color: yellow; } } ";

    assert.equal(ss, expected);
  })
);
