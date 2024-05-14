const request = require('supertest');
const app = require('../../src/app');

describe('app error handler check', () => {
  test('should return 404 error', async () => {
    const result = await request(app).get('/wrongRequest');
    expect(result.status).toBe(404);
  });
});
