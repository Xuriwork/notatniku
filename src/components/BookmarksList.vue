<template>
  <div class="bookmarks-list-container">
    <h4>Bookmarks</h4>
    <span v-if="!bookmarks.length">You have no bookmarks</span>
    <ul v-else>
      <li
        v-for="bookmark in bookmarks"
        v-bind:key="bookmark.bookmarkId"
        v-bind:id="bookmark.bookmarkId"
        v-on:click="handleChangeView"
      >
        <img src="../assets/icons/book-icon.svg" alt="Bookmark icon" />
        {{ bookmark.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "BookmarksList",
  props: {
    bookmarks: Array,
    handleChangeView: Function
  }
};
</script>