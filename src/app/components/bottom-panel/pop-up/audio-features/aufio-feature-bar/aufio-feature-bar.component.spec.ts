import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AufioFeatureBarComponent } from './aufio-feature-bar.component';

describe('AufioFeatureBarComponent', () => {
  let component: AufioFeatureBarComponent;
  let fixture: ComponentFixture<AufioFeatureBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AufioFeatureBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AufioFeatureBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
