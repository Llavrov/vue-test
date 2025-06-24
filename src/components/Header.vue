<script setup lang="ts">
  import IconCommunity from './icons/IconCommunity.vue'
  import { useCurrencyStore } from '@/stores/currency'
  import Dropdown from './Dropdown.vue'
  import { ref } from 'vue'

  const currencyStore = useCurrencyStore()
  const isDropdownOpen = ref(false)
</script>

<template>
  <header class="container">
    <IconCommunity class="icon" />
    
    <nav>
      <RouterLink to="/" class="nav-link" active-class="active">Главная</RouterLink>
      <RouterLink to="/convert" class="nav-link" active-class="active">Конвертер</RouterLink>
    </nav>

    <Dropdown
        :options="currencyStore.supportedCurrencies"
        v-model:isOpen="isDropdownOpen"
        v-model:selectedOption="currencyStore.baseCurrency"
        :title="currencyStore.baseCurrency"
        @update:selectedOption="currencyStore.setBaseCurrency"
    />
  </header>
</template>

<style scoped>

.container {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
}

.icon {
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
  color: #42b883;
}

nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #e9ecef;
}

.nav-link.active {
  color: #42b883;
  font-weight: bold;
}
</style>