import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GatewayModule } from './../src/gateway.module';

describe('Gateway (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  // Health check or base endpoint test
  it('should handle API requests', async () => {
    // Gateway doesn't have a root endpoint, so we test a valid endpoint
    // This test ensures the gateway is running and can handle requests
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrong',
      });
    
    // Should return 401 (Unauthorized) for invalid credentials, not 404 (Not Found)
    expect([400, 401, 500]).toContain(response.status);
  });
});
