import { HelperOptions } from 'handlebars';

const blocks = {};

export function extend(name: string, options: HelperOptions) {
  if (!blocks[name]) {
    blocks[name] = [];
  }

  blocks[name].push(options.fn(this));
}

export function block(name: string) {
  const v = (blocks[name] ?? []).join('\n');

  blocks[name] = [];

  return v;
}
