import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueWrapperComponent } from './queue-wrapper.component';

describe('QueueWrapperComponent', () => {
  let component: QueueWrapperComponent;
  let fixture: ComponentFixture<QueueWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
