import { NONE, pseudos, props, values } from "./tabs.js";

/**
 * @typedef {Record<string, object>} Kv
 * @typedef {Record<string, object>} StyleSheet
 * @typedef {Record<string, string>} Brk
 * @typedef {{id: string, q: string}[]} BrkSpecs
 * @typedef {{tab: Brk, specs: BrkSpecs}} BrkTabSpec
 */

/**
 * @arg {StyleSheet?} sheet
 * @arg {string} at
 * @arg {string} pseudo
 * @arg {string} prop
 * @arg {string} val
 */
export function addRule(sheet, at, pseudo, prop, val) {
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

// TODO(db17): Is this spec compliant?
// https://www.w3.org/TR/CSS21/grammar.html#scanner
// -?[_a-zA-Z]+[_a-zA-Z0-9-]*
/** @arg {string} val */
export function escapeValue(val) {
  return val.replace(/[^_a-zA-Z0-9-]/g, "$&");
}

/** @arg {string} val */
export function formatValue(val) {
  /** @type {string[]}*/
  const acc = [];
  return val
    .replace(/,/g, " , ") // Ensure that , are split but preserved
    .split(/\s+/)
    .reduce((acc, it) => {
      const str = it.trim();
      if (str.length < 1) return acc;
      acc.push(values[it] || escapeValue(it));
      return acc;
    }, acc)
    .join("");
}

// TODO(db17): break-points and pseudos are not really needed (Remove them)
/**
 * @arg {Brk} brk
 * @arg {string} at
 * @arg {string} pseudo
 * @arg {string} prop
 * @arg {string} val
 */
export function createClassName(brk, at, pseudo, prop, val) {
  const a = brk[at];
  if (a == null) throw new Error("klaz: Invalid break-point");
  const s = pseudos[pseudo];
  if (s == null) throw new Error("klaz: Invalid pseudo");
  const p = props[prop];
  if (p == null) throw new Error("klaz: Invalid property");
  if (val == null) throw new Error("klaz: val must be defined");
  const v = formatValue(val);
  return a + s + p + v;
}

/**
 * @arg {StyleSheet} sheet
 * @arg {Brk} brk
 * @arg {TemplateStringsArray} strings
 * @arg {(string|number)[]} keys
 */
export function klaz(sheet, brk, strings, ...keys) {
  const str = (keys.length
    ? keys.map((it, i) => strings[i] + it.toString())
    : strings
  ).join("");
  /** @type {string[]}*/
  const acc = [];
  const res = str.split(/\s*;\s*/).reduce((acc, it) => {
    const rule = it.trim();
    if (rule.length < 1) return acc;

    const args = rule.split(/\s*:\s*/);
    const n = args.length;
    let at, pseudo, prop, val;
    if (n < 2) throw new Error("klaz: prop and val must be defined");
    else if (2 === n) {
      [prop, val] = args;
      at = pseudo = NONE;
    } else if (4 <= n) {
      [at, pseudo, prop, val] = args;
    } else {
      // 3 elements
      val = args.pop();
      prop = args.pop();
      if (args[0] in brk) {
        at = args[0];
        pseudo = NONE;
      } else {
        at = NONE;
        pseudo = args[0];
      }
    }
    acc.push(createClassName(brk, at, pseudo, prop || NONE, val || NONE));
    addRule(sheet, at, pseudo, prop || NONE, val || NONE); // FIXME(db17): Side effect
    return acc;
  }, acc);
  return res.join(" ");
}

/** @arg {BrkSpecs} userSpecs */
export function createBrkTabSpec(userSpecs) {
  /** @type {Brk} */
  const tab = { [NONE]: "Z" };
  const specs = [{ id: NONE, q: "" }];
  for (const mq of userSpecs) {
    tab[mq.id] = mq.id;
    specs.push(mq);
  }
  return { tab, specs };
}

/**
 * @arg {StyleSheet} styleSheet
 * @arg {Brk} tab
 * @arg {BrkSpecs} specs
 */
export function render(styleSheet, tab, specs) {
  /** @type {string[]}*/
  const buf = [];
  for (const spec of specs) {
    const props = styleSheet[spec.id];
    for (const prop in props) {
      if (spec.q !== "") buf.push(`@media (${spec.q}) { `);
      const pseudos = props[prop];
      for (const pseudo in pseudos) {
        const vals = pseudos[pseudo];
        for (const val in vals) {
          const cn = createClassName(tab, spec.id, pseudo, prop, val);
          const rule = `${cn}${pseudo && ":" + pseudo} { ${prop}: ${val}; } `;
          buf.push(rule);
        }
      }
      if (spec.q !== "") buf.push(`} `);
    }
  }
  return buf.join("");
}

/**
 * @arg {BrkSpecs} userSpecs
 */
export function createKlaz(userSpecs) {
  /** @type {StyleSheet} */
  let styleSheet = {};
  const { tab, specs } = createBrkTabSpec(userSpecs);
  /**
   * @arg {TemplateStringsArray} strings
   * @arg {(string|number)[]} keys
   */
  function kz(strings, ...keys) {
    return klaz(styleSheet, tab, strings, ...keys);
  }

  function _render() {
    return render(styleSheet, tab, specs);
  }

  return { kz, render: _render };
}
