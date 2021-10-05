import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumResultComponent } from './album-result.component';

describe('AlbumResultComponent', () => {
  let component: AlbumResultComponent;
  let fixture: ComponentFixture<AlbumResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
