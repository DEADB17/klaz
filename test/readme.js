import { strict as assert } from "assert";

/** @typedef {import('../lib/klaz.js').BrkSpecs} BrkSpecs */

console.log("Readme example");

import { klaz } from "../lib/klaz.js";

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
  "c7h7e c1ypurple c1yred c1yyellow c1ygreen c1yolive c1ybrown"
);

const ss = render();

const expected =
  "c7h7e { text-decoration: none; } c1ypurple { color: purple; } @media (min-width:  640px) { c1yred { color: red; } c1yyellow:hover { color: yellow; } } @media (min-width:  960px) { c1ygreen { color: green; } c1yolive:first-of-type { color: olive; } c1ybrown:hover { color: brown; } } @media (min-width: 1280px) { c1yred { color: red; } c1yyellow:hover { color: yellow; } } ";

assert.equal(ss, expected);

console.log("ok");
