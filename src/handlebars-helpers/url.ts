export function url(...urlList: string[]) {
  return process.env.BASE_URL + urlList.slice(0, urlList.length - 1).join('/');
}
