import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackTileComponent } from './track-tile.component';

describe('RecentlyPlayedTileComponent', () => {
  let component: TrackTileComponent;
  let fixture: ComponentFixture<TrackTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
