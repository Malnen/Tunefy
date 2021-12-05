import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopGenresInfoComponent } from './top-genres-info.component';

describe('TopGenresInfoComponent', () => {
  let component: TopGenresInfoComponent;
  let fixture: ComponentFixture<TopGenresInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopGenresInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopGenresInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
