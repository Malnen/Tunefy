import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalChartInfoComponent } from './horizontal-chart-info.component';

describe('HorizontalChartInfoComponent', () => {
  let component: HorizontalChartInfoComponent;
  let fixture: ComponentFixture<HorizontalChartInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizontalChartInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalChartInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
