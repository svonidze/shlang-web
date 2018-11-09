import { isNullOrUndefined } from "util";

/**
 * Returns true if specified object has no properties,
 * false otherwise.
 * https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
 * @param {object} object
 * @returns {boolean}
 */
export function isObjectEmpty(obj: any): boolean {
    return isNullOrUndefined(obj)
        || (Object.keys(obj).length === 0 && obj.constructor === Object);
}