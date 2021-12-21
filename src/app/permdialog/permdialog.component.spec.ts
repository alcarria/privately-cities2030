import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermdialogComponent } from './permdialog.component';

describe('PermdialogComponent', () => {
  let component: PermdialogComponent;
  let fixture: ComponentFixture<PermdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
