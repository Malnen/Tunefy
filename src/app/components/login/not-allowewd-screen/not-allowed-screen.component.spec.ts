import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAllowedScreenComponent } from './not-allowed-screen.component';

describe('NotAllowewdScreenComponent', () => {
  let component: NotAllowedScreenComponent;
  let fixture: ComponentFixture<NotAllowedScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotAllowedScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAllowedScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
