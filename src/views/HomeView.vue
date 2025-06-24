<script setup lang="ts">
  import { useCurrencyStore } from '@/stores/currency'

const currencyStore = useCurrencyStore()
</script>

<template>
  <div class="rates-list">
    <h2>Курсы валют к {{ currencyStore.baseCurrency }}</h2>
    <ul>
      <li
        v-for="currency in currencyStore.supportedCurrencies"
        :key="currency"
        v-if="currency !== currencyStore.baseCurrency"
      >
        1 {{ currency }} = 
        {{ currencyStore.getRate(currency, currencyStore.baseCurrency).toFixed(2) }}
        {{ currencyStore.baseCurrency }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rates-list {
  max-width: 400px;
  margin: 40px auto;
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}
.rates-list h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}
.rates-list ul {
  list-style: none;
  padding: 0;
}
.rates-list li {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
</style>