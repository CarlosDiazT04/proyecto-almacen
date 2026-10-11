import { Pipe, PipeTransform } from '@angular/core';

const LOCALE = 'es-PE';
const moneyFmt = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'PEN' });
const numFmt = new Intl.NumberFormat(LOCALE);
const dateFmt = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'short', timeStyle: 'short' });

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    return moneyFmt.format(Number(value || 0));
  }
}

@Pipe({ name: 'dateTime' })
export class DateTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    return value ? dateFmt.format(new Date(value)) : '—';
  }
}

@Pipe({ name: 'num' })
export class NumPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    return numFmt.format(Number(value || 0));
  }
}
