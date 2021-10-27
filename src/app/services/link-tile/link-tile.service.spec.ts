import { TestBed } from '@angular/core/testing';

import { LinkTileService } from './link-tile.service';

describe('LinkTileService', () => {
  let service: LinkTileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkTileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
