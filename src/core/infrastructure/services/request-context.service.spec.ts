import { RequestContextService } from './request-context.service';

describe('RequestContextService', () => {
  let service: RequestContextService;

  beforeEach(() => {
    service = new RequestContextService();
  });

  describe('run', () => {
    it('should store and retrieve context within callback', () => {
      const context = { requestId: 'test-123' };

      service.run(context, () => {
        expect(service.getContext()).toEqual(context);
        expect(service.getRequestId()).toBe('test-123');
      });
    });

    it('should return undefined when accessed outside of run context', () => {
      expect(service.getContext()).toBeUndefined();
      expect(service.getRequestId()).toBeUndefined();
    });

    it('should handle nested contexts correctly', () => {
      service.run({ requestId: 'outer-123' }, () => {
        expect(service.getRequestId()).toBe('outer-123');

        service.run({ requestId: 'inner-456' }, () => {
          expect(service.getRequestId()).toBe('inner-456');
        });

        expect(service.getRequestId()).toBe('outer-123');
      });
    });
  });

  describe('concurrent contexts', () => {
    it('should isolate contexts across concurrent async operations', async () => {
      const simulateRequest = async (requestId: string): Promise<string> => {
        return new Promise((resolve) => {
          service.run({ requestId }, async () => {
            // Simulate async database query
            await new Promise((r) => setTimeout(r, Math.random() * 10));

            const retrievedId = service.getRequestId();
            resolve(retrievedId);
          });
        });
      };

      const results = await Promise.all([
        simulateRequest('req-1'),
        simulateRequest('req-2'),
        simulateRequest('req-3'),
        simulateRequest('req-4'),
        simulateRequest('req-5'),
      ]);

      expect(results).toEqual(['req-1', 'req-2', 'req-3', 'req-4', 'req-5']);
    });

    it('should maintain context through promise chains', async () => {
      const result = await new Promise<string>((resolve) => {
        service.run({ requestId: 'promise-chain-123' }, async () => {
          await Promise.resolve();
          await Promise.resolve();

          const id = service.getRequestId();
          resolve(id);
        });
      });

      expect(result).toBe('promise-chain-123');
    });

    it('should maintain context with multiple async operations', async () => {
      const asyncOperation1 = async (): Promise<string> => {
        await new Promise((r) => setTimeout(r, 5));
        return service.getRequestId();
      };

      const asyncOperation2 = async (): Promise<string> => {
        await new Promise((r) => setTimeout(r, 3));
        return service.getRequestId();
      };

      const result = await new Promise<string[]>((resolve) => {
        service.run({ requestId: 'multi-async-789' }, async () => {
          const [id1, id2] = await Promise.all([
            asyncOperation1(),
            asyncOperation2(),
          ]);
          resolve([id1, id2]);
        });
      });

      expect(result).toEqual(['multi-async-789', 'multi-async-789']);
    });
  });

  describe('getContext', () => {
    it('should return full context with all properties', () => {
      const context = {
        requestId: 'full-context-123',
        method: 'GET',
        path: '/api/users',
      };

      service.run(context, () => {
        expect(service.getContext()).toEqual(context);
      });
    });

    it('should return context with only requestId when other properties are undefined', () => {
      const context = { requestId: 'minimal-context-456' };

      service.run(context, () => {
        expect(service.getContext()).toEqual(context);
      });
    });
  });

  describe('stress test', () => {
    it('should handle high concurrency without context leakage', async () => {
      const iterations = 100;
      const requests = Array.from({ length: iterations }, (_, i) => {
        return new Promise<boolean>((resolve) => {
          const requestId = `stress-${i}`;

          service.run({ requestId }, async () => {
            // Random delay to simulate real async work
            await new Promise((r) => setTimeout(r, Math.random() * 5));

            const retrievedId = service.getRequestId();
            resolve(retrievedId === requestId);
          });
        });
      });

      const results = await Promise.all(requests);
      const allCorrect = results.every((result) => result === true);

      expect(allCorrect).toBe(true);
      expect(results).toHaveLength(iterations);
    });
  });
});
