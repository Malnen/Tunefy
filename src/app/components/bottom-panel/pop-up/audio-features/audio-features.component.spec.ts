import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioFeaturesComponent } from './audio-features.component';

describe('AudioFeaturesComponent', () => {
  let component: AudioFeaturesComponent;
  let fixture: ComponentFixture<AudioFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
