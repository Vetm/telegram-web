import { TestBed, inject } from '@angular/core/testing';

import { MtprotoService } from './mtproto.service';

describe('MtprotoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MtprotoService]
    });
  });

  it('should be created', inject([MtprotoService], (service: MtprotoService) => {
    expect(service).toBeTruthy();
  }));
});
