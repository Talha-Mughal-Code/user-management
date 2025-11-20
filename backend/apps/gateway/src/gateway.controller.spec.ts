import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';

describe('GatewayController', () => {
  let gatewayController: GatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
    }).compile();

    gatewayController = app.get<GatewayController>(GatewayController);
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = gatewayController.healthCheck();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('service', 'API Gateway');
    });
  });
});
