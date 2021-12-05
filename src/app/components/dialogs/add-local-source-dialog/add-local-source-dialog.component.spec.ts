import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocalSourceDialogComponent } from './add-local-source-dialog.component';

describe('AddLocalSourceComponent', () => {
  let component: AddLocalSourceDialogComponent;
  let fixture: ComponentFixture<AddLocalSourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLocalSourceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocalSourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
