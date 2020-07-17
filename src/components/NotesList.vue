<template>
  <div class="notes-list-container">
    <h4>Notes</h4>
    <span v-if="notes.length === 0">You haven't written any notes</span>
    <ul v-else v-for="(note, index) in notes" v-bind:key="note.noteId">
      <li
        v-on:click="handleViewChange"
        v-bind:id="note.noteId"
        v-bind:style="{color: index === selectedNoteIndex ? '#f89b5e' : ''}"
      >{{ note.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NotesList",
  props: {
    notes: Array,
    handleViewChange: Function,
    selectedNoteIndex: Number
  }
};
</script>