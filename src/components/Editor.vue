<template>
  <quill-editor
    v-model="content"
    v-on:input="onEditorUpdate"
    v-bind:options="editorOption"
    class="editor"
  ></quill-editor>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  components: { quillEditor },
  props: {
    initialContent: String,
    onEditorUpdate: Function,
  },
  data() {
    return {
      content: this.initialContent,
      editorOption: {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [
              "align",
              { align: "center" },
              { align: "right" },
              { align: "justify" },
            ],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["color", "background"],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.editor {
  text-decoration: initial !important;
  text-decoration: underline;
  height: calc(100% - 120px);
}
</style>