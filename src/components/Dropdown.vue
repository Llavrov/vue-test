<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  const props = defineProps<{
    placeholder?: string
    options: string[]
    isOpen: boolean
    selectedOption: string
  }>()

  const emit = defineEmits<{
    'update:isOpen': [value: boolean],
    'update:selectedOption': [value: string],
  }>()

  const handleSelect = (option: string) => {
    emit('update:selectedOption', option)
    emit('update:isOpen', false)
  }

  const handleOpen = () => {
    emit('update:isOpen', !props.isOpen)
  }

  const dropdownRef = ref<HTMLDivElement | null>(null)
  const handleClickOutside = (event: Event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      emit('update:isOpen', false)
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<template>
  <div class="dropdown-container" ref="dropdownRef">
    <div @click="handleOpen" class="dropdown-header">
      <span class="dropdown-title">{{ selectedOption ?? placeholder }}</span>
      <span class="dropdown-icon" :class="{ 'dropdown-open': isOpen }">▼</span>
    </div>

    <div class="dropdown-options" v-if="isOpen">
      <div
        @click="handleSelect(option)"
        class="dropdown-option"
        v-for="option in options"
        :key="option"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .dropdown-container {
    position: relative;
    width: 80px;
  }

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px;
    background-color: white;
    border: 2px solid var(--secondary-color);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .dropdown-header:hover {
    border-color: var(--primary-color);
  }

  .dropdown-title {
    font-size: 16px;
    color: #333;
  }

  .dropdown-icon {
    font-size: 12px;
    transition: transform 0.3s ease;
  }

  .dropdown-icon.dropdown-open {
    transform: rotate(180deg);
  }

  .dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid var(--secondary-color);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    box-shadow: var(--shadow);
    z-index: 1000;
    margin-top: 4px;
  }

  .dropdown-option {
    padding: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .dropdown-option:hover {
    background-color: #f5f5f5;
  }

  .dropdown-option:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
</style>
