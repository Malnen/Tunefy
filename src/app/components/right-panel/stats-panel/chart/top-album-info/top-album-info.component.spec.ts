import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAlbumInfoComponent } from './top-album-info.component';

describe('TopAlbumInfoComponent', () => {
  let component: TopAlbumInfoComponent;
  let fixture: ComponentFixture<TopAlbumInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopAlbumInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopAlbumInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
