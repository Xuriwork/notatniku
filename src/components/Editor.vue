<template>
  <vue-editor
    v-model="content"
    v-bind:editor-toolbar="customToolbar"
    class="editor"
    v-on:input="updateNoteContent"
  />
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },
  props: {
    initialContent: String,
    updateNoteContent: Function
  },
  data() {
    return {
      content: this.initialContent,
      customToolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [
          "align",
          { align: "center" },
          { align: "right" },
          { align: "justify" }
        ],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["color", "background"],
        ["link", "image", "video"],
        ["clean"]
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.editor {
  text-decoration: initial !important;
  text-decoration: underline;
  height: calc(100% - 120px);
}
</style>