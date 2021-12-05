import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonPremiumScreenComponent } from './non-premium-screen.component';

describe('NonPremiumScreenComponent', () => {
  let component: NonPremiumScreenComponent;
  let fixture: ComponentFixture<NonPremiumScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonPremiumScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonPremiumScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
