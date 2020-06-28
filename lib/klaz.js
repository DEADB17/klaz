import { NONE, pseudos, props, values } from "./tabs.js";

/**
 * @typedef {Record<string, object>} Kv
 * @typedef {Record<string, Record<string, Record<string, Record<string, string>>>>} StyleSheet
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
const rxEscape = new RegExp("[^_a-zA-Z0-9-]", "g");

/** @arg {string} val */
export function escapeValue(val) {
  return val.replace(rxEscape, "\\$&");
}

/**
 * @arg {(val: string) => string} fn
 * @arg {string} val
 */
export function formatValue(fn, val) {
  /** @type {string[]}*/
  const acc = [];
  return val
    .replace(/,/g, " , ") // Ensure that , are split but preserved
    .split(/\s+/)
    .reduce((acc, it) => {
      const str = it.trim();
      if (str.length < 1) return acc;
      acc.push(fn(it));
      return acc;
    }, acc)
    .join("");
}

/** @arg {string[]} classNames */
export function dedupe(classNames) {
  /** @type{Record<string, string>} */
  const acc = {};
  const map = classNames.reduce((acc, it) => {
    acc[it] = it;
    return acc;
  }, acc);
  return Object.keys(map);
}

/**
 * @arg {string} at
 * @arg {string} prop
 * @arg {string} val
 */
export function createClassName(at, prop, val) {
  const p = props[prop];
  if (at === "") at = "_";
  if (p == null) throw new Error("klaz: Invalid property");
  if (val == null) throw new Error("klaz: val must be defined");
  return at + p + val;
}

/** @arg {string} val */
export function asClassName(val) {
  return values[val] || val;
}

/** @arg {string} val */
export function asSelector(val) {
  return values[val] || escapeValue(val);
}

const rxSemi = new RegExp("\\s*;\\s*");
const rxColon = new RegExp("\\s*:\\s*");

/**
 * @arg {StyleSheet} sheet
 * @arg {Brk} brk
 * @arg {TemplateStringsArray | string} strings
 * @arg {(string|number)[]} keys
 */
export function parse(sheet, brk, strings, ...keys) {
  const n = keys.length;
  let str;
  if (0 < n) {
    const stray = new Array(n * 2 + 1);
    let i = 0,
      j = 0;
    for (; i < n; i++) {
      j = i * 2;
      stray[j] = strings[i];
      stray[++j] = keys[i].toString();
    }
    stray[++j] = strings[i];
    str = stray.join("");
  } else str = typeof strings === "string" ? strings : strings.join("");
  /** @type {string[]}*/
  const acc = [];
  const res = str.split(rxSemi).reduce((acc, it) => {
    const rule = it.trim();
    if (rule.length < 1) return acc;

    const args = rule.split(rxColon);
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
    if (!(at in brk)) throw new Error("klaz: Invalid break-point");
    if (!(pseudo in pseudos)) throw new Error("klaz: Invalid pseudo");
    acc.push(
      createClassName(at, prop || NONE, formatValue(asClassName, val || NONE))
    );
    addRule(sheet, at, pseudo, prop || NONE, val || NONE); // FIXME(db17): Side effect
    return acc;
  }, acc);
  return dedupe(res).join(" ");
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
 * @arg {BrkSpecs} specs
 */
export function render(styleSheet, specs) {
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
          const cn = createClassName(
            spec.id,
            prop,
            formatValue(asSelector, val)
          );
          const rule = `.${cn}${pseudo && ":" + pseudo} { ${prop}: ${val}; } `;
          buf.push(rule);
        }
      }
      if (spec.q !== "") buf.push(`} `);
    }
  }
  return buf.join("");
}

const rxSemiSp = new RegExp("\\s*(;\\s*)+", "g");

/**
 * @arg {string} prefix
 * @arg {string[]} args
 */
export function kzPrefix(prefix, ...args) {
  if (args == null) return "";
  if (prefix && !prefix.endsWith(":")) prefix += ":";
  return (
    args.map((it) => prefix + it.replace(rxSemiSp, "").trim()).join(";") + ";"
  );
}

/**
 * @arg {BrkSpecs} userSpecs
 */
export function klaz(userSpecs) {
  /** @type {StyleSheet} */
  let styleSheet = {};
  const { tab, specs } = createBrkTabSpec(userSpecs);

  /**
   * @arg {TemplateStringsArray | string} strings
   * @arg {(string|number)[]} keys
   */
  function kz(strings, ...keys) {
    return parse(styleSheet, tab, strings, ...keys);
  }

  /** @arg {string[]} strings */
  function ks(...strings) {
    return parse(styleSheet, tab, kzPrefix("", ...strings));
  }

  /**
   * @arg {string} prefix
   * @arg {string[]} args
   */
  function kp(prefix, ...args) {
    return parse(styleSheet, tab, kzPrefix(prefix, ...args));
  }

  function _render() {
    return render(styleSheet, specs);
  }

  return { kz, ks, kp, render: _render };
}
