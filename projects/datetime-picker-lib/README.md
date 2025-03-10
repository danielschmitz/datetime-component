# @danielschmitz/datetime-component

A reusable Angular datetime picker component that combines date and time selection in a single form control.

[Demo](https://danielschmitz.github.io/datetime-component/)

## Features

- Combined date and time picker in a single component
- Form control integration (works with Reactive Forms)
- Supports readonly mode
- Customizable labels
- Supports Required validation
- Requires Angular Material v19 or higher

## Important note

This component only works from Angular Material v19 onwards, since the `MatTimepickerModule` was introduced in this version.


## Installation

First, install the package:

```bash
npm install @danielschmitz/datetime-component
```

## Setup

### Import the Module

In your app module or feature module:

```typescript
import { DatetimePickerLibModule } from '@danielschmitz/datetime-component';

@NgModule({
  imports: [
    // other imports...
    DatetimePickerLibModule
  ],
  // ...
})
export class AppModule { }
```

For standalone components:

```typescript
import { DatetimePickerComponent } from '@danielschmitz/datetime-component';

@Component({
  // ...
  imports: [
    // other imports...
    DatetimePickerComponent
  ],
})
export class YourComponent { }
```

## Basic Usage

### In a Reactive Form

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  template: `
    <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Event Name</label>
        <input type="text" formControlName="name">
      </div>
      
      <div>
        <ds-datetime-picker
          label="Event Date/Time"
          formControlName="eventDateTime"
          [required]="true">
        </ds-datetime-picker>
      </div>
      
      <button type="submit" [disabled]="eventForm.invalid">Save Event</button>
    </form>
  `
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit() {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      eventDateTime: [null, Validators.required]
    });
  }
  
  onSubmit() {
    if (this.eventForm.valid) {
      console.log('Form data:', this.eventForm.value);
      // eventDateTime will be in ISO 8601 format (e.g., "2025-03-10T15:30:00.000Z")
    }
  }
}
```

## Advanced Usage

### Read-only Mode

```html
<ds-datetime-picker
  label="Created At"
  formControlName="createdAt"
  [readonly]="true">
</ds-datetime-picker>
```

### Custom Labels

```html
<ds-datetime-picker
  label="Appointment"
  labelDate="Appointment Date"
  labelTime="Appointment Time"
  formControlName="appointmentDateTime"
  [required]="true">
</ds-datetime-picker>
```

## Working with the Date Value

The component stores dates in ISO 8601 format. Here's how to work with the date values:

```typescript
// Setting a date
this.form.get('eventDateTime').setValue(new Date().toISOString());

// Getting and formatting a date for display
const isoDate = this.form.get('eventDateTime').value;
const date = new Date(isoDate);
const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
```

## Styling

The component uses Angular Material styling by default. You can override styles using CSS variables or by targeting the component's classes:

```scss
ds-datetime-picker {
  .datetime-picker-container {
    // Your custom styles
  }
  
  .datetime-label {
    font-weight: bold;
  }
  
  .datetime-fields {
    // Custom layout for the fields
  }
}
```

MIT