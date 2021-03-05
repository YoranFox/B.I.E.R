import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBeverageComponent } from './request-beverage.component';

describe('RequestBeverageComponent', () => {
  let component: RequestBeverageComponent;
  let fixture: ComponentFixture<RequestBeverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestBeverageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBeverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
