import { TestBed, inject } from '@angular/core/testing';

import { ColorGeneratorService } from './color-generator.service';

describe('ColorGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorGeneratorService]
    });
  });

  it('should be created', inject([ColorGeneratorService], (service: ColorGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
