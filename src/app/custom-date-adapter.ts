import {Injectable} from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      // Check if the string follows the MM/DD/YYYY pattern
      const englishDatePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const matches = value.match(englishDatePattern);

      if (matches) {
        const month = parseInt(matches[1], 10) - 1; // Month in JavaScript is 0-indexed
        const day = parseInt(matches[2], 10);
        const year = parseInt(matches[3], 10);

        // Check if the date is valid
        if (month >= 0 && month < 12 && day > 0 && day <= 31) {
          const date = new Date(year, month, day);

          // Check if it's a valid date (e.g., 02/31 is not valid)
          if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            return date;
          }
        }
      }
    }

    // If it doesn't follow the English pattern, use the default behavior
    return super.parse(value);
  }

  override format(date: Date, displayFormat: Object): string {
    // Ensure display format is MM/DD/YYYY
    if (displayFormat === 'input') {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    }

    return super.format(date, displayFormat);
  }
}
