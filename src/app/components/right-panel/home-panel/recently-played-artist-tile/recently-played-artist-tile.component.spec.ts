import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyPlayedArtistTileComponent } from './recently-played-artist-tile.component';

describe('RecentlyPlayedArtistComponent', () => {
  let component: RecentlyPlayedArtistTileComponent;
  let fixture: ComponentFixture<RecentlyPlayedArtistTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyPlayedArtistTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyPlayedArtistTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
