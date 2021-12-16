import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverPanelComponent } from './discover-panel.component';

describe('DiscoverPanelComponent', () => {
  let component: DiscoverPanelComponent;
  let fixture: ComponentFixture<DiscoverPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscoverPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
