import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCamComponent } from './live-cam.component';

describe('LiveCamComponent', () => {
  let component: LiveCamComponent;
  let fixture: ComponentFixture<LiveCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveCamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
