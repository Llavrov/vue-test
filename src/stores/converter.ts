import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useCurrencyStore } from './currency'
import { Currency } from '@/types/currency'

export interface ConversionInput {
  currency: Currency
  amount: number
}

export const useConverterStore = defineStore('converter', () => {
  const currencyStore = useCurrencyStore()
  
  const fromInput = ref<ConversionInput>({
    currency: Currency.RUB,
    amount: 0
  })
  
  const toInput = ref<ConversionInput>({
    currency: Currency.USD,
    amount: 0
  })
  
  const isConverting = ref(false)
  const conversionError = ref<string | null>(null)

  const isValidAmount = computed(() => {
    return !isNaN(fromInput.value.amount) && fromInput.value.amount >= 0
  })

  const formattedFromAmount = computed(() => {
    return fromInput.value.amount.toFixed(2)
  })

  const formattedToAmount = computed(() => {
    return toInput.value.amount.toFixed(2)
  })

  const updateFromInput = (amount: number, currency?: Currency) => {
    fromInput.value.amount = amount
    if (currency) {
      fromInput.value.currency = currency
    }
  }

  const updateToInput = (amount: number, currency?: Currency) => {
    toInput.value.amount = amount
    if (currency) {
      toInput.value.currency = currency
    }
  }

  const convertFromTo = () => {
    if (!isValidAmount.value) {
      toInput.value.amount = 0
      return
    }

    isConverting.value = true
    conversionError.value = null

    try {
      const convertedAmount = currencyStore.convertCurrency(
        fromInput.value.amount,
        fromInput.value.currency,
        toInput.value.currency
      )
      
      toInput.value.amount = convertedAmount
    } catch (err) {
      conversionError.value = 'Ошибка при конвертации'
      console.error('Ошибка конвертации:', err)
    } finally {
      isConverting.value = false
    }
  }

  const convertToFrom = () => {
    if (isNaN(toInput.value.amount) || toInput.value.amount < 0) {
      fromInput.value.amount = 0
      return
    }

    isConverting.value = true
    conversionError.value = null

    try {
      const convertedAmount = currencyStore.convertCurrency(
        toInput.value.amount,
        toInput.value.currency,
        fromInput.value.currency
      )
      
      fromInput.value.amount = convertedAmount
    } catch (err) {
      conversionError.value = 'Ошибка при конвертации'
      console.error('Ошибка конвертации:', err)
    } finally {
      isConverting.value = false
    }
  }

  const swapCurrencies = () => {
    const tempCurrency = fromInput.value.currency
    const tempAmount = fromInput.value.amount
    
    fromInput.value.currency = toInput.value.currency
    fromInput.value.amount = toInput.value.amount
    
    toInput.value.currency = tempCurrency
    toInput.value.amount = tempAmount
  }

  const resetConverter = () => {
    fromInput.value = { currency: Currency.RUB, amount: 0 }
    toInput.value = { currency: Currency.USD, amount: 0 }
    conversionError.value = null
  }

  watch(
    () => [fromInput.value.amount, fromInput.value.currency, toInput.value.currency],
    () => {
      if (fromInput.value.amount > 0) {
        convertFromTo()
      } else {
        toInput.value.amount = 0
      }
    },
    { deep: true }
  )

  watch(
    () => currencyStore.baseCurrency,
    (newBase) => {
      fromInput.value.currency = newBase
    }
  )

  return {
    fromInput,
    toInput,
    isConverting,
    conversionError,
    
    isValidAmount,
    formattedFromAmount,
    formattedToAmount,
    
    updateFromInput,
    updateToInput,
    convertFromTo,
    convertToFrom,
    swapCurrencies,
    resetConverter
  }
}) 