import { ChangeDetectionStrategy, Component, Input, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-datetime-picker',
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
    MatTimepickerModule
  ],
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true
    },
    provideNativeDateAdapter()
  ]
})
export class DatetimePickerComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = 'Data e Hora';
  @Input() placeholder: string = 'DD/MM/AAAA HH:MM';
  @Input() required: boolean = false;
  
  dateTimeForm!: FormGroup;
  disabled: boolean = false;
  
  private onChange: any = () => {};
  private onTouched: any = () => {};
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.dateTimeForm = this.fb.group({
      date: [null, this.required ? Validators.required : null],
      time: [null, this.required ? Validators.required : null]
    });
    
    // Notify parent form whenever values change
    this.dateTimeForm.valueChanges.subscribe(value => {
      if (value.date && value.time) {
        const combinedDate = this.combineDateTime(value.date, value.time);
        this.onChange(combinedDate);
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
  
  // Combine date and time into a single Date object
  private combineDateTime(date: Date, time: Date): Date {
    if (!date || !time) return date;
    
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    
    const result = new Date(date);
    
    result.setHours(hours, minutes, seconds);
    
    return result;
  }
  
  // ControlValueAccessor methods
  writeValue(value: Date): void {
    if (value) {
      this.dateTimeForm.setValue({
        date: value,
        time: value
      }, { emitEvent: false });
    } else {
      this.dateTimeForm.reset(null, { emitEvent: false });
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
    if (isDisabled) {
      this.dateTimeForm.disable();
    } else {
      this.dateTimeForm.enable();
    }
  }
  
  onBlur(): void {
    this.onTouched();
  }
}
