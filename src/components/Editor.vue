<template>
  <fragment>
  <button v-on:click="handleSave" class="save-button">Save note</button>
  <vue-editor v-model="content" v-bind:editor-toolbar="customToolbar" class="editor" />
  </fragment>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },
  data: () => ({
    content: "",
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
  }),
  methods: {
    handleSave: function() {
      console.log(this.content);
    }
  }
};
</script>

<style lang="scss" scoped>
.editor {
  text-decoration: initial !important;
	text-decoration: underline;
}

.save-button {
  background-color: #f89b5e;
  color: #fff;
  padding: 5px 25px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>