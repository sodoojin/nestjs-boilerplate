import * as path from 'path';
import { extractOptionsArgument } from './helper';
import * as process from 'process';

const dummyFunction = (p) => p;
const removeHttp = (p) => p.replace(/https?:/, '');

function parseUrl(args: any[], baseUrl) {
  const [urlList] = extractOptionsArgument(args);
  let fn = dummyFunction;
  if (!baseUrl.startsWith('http')) {
    fn = removeHttp;
    baseUrl = 'http:' + baseUrl;
  }

  const baseUrlParts = baseUrl.split('/');
  baseUrl = baseUrlParts.splice(0, 3).join('/');

  return fn(
    new URL(
      path.join(...baseUrlParts, ...urlList.map((v) => v.toString())),
      baseUrl,
    ).toString(),
  );
}

export function url(...args: any[]) {
  return parseUrl(args, process.env.BASE_URL);
}

export function memberUrl(...args: any[]) {
  return parseUrl(args, process.env.MEMBER_URL);
}

export function hoUrl(...args: any[]) {
  return parseUrl(args, process.env.HO_URL);
}

export function image(p: string) {
  let fn = dummyFunction;
  let baseUrl = process.env.ASSETS_URL;
  if (!baseUrl.startsWith('http')) {
    fn = removeHttp;
    baseUrl = 'http:' + baseUrl;
  }

  return fn(new URL(p, baseUrl).toString());
}
