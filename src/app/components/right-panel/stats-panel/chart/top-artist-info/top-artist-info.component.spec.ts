import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopArtistInfoComponent } from './top-artist-info.component';

describe('TopArtistInfoComponent', () => {
  let component: TopArtistInfoComponent;
  let fixture: ComponentFixture<TopArtistInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopArtistInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopArtistInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
