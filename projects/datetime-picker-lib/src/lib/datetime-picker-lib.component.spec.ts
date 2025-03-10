import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimePickerLibComponent } from './datetime-picker-lib.component';

describe('DatetimePickerLibComponent', () => {
  let component: DatetimePickerLibComponent;
  let fixture: ComponentFixture<DatetimePickerLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatetimePickerLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatetimePickerLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
