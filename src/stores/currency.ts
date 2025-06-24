import { Currency, type CurrencyData } from '@/types/currency'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const BASE_RATE_VALUE = 1
const RATE_ENDPOINT = 'https://status.neuralgeneration.com/api/currency'
const supportedCurrencies: Currency[] = [Currency.USD, Currency.EUR, Currency.RUB]

export const useCurrencyStore = defineStore('currency', () => {
  const baseCurrency = ref<Currency>(Currency.RUB)
  const currencyData = ref<CurrencyData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const rates = computed(() => {
    if (!currencyData.value) return []
    
    return Object.entries(currencyData.value.rates).map(([currency, rate]) => ({
      currency,
      rate: Number(rate)
    }))
  })

  const getRate = computed(() => {
    return (fromCurrency: Currency, toCurrency: Currency): number => {
      if (!currencyData.value) return BASE_RATE_VALUE
      
      const rates = currencyData.value.rates
      
      if (toCurrency === currencyData.value.base) {
        return rates[fromCurrency] || BASE_RATE_VALUE
      }
      
      if (fromCurrency === currencyData.value.base) {
        return 1 / (rates[toCurrency] || BASE_RATE_VALUE)
      }
      
      const fromRate = rates[fromCurrency] || BASE_RATE_VALUE
      const toRate = rates[toCurrency] || BASE_RATE_VALUE
      return fromRate / toRate
    }
  })

  const fetchCurrencyRates = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await fetch(RATE_ENDPOINT).then(res => res.json())

      currencyData.value = {
        base: data.base || 'USD',
        rates: data.rates || {},
        timestamp: Date.now()
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Неизвестная ошибка'
      }
      console.error('Ошибка при получении курсов валют:', err)
    } finally {
      isLoading.value = false
    }
  }

  const setBaseCurrency = (currency: Currency) => {
    baseCurrency.value = currency
  }

  const convertCurrency = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount
    
    const rate = getRate.value(fromCurrency, toCurrency)
    return Number((amount * rate).toFixed(2))
  }

  return {
    baseCurrency,
    currencyData,
    isLoading,
    error,
    
    rates,
    supportedCurrencies,
    getRate,
    
    fetchCurrencyRates,
    setBaseCurrency,
    convertCurrency
  }
}) 