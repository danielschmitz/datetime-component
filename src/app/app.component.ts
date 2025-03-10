import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {DatetimePickerLibModule} from '../../projects/datetime-picker-lib/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    DatetimePickerLibModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'datetime-component';
  registrationForm!: FormGroup;
  showFormData: boolean = false;
  formDataJson: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    // Update JSON display whenever form values change
    this.registrationForm.valueChanges.subscribe((values) => {
      this.updateFormDataJson();
    });
  }

  initForm(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      registrationDate: [null, [Validators.required]],
      readonlyDate: [new Date().toISOString()],
    });
  }

  updateFormDataJson(): void {
    const formValues = this.registrationForm.value;
    console.log(formValues);

    // Create a copy of the form data with formatted date for display
    const formattedData = {
      ...formValues,
      // The registrationDate is already in ISO 8601 format, no need to format it
      registrationDateFormatted: formValues.registrationDate
        ? this.formatDateForDisplay(formValues.registrationDate)
        : null,
    };

    this.formDataJson = JSON.stringify(formattedData, null, 2);
    this.showFormData = true;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Form data:', this.registrationForm.value);

      // Format the date for display
      if (this.registrationForm.value.registrationDate) {
        const isoDate = this.registrationForm.value.registrationDate;
        console.log('ISO 8601 date:', isoDate);
        console.log('Formatted date for display:', this.formatDateForDisplay(isoDate));
      }

      // Update JSON display
      this.updateFormDataJson();

      // Here you would typically send the data to a service
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  private formatDateForDisplay(isoDateString: string): string {
    if (!isoDateString) return '';

    const date = new Date(isoDateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '';
    }

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }
}
