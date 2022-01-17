<template>
  <div v-if="isDesktop" class="flex justify-center h-full">
    <div class="flex flex-col">
      <div class="flex flex-col shrink-0 py-8">
        <div class="flex justify-center">
          <image1010 class="w-36" />
        </div>
        <div class="flex items-center mt-8">
          <div class="flex items-center justify-center flex-1">
            <span class="text-3xl text-teal font-cursive">
              {{ current }}
            </span>
          </div>
          <div class="flex shrink-0">
            <image-trophy class="w-12 h-12 text-yellow" />
          </div>
          <div class="flex items-center justify-center flex-1">
            <span class="text-3xl text-green font-cursive">
              {{ highest }}
            </span>
          </div>
        </div>
      </div>
      <game />
    </div>
    <github-link class="fixed right-4 bottom-4" />
  </div>
  <unavailable-screen v-else />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Image1010 from '@/assets/svg/1010.svg';
import ImageTrophy from '@/assets/svg/trophy.svg';
import Game from '@/components/Game.vue';
import GithubLink from '@/components/GithubLink.vue';
import UnavailableScreen from '@/components/UnavailableScreen.vue';
import { container } from '@/di/container';
import { ScoreService } from '@/services/score.service';
import { syncRef } from '@/utils/observables';

const scoreService = container.resolve(ScoreService);
const current = syncRef(scoreService.current);
const highest = syncRef(scoreService.highest);
const isDesktop = ref(!('ontouchstart' in window));
</script>
