<template>
  <div class="loading-container">
    <div class="loader"></div>
  </div>
</template>

<style lang="scss">
.loading-container {
  @extend %flex-center-column;
  height: 100%;
}

.loader {
  border: 3px solid hsla(39, 95%, 58%, 0.2);
  border-top-color: #e7a478;
  border-radius: 50%;
  width: 3em;
  height: 3em;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>