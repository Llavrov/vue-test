<script setup lang="ts">
import { Currency } from '@/types/currency'
import { computed } from 'vue'

interface InputProps {
  modelValue: number
  placeholder?: string
  error?: string | null
  currency: Currency
  disabled?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: 0,
  placeholder: '',
  error: null,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'input': [value: number]
  'blur': []
  'focus': []
}>()

const handleInput = (event: Event) => {
  const target = (event.target as HTMLInputElement)
  const value = parseFloat(target.value) || 0

  if (value < 0) {
    emit('update:modelValue', 0)
  } else {
    emit('update:modelValue', value)
  }
}

</script>

<template>
  <div class="input-wrapper">
    <div class="input-container">
      <input
        class="input"
        type="number"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @blur="emit('blur')"
        @focus="emit('focus')"
        min="0"
      />
      
      <div class="currency-section">
        <slot name="currency" :currency="currency">
          <span class="currency">{{ currency }}</span>
        </slot>
      </div>
    </div>

    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid var(--secondary-color);
  border-radius: var(--border-radius);
  background: white;
  transition: all 0.3s ease;
}

.input-container:hover {
  border-color: var(--primary-color);
}

.input-container:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.input {
  flex: 1;
  padding: 12px;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  color: #333;
}

.input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.currency-section {
  padding: 6px;
  background-color: #f8f9fa;
  border-left: 1px solid var(--secondary-color);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.currency {
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.error {
  color: var(--danger-color);
  font-size: 12px;
  margin-left: 4px;
}
</style>
