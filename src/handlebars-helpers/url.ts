import * as path from 'path';

const dummyFunction = (p) => p;
const removeHttp = (p) => p.replace(/https?:/, '');

export function url(...urlList: string[]) {
  let fn = dummyFunction;
  let baseUrl = process.env.BASE_URL;
  if (!baseUrl.startsWith('http')) {
    fn = removeHttp;
    baseUrl = 'http:' + baseUrl;
  }

  return fn(
    new URL(
      path.join(
        ...urlList.slice(0, urlList.length - 1).map((v) => v.toString()),
      ),
      baseUrl,
    ).toString(),
  );
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
