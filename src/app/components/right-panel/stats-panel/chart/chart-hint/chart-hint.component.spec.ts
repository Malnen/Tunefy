import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHintComponent } from './chart-hint.component';

describe('ChartHintComponent', () => {
  let component: ChartHintComponent;
  let fixture: ComponentFixture<ChartHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartHintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
