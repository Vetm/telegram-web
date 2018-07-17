import { TestBed, inject } from '@angular/core/testing';

import { ChatListService } from './chat-list.service';

describe('ChatListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatListService]
    });
  });

  it('should be created', inject([ChatListService], (service: ChatListService) => {
    expect(service).toBeTruthy();
  }));
});
