import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewgroupdialogComponent } from './newgroupdialog.component';

describe('NewgroupdialogComponent', () => {
  let component: NewgroupdialogComponent;
  let fixture: ComponentFixture<NewgroupdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewgroupdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewgroupdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
