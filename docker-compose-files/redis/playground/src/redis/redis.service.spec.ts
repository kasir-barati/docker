import { RedisService } from './redis.service';

const mockClient = {
  on: jest.fn(),
  quit: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  ping: jest.fn(),
};

jest.mock('ioredis', () => ({
  Redis: jest.fn().mockImplementation(() => mockClient),
}));

describe(RedisService.name, () => {
  let uut: RedisService;

  beforeEach(() => {
    jest.clearAllMocks();

    uut = new RedisService({
      redisUrl: 'redis://localhost:6379',
      redisPassword: 'password',
    });
  });

  it('should set a value', async () => {
    await uut.set('key', 'value');

    expect(mockClient.set).toHaveBeenCalledWith('key', 'value');
    expect(mockClient.setex).not.toHaveBeenCalled();
  });

  it('should set a value with TTL', async () => {
    await uut.set('key', 'value', 60);

    expect(mockClient.setex).toHaveBeenCalledWith('key', 60, 'value');
    expect(mockClient.set).not.toHaveBeenCalled();
  });

  it('should get a value', async () => {
    mockClient.get.mockResolvedValue('value');

    const result = await uut.get('key');

    expect(mockClient.get).toHaveBeenCalledWith('key');
    expect(result).toBe('value');
  });

  it('should return true  when it find the key to delete', async () => {
    mockClient.del.mockResolvedValue(1);

    const result = await uut.del('key');

    expect(mockClient.del).toHaveBeenCalledWith('key');
    expect(result).toBe(true);
  });

  it('should return true  when it find the key to delete', async () => {
    mockClient.del.mockResolvedValue(0);

    const result = await uut.del('key');

    expect(mockClient.del).toHaveBeenCalledWith('key');
    expect(result).toBe(false);
  });

  it('should close connection on module destroy', async () => {
    await uut.onModuleDestroy();

    expect(mockClient.quit).toHaveBeenCalled();
  });
});
