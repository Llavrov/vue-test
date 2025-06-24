export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB',
}

export interface CurrencyRate {
  currency: Currency
  rate: number
}

export interface CurrencyData {
  base: Currency
  rates: Record<Currency, number>
  timestamp: number
}