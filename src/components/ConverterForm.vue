<script setup lang="ts">
  import Input from './Input.vue'
  import Dropdown from './Dropdown.vue'
  import { Currency } from '@/types/currency'
  import { ref } from 'vue'
  import IconSwap from './icons/IconSwap.vue'

  const fromAmount = ref(0)
  const toAmount = ref(0)
  const fromCurrency = ref(Currency.USD)
  const toCurrency = ref(Currency.RUB)
  const isFromOpen = ref(false)
  const isToOpen = ref(false)
</script>

<template>
  <div class="converter-form">
    <Input
      v-model="fromAmount"
      placeholder="Введите сумму"
    >
      <template #currency>
        <Dropdown
          :options="Object.values(Currency)"
          v-model:isOpen="isFromOpen"
          v-model:selectedOption="fromCurrency"
        />
      </template>
    </Input>

    <IconSwap class="icon-swap" />

    <Input
      v-model="toAmount"
      placeholder="Введите сумму"
    >
      <template #currency>
        <Dropdown
          :options="Object.values(Currency)"
          v-model:isOpen="isToOpen"
          v-model:selectedOption="toCurrency"
        />
      </template>
    </Input>
  </div>
</template>

<style scoped>

.converter-form {
  display: flex;
  gap: 20px;
  align-items: center;
}

.icon-swap {
  color: var(--primary-color);
  cursor: pointer;
  width: 20px;
  height: 20px;
}

</style>
