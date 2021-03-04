/**
 * Helper RegExp functions
 */

export function parseObj(str: string): any {
  let result: {[key: string]: any} = {};
  let pair: RegExpExecArray | null;
  const jsonExp = new RegExp("([a-zA-Z]+)[:\\s]+(.*)[\\n]?", 'g');

  while ((pair = jsonExp.exec(str)) !== null) {
    if (pair[1] && pair[2]) {
      result[pair[1]] = pair[2];
    } else {
      continue;
    }
  }

  return result;
}

export function toPosBehind(str: string): string {
  return `(?<=${str})`;
}

export function toPosAhead(str: string): string {
  return `(?=${str})`;
}

export const lb = "[\\r\\n]?";