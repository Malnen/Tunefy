import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyPlayedTileComponent } from './recently-played-tile.component';

describe('RecentlyPlayedTileComponent', () => {
  let component: RecentlyPlayedTileComponent;
  let fixture: ComponentFixture<RecentlyPlayedTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyPlayedTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyPlayedTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
