<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <index-view></index-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import indexView from './views/indexView.vue'
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'

const theme = ref<GlobalTheme | null>(null)
</script>

<style>
body {
  background: linear-gradient(
    90deg,
    rgba(247, 149, 51, 0.1),
    rgba(243, 112, 85, 0.1) 15%,
    rgba(239, 78, 123, 0.1) 30%,
    rgba(161, 102, 171, 0.1) 44%,
    rgba(80, 115, 184, 0.1) 58%,
    rgba(16, 152, 173, 0.1) 72%,
    rgba(7, 179, 155, 0.1) 86%,
    rgba(109, 186, 130, 0.1)
  );
}
</style>
