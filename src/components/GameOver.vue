<template>
  <div v-if="props.value" class="absolute inset-0">
    <div class="absolute inset-0 bg-white opacity-80" />
    <div class="relative w-full h-0 pt-full">
      <div class="absolute inset-0 flex flex-col justify-center items-center">
        <div class="text-3xl font-sans text-red">Game over</div>
        <button class="mt-3" @click="emit('restart', false)">
          <icon-reload class="w-12 h-12 text-red" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconReload from '@/assets/svg/reload.svg';

const props = defineProps({
  value: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['restart']);
</script>
