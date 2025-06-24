<script setup lang="ts">
  import Input from './Input.vue'
  import Dropdown from './Dropdown.vue'
  import { Currency } from '@/types/currency'
  import { ref } from 'vue'
  import IconSwap from './icons/IconSwap.vue'
  import { useConverterStore } from '@/stores/converter'
  import { useCurrencyStore } from '@/stores/currency'

  const converterStore = useConverterStore()
  const currencyStore = useCurrencyStore()

  const isFromOpen = ref(false)
  const isToOpen = ref(false)

  const handleSwapCurrencies = () => {
    converterStore.swapCurrencies()
  }

  const handleReset = () => {
    converterStore.resetConverter()
  }
</script>

<template>
  <div class="converter-form">
    <div class="content">
      <Input
        v-model="converterStore.fromInput.amount"
        placeholder="Введите сумму"
        :currency="converterStore.fromInput.currency"
        :error="converterStore.conversionError"
      >
        <template #currency>
          <Dropdown
            :title="converterStore.fromInput.currency"
            :options="Object.values(Currency)"
            v-model:isOpen="isFromOpen"
            v-model:selectedOption="converterStore.fromInput.currency"
          />
        </template>
      </Input>

      <IconSwap class="icon-swap" />

      <Input
        v-model="converterStore.toInput.amount"
        placeholder="Результат"
        :currency="converterStore.toInput.currency"
        readonly
      >
        <template #currency>
          <Dropdown
            :title="converterStore.toInput.currency"
            :options="Object.values(Currency)"
            v-model:isOpen="isToOpen"
            v-model:selectedOption="converterStore.toInput.currency"
          />
        </template>
      </Input>
    </div>

    <div v-if="converterStore.fromInput.amount > 0" class="rate-info">
      <p class="rate-text">
        1 {{ converterStore.fromInput.currency }} = 
        {{ currencyStore.getRate(
          converterStore.fromInput.currency, 
          converterStore.toInput.currency
        ).toFixed(4) }} 
        {{ converterStore.toInput.currency }}
      </p>
    </div>

    <button 
      type="button" 
      class="btn btn-secondary"
      @click="handleReset"
    >
      Сбросить
    </button>
  </div>
</template>

<style scoped>
.converter-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.content {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.icon-swap {
  color: var(--primary-color);
  cursor: pointer;
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease;
}

.icon-swap:hover {
  transform: scale(1.1);
}

.rate-info {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1rem;
  text-align: center;
  width: 100%;
}

.rate-text {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .converter-form {
    padding: 1rem;
  }

  .inputs-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
