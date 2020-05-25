import { NONE, pseudos, props, values } from "./tabs.js";

/**
 * @typedef {Record<string, object>} Kv
 * @typedef {Record<string, object>} Sheet
 * @typedef {Record<string, string>} Brk
 */

/**
 * @arg {Sheet?} sheet
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
  const s = pseudos[pseudo];
  const p = props[prop];
  const v = formatValue(val);
  return a + s + p + v;
}

/**
 * @arg {Brk} brk
 * @arg {TemplateStringsArray} strings
 * @arg {(string|number)[]} keys
 */
export function klaz(brk, strings, ...keys) {
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
    if (val == null) throw new Error("klaz: val must be defined");
    if (!(prop && prop in props)) throw new Error("klaz: invalid prop");
    if (!(at in brk)) throw new Error("klaz: Invalid break-point");
    if (!(pseudo in pseudos)) throw new Error("klaz: Invalid pseudo");

    acc.push(createClassName(brk, at, pseudo, prop, val));
    return acc;
  }, acc);
  return res.join(" ");
}

/**
 * @arg {Brk} breakpoints
 */
export function createKlaz(breakpoints) {
  /**
   * @arg {TemplateStringsArray} strings
   * @arg {(string|number)[]} keys
   */
  function kz(strings, ...keys) {
    return klaz(breakpoints, strings, ...keys);
  }
  return kz;
}
