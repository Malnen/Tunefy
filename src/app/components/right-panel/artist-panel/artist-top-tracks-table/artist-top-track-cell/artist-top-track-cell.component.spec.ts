import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistTopTrackCellComponent } from './artist-top-track-cell.component';

describe('ArtistTopTrackCellComponent', () => {
  let component: ArtistTopTrackCellComponent;
  let fixture: ComponentFixture<ArtistTopTrackCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistTopTrackCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistTopTrackCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
