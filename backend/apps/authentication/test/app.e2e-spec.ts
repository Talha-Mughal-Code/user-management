import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './../src/authentication.module';

describe('AuthenticationService (e2e)', () => {
  let app: INestMicroservice;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  // Note: Microservice tests typically use message pattern testing
  // For full integration tests, use the Gateway E2E tests
});
