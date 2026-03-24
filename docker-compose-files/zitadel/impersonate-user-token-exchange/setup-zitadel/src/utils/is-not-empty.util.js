// @ts-check

/**
 *
 * @param {any} value
 * @returns {value is string | any[] | object}
 */
export function isNotEmpty(value) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string" && value.trim() === "") {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return false;
  }
  return true;
}
