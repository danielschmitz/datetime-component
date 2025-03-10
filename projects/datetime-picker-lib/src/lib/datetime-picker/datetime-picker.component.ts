import {ChangeDetectionStrategy, Component, Input, OnInit, forwardRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {LOCALE_ID} from '@angular/core';
import {CustomDateAdapter} from '../custom-date-adapter';

@Component({
  selector: 'ds-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    MatTimepickerModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'en-US',
    },
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    {provide: DateAdapter, useClass: CustomDateAdapter},
  ],
})
export class DatetimePickerComponent implements ControlValueAccessor, OnInit {
  @Input() labelDate: string = 'Date';
  @Input() labelTime: string = 'Time';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;

  dateTimeForm!: FormGroup;
  disabled: boolean = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dateTimeForm = this.fb.group({
      date: [null, this.required ? Validators.required : null],
      time: [null, this.required ? Validators.required : null],
    });

    // Apply readonly state if set
    if (this.readonly) {
      this.dateTimeForm.get('date')?.disable();
      this.dateTimeForm.get('time')?.disable();
    }

    // Notify parent form whenever values change
    this.dateTimeForm.valueChanges.subscribe((value) => {
      if (value.date && value.time) {
        const isoDateString = this.combineDateTime(value.date, value.time);
        this.onChange(isoDateString);
      } else {
        this.onChange(null);
      }
    });
  }

  // Convert Date object to time string for input[type="time"]
  getTimeString(date: Date): string {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Handle time string conversion back to Date object
  handleTimeChange(timeString: string): void {
    if (!timeString) return;

    const [hours, minutes] = timeString.split(':').map(Number);

    // Get current time value or create new date
    const timeValue = this.dateTimeForm.get('time')?.value || new Date();
    const newTimeValue = new Date(timeValue);

    // Set new hours and minutes
    newTimeValue.setHours(hours, minutes, 0);

    // Update the form control
    this.dateTimeForm.get('time')?.setValue(newTimeValue);
  }

  // Combine date and time into an ISO 8601 formatted string
  private combineDateTime(date: Date, time: Date): string {
    if (!date || !time) return '';

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const result = new Date(date);

    result.setHours(hours, minutes, seconds);

    // Convert to ISO 8601 format
    return result.toISOString();
  }

  // ControlValueAccessor methods
  writeValue(value: string | Date | null): void {
    if (value) {
      // Handle both string ISO format and Date object
      const dateValue = typeof value === 'string' ? new Date(value) : value;

      if (!isNaN(dateValue.getTime())) {
        // Check if valid date
        this.dateTimeForm.setValue(
          {
            date: dateValue,
            time: dateValue,
          },
          {emitEvent: false},
        );
      }
    } else {
      this.dateTimeForm.reset(null, {emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;

    // Don't enable if readonly is true
    if (isDisabled) {
      this.dateTimeForm.disable();
    } else if (!this.readonly) {
      this.dateTimeForm.enable();
    }
  }

  onBlur(): void {
    this.onTouched();
  }
}
