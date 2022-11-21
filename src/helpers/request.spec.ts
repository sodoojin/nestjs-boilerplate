import { isAjax } from './request';
import { when } from 'jest-when';

describe('request', () => {
  it('isAjax', () => {
    const header = jest.fn();

    when(header)
      .calledWith('x-requested-with')
      .mockReturnValueOnce('XMLHttpRequest');

    expect(
      isAjax({
        header,
      } as any),
    ).toBe(true);

    when(header).calledWith('x-requested-with').mockReturnValueOnce('');

    expect(
      isAjax({
        header,
      } as any),
    ).toBe(false);
  });
});
