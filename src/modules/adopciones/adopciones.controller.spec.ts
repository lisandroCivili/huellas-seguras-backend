import { Test, TestingModule } from '@nestjs/testing';
import { AdopcionesController } from './adopciones.controller';
import { AdopcionesService } from './adopciones.service';

describe('AdopcionesController', () => {
  let controller: AdopcionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdopcionesController],
      providers: [AdopcionesService],
    }).compile();

    controller = module.get<AdopcionesController>(AdopcionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
