import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioFeaturesDialogComponent } from './audio-features-dialog.component';

describe('AudioFeaturesDialogComponent', () => {
  let component: AudioFeaturesDialogComponent;
  let fixture: ComponentFixture<AudioFeaturesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioFeaturesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioFeaturesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
