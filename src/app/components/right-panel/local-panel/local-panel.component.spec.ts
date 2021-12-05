import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalPanelComponent } from './local-panel.component';

describe('LocalPanelComponent', () => {
  let component: LocalPanelComponent;
  let fixture: ComponentFixture<LocalPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
