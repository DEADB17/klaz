import { run, test } from "@deadb17/tester/terminal.js";
import { strict as assert } from "assert";
import { createKlaz } from "../lib/klaz.js";

/** @typedef {import('../lib/klaz.js').BrkSpecs} BrkSpecs */

run(
  test("Readme example", () => {
    /** @type {BrkSpecs} */
    const breakPoints = [
      { id: "sm", q: "min-width:  640px" },
      { id: "md", q: "min-width:  960px" },
      { id: "lg", q: "min-width: 1280px" },
    ];

    const { kz, render } = createKlaz(breakPoints);
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
      "_7h7e _1ypurple sm1yred sm1yyellow md1ygreen md1yolive md1ybrown lg1yred lg1yyellow"
    );

    const ss = render();

    const expected =
      "._7h7e { text-decoration: none; } ._1ypurple { color: purple; } @media (min-width:  640px) { .sm1yred { color: red; } .sm1yyellow:hover { color: yellow; } } @media (min-width:  960px) { .md1ygreen { color: green; } .md1yolive:first-of-type { color: olive; } .md1ybrown:hover { color: brown; } } @media (min-width: 1280px) { .lg1yred { color: red; } .lg1yyellow:hover { color: yellow; } } ";

    assert.equal(ss, expected);
  })
);
