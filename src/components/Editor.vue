<template>
  <quill-editor
<<<<<<< HEAD
    v-model="content"
    v-on:input="onEditorUpdate"
    v-bind:config="editorOption"
=======
    ref="myTextEditor"
    v-model="content"
    v-on:input="onEditorUpdate"
    :config="editorOption"
>>>>>>> 07935a1dd4562114dbd41f31f804c234de997de9
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
      editorOption: {},
      customToolbar: [
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