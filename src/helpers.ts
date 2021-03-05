import { promises as fs } from 'fs';
import * as path from 'path';

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

export async function renderFile(content: string, dir: string, fileName: string) {
  let outPath = path.join(__dirname, `../${dir}`);
  fs.mkdir(outPath, { recursive: true }).then((val) => {
    let str = getFileName(fileName);
    return fs.writeFile(outPath + `/${str}`, content, { flag: 'w' });
  });
}

export function toPosBehind(str: string): string {
  return `(?<=${str})`;
}

export function toPosAhead(str: string): string {
  return `(?=${str})`;
}

export function getFileName(str: string): string {
  let filter = (new RegExp("^.*/\/?(.*)\\..*$")).exec(str);
  return filter ? filter[1] : str;
}

export const lb = "[\\r\\n]?";
export const coreGroup = "(.|[\\r\\n])+?";