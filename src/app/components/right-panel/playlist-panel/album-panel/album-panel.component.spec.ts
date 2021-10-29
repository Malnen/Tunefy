import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumPanelComponent } from './album-panel.component';

describe('AlbumPanelComponent', () => {
  let component: AlbumPanelComponent;
  let fixture: ComponentFixture<AlbumPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
