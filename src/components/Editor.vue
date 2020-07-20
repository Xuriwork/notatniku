<template>
  <vue-editor v-model="content" v-bind:editor-toolbar="customToolbar" class="editor" />
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },
  props: {
    intialContent: String
  },
  data() {
    return {
      content: this.intialContent,
      customToolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ["bold", "italic", "underline", "strike"],
        ["align", { align: "center" }, { align: "right" }, { align: "justify" } ],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: '-1' }, { indent: '+1' }],
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
}
</style>