import { Test, TestingModule } from '@nestjs/testing';
import { BeveragesService } from './beverages.service';

describe('BeveragesService', () => {
  let service: BeveragesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeveragesService],
    }).compile();

    service = module.get<BeveragesService>(BeveragesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
