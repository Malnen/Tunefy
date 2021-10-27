import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackCellComponent } from './track-cell.component';

describe('TrackCellComponent', () => {
  let component: TrackCellComponent;
  let fixture: ComponentFixture<TrackCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
