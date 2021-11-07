import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistTopTracksTableComponent } from './artist-top-tracks-table.component';

describe('ArtistTopTracksTableComponent', () => {
  let component: ArtistTopTracksTableComponent;
  let fixture: ComponentFixture<ArtistTopTracksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistTopTracksTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistTopTracksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
