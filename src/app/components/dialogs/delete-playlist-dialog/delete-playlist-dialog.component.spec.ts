import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlaylistDialogComponent } from './delete-playlist-dialog.component';

describe('DeletePlaylistDialogComponent', () => {
  let component: DeletePlaylistDialogComponent;
  let fixture: ComponentFixture<DeletePlaylistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePlaylistDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePlaylistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
