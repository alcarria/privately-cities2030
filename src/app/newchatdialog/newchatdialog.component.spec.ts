import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewchatdialogComponent } from './newchatdialog.component';

describe('NewchatdialogComponent', () => {
  let component: NewchatdialogComponent;
  let fixture: ComponentFixture<NewchatdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewchatdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewchatdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
