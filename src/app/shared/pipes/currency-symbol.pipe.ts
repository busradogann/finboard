import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol',
  standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
  private readonly map: Record<string, string> = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
  };

  transform(code: string | null | undefined): string {
    const c = (code || '').toUpperCase().trim();
    if (!c) return '';
    return this.map[c] ?? c;
  }
}
