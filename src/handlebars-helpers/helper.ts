export function extractOptionsArgument(args: any[]) {
  const values = args.filter((v) => !v.data && !v.lookupProperty);
  const options = args.slice(values.length, args.length)[0] ?? null;

  return [values, options];
}
