import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {LOCALE_ID} from '@angular/core';

import {DatetimePickerComponent} from './datetime-picker/datetime-picker.component';
import {CustomDateAdapter} from './custom-date-adapter';

@NgModule({
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
    DatetimePickerComponent
  ],
  exports: [DatetimePickerComponent],
  providers: [
    {provide: LOCALE_ID, useValue: 'en-US'},
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    {provide: DateAdapter, useClass: CustomDateAdapter},
  ],
})
export class DatetimePickerLibModule {}
