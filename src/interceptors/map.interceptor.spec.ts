import { when } from 'jest-when';
import { instanceToPlain } from 'class-transformer';
import { MapInterceptor } from './map.interceptor';
import { of } from 'rxjs';

jest.mock('class-transformer', () => ({
  instanceToPlain: jest.fn(),
}));
describe('MapInterceptor', () => {
  const controllerResult = { data: [{ key: 1 }, { key: 2 }, { key: 3 }] };
  const next = {
    handle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('intercept', async () => {
    when(next.handle).mockReturnValue(of(controllerResult));
    when<any, any>(instanceToPlain)
      .calledWith(expect.anything(), {
        strategy: 'excludeAll',
        excludeExtraneousValues: true,
        enableCircularCheck: true,
        groups: undefined,
      })
      .mockImplementation((v) => ({
        data: v.data.map((v2) => ({ key: v2.key * 2 })),
      }));

    const interceptor = new MapInterceptor();
    let result;
    (await interceptor.intercept(null, next)).subscribe({
      next: (v) => (result = v),
    });

    expect(result).toEqual({ data: [{ key: 2 }, { key: 4 }, { key: 6 }] });
  });
});
