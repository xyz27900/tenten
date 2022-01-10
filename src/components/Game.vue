<template>
  <div class="relative flex flex-col flex-1">
    <div ref="gameContainer" class="flex-1" />
    <game-over :value="isOver" @restart="restart" />
  </div>
</template>

<script lang="ts" setup>
import { container } from 'tsyringe';
import { onMounted, ref } from 'vue';
import GameOver from '@/components/GameOver.vue';
import { Game } from '@/game';
import { MatrixService } from '@/services/matrix.service';
import { ScoreService } from '@/services/score.service';
import { ShapesService } from '@/services/shapes.service';
import { StateService } from '@/services/state.service';
import { syncRef } from '@/utils/observables';

const gameContainer = ref<HTMLDivElement | null>(null);
const stateService = container.resolve(StateService);
const shapesService = container.resolve(ShapesService);
const matrixService = container.resolve(MatrixService);
const scoreService = container.resolve(ScoreService);
const isOver = syncRef(stateService.isOver);

const restart = (): void => {
  stateService.reset();
  shapesService.reset();
  matrixService.reset();
  scoreService.reset();
};

onMounted(() => {
  if (gameContainer.value) {
    new Game(gameContainer.value);
  }
});
</script>
