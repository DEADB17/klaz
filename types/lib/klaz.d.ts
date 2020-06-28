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
export function addRule(sheet: StyleSheet | null, at: string, pseudo: string, prop: string, val: string): any;
/** @arg {string} val */
export function escapeValue(val: string): string;
/**
 * @arg {(val: string) => string} fn
 * @arg {string} val
 */
export function formatValue(fn: (val: string) => string, val: string): string;
/** @arg {string[]} classNames */
export function dedupe(classNames: string[]): string[];
/**
 * @arg {string} at
 * @arg {string} prop
 * @arg {string} val
 */
export function createClassName(at: string, prop: string, val: string): string;
/** @arg {string} val */
export function asClassName(val: string): string;
/** @arg {string} val */
export function asSelector(val: string): string;
/**
 * @arg {StyleSheet} sheet
 * @arg {Brk} brk
 * @arg {TemplateStringsArray | string} strings
 * @arg {(string|number)[]} keys
 */
export function parse(sheet: StyleSheet, brk: Brk, strings: TemplateStringsArray | string, ...keys: (string | number)[]): string;
/** @arg {BrkSpecs} userSpecs */
export function createBrkTabSpec(userSpecs: {
    id: string;
    q: string;
}[]): {
    tab: Record<string, string>;
    specs: {
        id: string;
        q: string;
    }[];
};
/**
 * @arg {StyleSheet} styleSheet
 * @arg {BrkSpecs} specs
 */
export function render(styleSheet: StyleSheet, specs: {
    id: string;
    q: string;
}[]): string;
/**
 * @arg {BrkSpecs} userSpecs
 */
export function klaz(userSpecs: {
    id: string;
    q: string;
}[]): {
    kz: (strings: TemplateStringsArray | string, ...keys: (string | number)[]) => string;
    ks: (...strings: string[]) => string;
    render: () => string;
};
export type Kv = {
    [x: string]: object;
};
export type StyleSheet = {
    [x: string]: Record<string, Record<string, Record<string, string>>>;
};
export type Brk = {
    [x: string]: string;
};
export type BrkSpecs = {
    id: string;
    q: string;
}[];
export type BrkTabSpec = {
    tab: Brk;
    specs: {
        id: string;
        q: string;
    }[];
};
