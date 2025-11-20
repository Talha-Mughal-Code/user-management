import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { GatewayModule } from '../src/gateway.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    // Note: For full E2E tests, ensure the Authentication microservice is running
    // on the configured port (default: 3001) before running these tests
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayModule],
    }).compile();

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
        password: 'test123456',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('tokens');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('name', userData.name);
          expect(res.body.user).toHaveProperty('email', userData.email);
          expect(res.body.tokens).toHaveProperty('accessToken');
          expect(res.body.tokens).toHaveProperty('refreshToken');

          accessToken = res.body.tokens.accessToken;
          refreshToken = res.body.tokens.refreshToken;
          userId = res.body.user.id;
        });
    });

    it('should fail with 409 if email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: `duplicate-${Date.now()}@example.com`,
        password: 'test123456',
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
          expect(res.body.message).toContain('already exists');
        });
    });

    it('should fail with 400 if validation fails', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: '123', // Too short
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    const testEmail = `login-test-${Date.now()}@example.com`;
    const testPassword = 'test123456';

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
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('tokens');
          expect(res.body.tokens).toHaveProperty('accessToken');
          expect(res.body.tokens).toHaveProperty('refreshToken');
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
      const response = await request(app.getHttpServer()).post('/auth/register').send({
        name: 'Refresh Test User',
        email: `refresh-test-${Date.now()}@example.com`,
        password: 'test123456',
      });

      testRefreshToken = response.body.tokens.refreshToken;
    });

    it('should refresh tokens successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: testRefreshToken,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
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
      const response = await request(app.getHttpServer()).post('/auth/register').send({
        name: 'Protected Route Test',
        email: `protected-${Date.now()}@example.com`,
        password: 'test123456',
      });

      const token = response.body.tokens.accessToken;

      return request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('email');
        });
    });
  });

  describe('GET /auth/users/:id (Protected)', () => {
    let testUserId: string;
    let testToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/auth/register').send({
        name: 'Single User Test',
        email: `single-user-${Date.now()}@example.com`,
        password: 'test123456',
      });

      testUserId = response.body.user.id;
      testToken = response.body.tokens.accessToken;
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
          expect(res.body).toHaveProperty('id', testUserId);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('email');
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
      const password = 'test123456';

      // Step 1: Register
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Flow Test User',
          email: uniqueEmail,
          password,
        })
        .expect(201);

      const initialAccessToken = registerResponse.body.tokens.accessToken;
      const initialRefreshToken = registerResponse.body.tokens.refreshToken;

      // Step 2: Login
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: uniqueEmail,
          password,
        })
        .expect(200);

      expect(loginResponse.body.tokens.accessToken).toBeDefined();

      // Step 3: Get users with access token
      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${initialAccessToken}`)
        .expect(200);

      // Step 4: Refresh token
      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: initialRefreshToken,
        })
        .expect(200);

      const newAccessToken = refreshResponse.body.accessToken;

      // Step 5: Get users with new access token
      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);
    });
  });
});

