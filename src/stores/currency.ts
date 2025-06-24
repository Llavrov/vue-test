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
      
      if (fromCurrency === toCurrency) return BASE_RATE_VALUE
      
      const directPair = `${fromCurrency.toLowerCase()}-${toCurrency.toLowerCase()}`
      if (rates[directPair]) {
        return Number(rates[directPair])
      }
      
      const reversePair = `${toCurrency.toLowerCase()}-${fromCurrency.toLowerCase()}`
      if (rates[reversePair]) {
        return 1 / Number(rates[reversePair])
      }
      
      return BASE_RATE_VALUE
    }
  })

  const fetchCurrencyRates = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(RATE_ENDPOINT)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      currencyData.value = {
        base: Currency.USD,
        rates: data,
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