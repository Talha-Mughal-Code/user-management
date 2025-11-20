import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ExecutionContext, CanActivate } from '@nestjs/common';
import request from 'supertest';
import { GatewayModule } from '../src/gateway.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Observable } from 'rxjs';
class MockThrottlerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayModule],
    })
      .overrideGuard(ThrottlerGuard)
      .useClass(MockThrottlerGuard)
      .overrideProvider(APP_GUARD)
      .useClass(MockThrottlerGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user and return tokens', () => {
      const userData = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'Test123!@#',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201)
        .expect((res) => {
          const body = res.body.data || res.body;
          expect(body).toHaveProperty('user');
          expect(body).toHaveProperty('tokens');
          expect(body.user).toHaveProperty('id');
          expect(body.user).toHaveProperty('name', userData.name);
          expect(body.user).toHaveProperty('email', userData.email);
          expect(body.tokens).toHaveProperty('accessToken');
          expect(body.tokens).toHaveProperty('refreshToken');

          accessToken = body.tokens.accessToken;
          refreshToken = body.tokens.refreshToken;
          userId = body.user.id;
        });
    });

    it('should fail with 409 if email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: `duplicate-${Date.now()}@example.com`,
        password: 'Test123!@#',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(409)
        .expect((res) => {
          const message = res.body.message || res.body.error?.message || res.body.error;
          expect(message).toContain('already exists');
        });
    });

    it('should fail with 400 if validation fails', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: '123',
        })
        .expect(400);
    });

    it('should fail with 400 if password does not meet complexity requirements', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: `test-${Date.now()}@example.com`,
          password: 'simplepassword',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    const testEmail = `login-test-${Date.now()}@example.com`;
    const testPassword = 'Test123!@#';

    beforeAll(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        name: 'Login Test User',
        email: testEmail,
        password: testPassword,
      });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200)
        .expect((res) => {
          const body = res.body.data || res.body;
          expect(body).toHaveProperty('user');
          expect(body).toHaveProperty('tokens');
          expect(body.tokens).toHaveProperty('accessToken');
          expect(body.tokens).toHaveProperty('refreshToken');
        });
    });

    it('should fail with 401 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testPassword,
        })
        .expect(401);
    });

    it('should fail with 401 for invalid password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with 400 if validation fails', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: '',
        })
        .expect(400);
    });
  });

  describe('POST /auth/refresh', () => {
    let testRefreshToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Refresh Test User',
          email: `refresh-test-${Date.now()}@example.com`,
          password: 'Test123!@#',
        })
        .expect(201);

      const body = response.body.data || response.body;
      expect(body).toBeDefined();
      expect(body.tokens).toBeDefined();
      testRefreshToken = body.tokens.refreshToken;
    });

    it('should refresh tokens successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: testRefreshToken,
        })
        .expect(200)
        .expect((res) => {
          const body = res.body.data || res.body;
          expect(body).toHaveProperty('accessToken');
          expect(body).toHaveProperty('refreshToken');
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
        });
    });

    it('should fail with 401 for invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        })
        .expect(401);
    });

    it('should fail with 400 if refresh token is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({})
        .expect(400);
    });
  });

  describe('GET /auth/users (Protected)', () => {
    it('should return 401 without authorization token', () => {
      return request(app.getHttpServer()).get('/auth/users').expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return users with valid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Protected Route Test',
          email: `protected-${Date.now()}@example.com`,
          password: 'Test123!@#',
        })
        .expect(201);

      const body = response.body.data || response.body;
      expect(body).toBeDefined();
      expect(body.tokens).toBeDefined();
      const token = body.tokens.accessToken;

      return request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          const responseBody = res.body.data || res.body;
          expect(Array.isArray(responseBody)).toBe(true);
          expect(responseBody.length).toBeGreaterThan(0);
          expect(responseBody[0]).toHaveProperty('id');
          expect(responseBody[0]).toHaveProperty('name');
          expect(responseBody[0]).toHaveProperty('email');
        });
    });
  });

  describe('GET /auth/users/:id (Protected)', () => {
    let testUserId: string;
    let testToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Single User Test',
          email: `single-user-${Date.now()}@example.com`,
          password: 'Test123!@#',
        })
        .expect(201);

      const body = response.body.data || response.body;
      expect(body).toBeDefined();
      expect(body.user).toBeDefined();
      expect(body.tokens).toBeDefined();
      testUserId = body.user.id;
      testToken = body.tokens.accessToken;
    });

    it('should return 401 without authorization token', () => {
      return request(app.getHttpServer())
        .get(`/auth/users/${testUserId}`)
        .expect(401);
    });

    it('should return user by id with valid token', () => {
      return request(app.getHttpServer())
        .get(`/auth/users/${testUserId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200)
        .expect((res) => {
          const body = res.body.data || res.body;
          expect(body).toHaveProperty('id', testUserId);
          expect(body).toHaveProperty('name');
          expect(body).toHaveProperty('email');
        });
    });

    it('should return 404 for non-existent user', () => {
      const fakeId = '507f1f77bcf86cd799439011';
      return request(app.getHttpServer())
        .get(`/auth/users/${fakeId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(404);
    });
  });

  describe('Complete Auth Flow', () => {
    it('should complete full flow: register → login → get users → refresh → get users', async () => {
      const uniqueEmail = `flow-test-${Date.now()}@example.com`;
      const password = 'Test123!@#';

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Flow Test User',
          email: uniqueEmail,
          password,
        })
        .expect(201);

      const registerBody = registerResponse.body.data || registerResponse.body;
      const initialAccessToken = registerBody.tokens.accessToken;
      const initialRefreshToken = registerBody.tokens.refreshToken;

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: uniqueEmail,
          password,
        })
        .expect(200);

      const loginBody = loginResponse.body.data || loginResponse.body;
      expect(loginBody.tokens.accessToken).toBeDefined();

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${initialAccessToken}`)
        .expect(200);

      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: initialRefreshToken,
        })
        .expect(200);

      const refreshBody = refreshResponse.body.data || refreshResponse.body;
      const newAccessToken = refreshBody.accessToken;

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);
    });
  });
});
