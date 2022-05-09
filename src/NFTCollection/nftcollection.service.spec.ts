import { Test, TestingModule } from '@nestjs/testing';
import { NFTCollectionService } from './nftcollection.service';

describe('NFTCollectionService', () => {
  let service: NFTCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NFTCollectionService],
    }).compile();

    service = module.get<NFTCollectionService>(NFTCollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
