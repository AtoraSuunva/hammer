/**
 * Converts a JavaScript object to a Buffer using JSON.stringify and UTF-8 encoding.
 *
 * @param obj - The JavaScript object to be converted.
 * @returns A Buffer containing the stringified and UTF-8 encoded representation of the input object.
 *
 * @example
 * ```typescript
 * const obj = { name: 'John', age: 30 };
 * const buf = bufferfy(obj);
 * console.log(buf.toString('utf8')); // Outputs: "{ "name": "John", "age": 30 }"
 * ```
 */
export function bufferfy(obj: unknown): Buffer {
  return Buffer.from(JSON.stringify(obj, null, 2), 'utf8')
}
