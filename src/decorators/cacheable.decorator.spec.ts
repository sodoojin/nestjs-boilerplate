import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { when } from 'jest-when';
import { Cacheable } from './cacheable.decorator';
import { faker } from '@faker-js/faker';

jest.mock('@nestjs/common', () => ({
  CACHE_MANAGER: 'CACHE_MANAGER',
  Inject: jest.fn(),
}));

describe('Cacheable', () => {
  const inject = {
    _cacheManager: {
      get: jest.fn(),
      set: jest.fn(),
    },
  };
  const realMethodCalled = jest.fn();
  const CacheManagerInjector = (target: any, key: string) => {
    target[key] = inject[key];
  };
  when(Inject)
    .calledWith(CACHE_MANAGER)
    .mockReturnValueOnce(CacheManagerInjector);

  class DummyClass {
    className = 'dummy-class';

    @Cacheable('someMethod', { ttl: 60 })
    async someMethod() {
      realMethodCalled();
      return {};
    }
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('캐시 없음', async () => {
    const dummyClass = new DummyClass();
    const cacheKey = 'someMethod';

    when(inject._cacheManager.get)
      .calledWith(cacheKey)
      .mockResolvedValueOnce(undefined);

    await dummyClass.someMethod();

    expect(inject._cacheManager.set).toHaveBeenCalledWith(
      cacheKey,
      expect.anything(),
      60,
    );
    expect(realMethodCalled).toHaveBeenCalledTimes(1);
  });

  it('캐시 있음', async () => {
    const dummyClass = new DummyClass();
    const cacheKey = 'someMethod';
    const someValue = faker.lorem.word();

    when(inject._cacheManager.get)
      .calledWith(cacheKey)
      .mockResolvedValueOnce(someValue);

    const result = await dummyClass.someMethod();

    expect(inject._cacheManager.set).not.toHaveBeenCalled();
    expect(realMethodCalled).not.toHaveBeenCalled();
    expect(result).toBe(someValue);
  });

  it('cache 서버 오류', async () => {
    const dummyClass = new DummyClass();
    const cacheKey = 'someMethod';

    when(inject._cacheManager.get)
      .calledWith(cacheKey)
      .mockImplementation(() => {
        throw new Error();
      });

    await dummyClass.someMethod();

    expect(realMethodCalled).toHaveBeenCalledTimes(1);
  });
});
