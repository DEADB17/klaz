/**
 * @typedef {Record<string, object>} Kv
 * @typedef {Record<string, object>} Sheet
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
