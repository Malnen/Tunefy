import { TestBed } from '@angular/core/testing';

import { LyricsProviderService } from './lyrics-provider.service';

describe('LyricsProviderService', () => {
  let service: LyricsProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LyricsProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
