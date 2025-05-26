import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEdittorComponent } from './group-edittor.component';

describe('GroupEdittorComponent', () => {
  let component: GroupEdittorComponent;
  let fixture: ComponentFixture<GroupEdittorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupEdittorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEdittorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
