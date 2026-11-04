import { Test, TestingModule } from '@nestjs/testing';
import { VeterinariasController } from './veterinarias.controller';
import { VeterinariasService } from './veterinarias.service';

describe('VeterinariasController', () => {
  let controller: VeterinariasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeterinariasController],
      providers: [VeterinariasService],
    }).compile();

    controller = module.get<VeterinariasController>(VeterinariasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
