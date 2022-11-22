import { HelperOptions } from 'handlebars';

export function old(
  field: string,
  defaultValue: string,
  options: HelperOptions,
) {
  return options.data.root.userOldInputValues[field] ?? defaultValue;
}

export function error(field: string, options: HelperOptions) {
  return (options.data.root.validationErrors[field] ?? [])[0] ?? '';
}

export function errors(field: string, options: HelperOptions) {
  return (options.data.root.validationErrors[field] ?? [])
    .map((errorMessage) => options.fn({ errorMessage }))
    .join('');
}

export function hasError(field: string, options: HelperOptions) {
  if ((options.data.root.validationErrors[field] ?? []).length > 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
