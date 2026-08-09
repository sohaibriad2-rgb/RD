import { Currency, CurrencyConfig } from '../types';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78 },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67 },
};

export function formatPrice(priceInUSD: number, currencyCode: Currency = 'USD'): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = Math.round(priceInUSD * currency.rate);
  
  if (currencyCode === 'AED') {
    return `${currency.symbol}${converted.toLocaleString('en-US')}`;
  }
  return `${currency.symbol}${converted.toLocaleString('en-US')}`;
}
