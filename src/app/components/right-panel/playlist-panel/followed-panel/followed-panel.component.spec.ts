import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedPanelComponent } from './followed-panel.component';

describe('FollowedPanelComponent', () => {
  let component: FollowedPanelComponent;
  let fixture: ComponentFixture<FollowedPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowedPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
