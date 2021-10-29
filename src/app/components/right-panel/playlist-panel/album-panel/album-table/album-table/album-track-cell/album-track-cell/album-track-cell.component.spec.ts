import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumTrackCellComponent } from './album-track-cell.component';

describe('AlbumTrackCellComponent', () => {
  let component: AlbumTrackCellComponent;
  let fixture: ComponentFixture<AlbumTrackCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumTrackCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumTrackCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
