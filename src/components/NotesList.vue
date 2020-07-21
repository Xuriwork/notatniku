<template>
  <div class="notes-list-container">
    <h4>Notes</h4>
    <span v-if="!notes.length">You haven't written any notes</span>
    <ul v-else>
      <li 
        v-for="note in notes" 
        v-bind:key="note.noteId"
        v-bind:id="note.noteId"
        v-on:click="handleChangeView"
        v-bind:style="{color: note.noteId === selectedNoteId ? '#f89b5e' : ''}"
      >{{ note.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NotesList",
  props: {
    notes: Array,
    handleChangeView: Function,
    selectedNoteId: String
  }
};
</script>