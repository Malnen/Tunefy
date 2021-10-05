import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LyricsWrapperComponent } from './lyrics-wrapper.component';

describe('LyricsWrapperComponent', () => {
  let component: LyricsWrapperComponent;
  let fixture: ComponentFixture<LyricsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LyricsWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LyricsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
