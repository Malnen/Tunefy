import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollMaskComponent } from './scroll-mask.component';

describe('LyricsWrapperComponent', () => {
  let component: ScrollMaskComponent;
  let fixture: ComponentFixture<ScrollMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollMaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
