import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadDropComponent } from './dead-drop.component';

describe('DeadDropComponent', () => {
  let component: DeadDropComponent;
  let fixture: ComponentFixture<DeadDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeadDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
