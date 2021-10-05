import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesWrapperComponent } from './devices-wrapper.component';

describe('DevicesWrapperComponent', () => {
  let component: DevicesWrapperComponent;
  let fixture: ComponentFixture<DevicesWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicesWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
