<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    v-bind:fill="fill"
    stroke="rgba(239,144,95,1)"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    class="feather feather-bookmark"
    viewBox="0 0 24 24"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
</template>

<script>
export default {
  name: "BookmarkIcon",
  props: {
    isBookmarked: Boolean
  },
  computed: {
    fill() {
      let fill = "none";
      if (this.isBookmarked) fill = "rgba(239,144,95,1)";
      return fill;
    }
  }
};
</script>