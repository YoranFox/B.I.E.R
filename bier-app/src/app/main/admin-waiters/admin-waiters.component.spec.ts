import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWaitersComponent } from './admin-waiters.component';

describe('AdminWaitersComponent', () => {
  let component: AdminWaitersComponent;
  let fixture: ComponentFixture<AdminWaitersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminWaitersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWaitersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
