import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      // Verifica se a string segue o padrão dd/mm/yyyy
      const brazilianDatePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const matches = value.match(brazilianDatePattern);
      
      if (matches) {
        const day = parseInt(matches[1], 10);
        const month = parseInt(matches[2], 10) - 1; // Mês em JavaScript é 0-indexed
        const year = parseInt(matches[3], 10);
        
        // Verifica se a data é válida
        if (month >= 0 && month < 12 && day > 0 && day <= 31) {
          const date = new Date(year, month, day);
          
          // Verifica se é uma data válida (ex: 31/02 não é válido)
          if (date.getFullYear() === year && 
              date.getMonth() === month && 
              date.getDate() === day) {
            return date;
          }
        }
      }
    }
    
    // Se não seguir o padrão brasileiro, utiliza o comportamento padrão
    return super.parse(value);
  }

  override format(date: Date, displayFormat: Object): string {
    // Garantir formato de exibição dd/mm/yyyy
    if (displayFormat === 'input') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    }
    
    return super.format(date, displayFormat);
  }
}
