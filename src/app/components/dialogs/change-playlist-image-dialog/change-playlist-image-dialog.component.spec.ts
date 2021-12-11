import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePlaylistImageDialogComponent } from './change-playlist-image-dialog.component';

describe('ChangePlaylistImageDialogComponent', () => {
  let component: ChangePlaylistImageDialogComponent;
  let fixture: ComponentFixture<ChangePlaylistImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePlaylistImageDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePlaylistImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
