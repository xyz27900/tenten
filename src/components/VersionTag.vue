<template>
  <div class="flex items-center text-black px-4 py-2">
    <image-tag class="block w-6 h-6 text-green" />
    <span class="text-lg ml-2 text-black">{{ version }}</span>
  </div>
</template>

<script lang="ts" setup>
import ImageTag from '@/assets/svg/tag.svg';

const version = __VERSION__;
</script>
