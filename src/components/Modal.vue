<template>
  <div v-on:click="closeModal" class="modal-overlay" id="modal-overlay">
    <div class="modal" v-bind:class="'modal-' + modalType">
      <div class="modal-content" v-bind:class="'modal-content-' + modalType">
        <h2>{{ modalInfo.heading }}</h2>
        <form v-if="modalType === 'add'">
          <input type="text" v-model="noteName" placeholder="Note name" />
        </form>
        <div v-if="modalType === 'trash'" class="trash-list-container" style="marginTop: 10px">
          <span v-if="!trash.length">Your trash is empty</span>
          <ul v-else>
            <li v-for="note in trash" v-bind:key="note.noteId">
              <span>{{ note.title }}</span>
              <button v-bind:id="note.noteId" v-on:click="handleRemoveFromTrash">Remove</button>
              <button v-bind:id="note.noteId" v-on:click="handleDeleteNote">Delete</button>
            </li>
          </ul>
        </div>
        <ul v-if="modalType === 'more-items'" class="more-items-list">
          <li>Save as a PDF</li>
          <li
            class="add-to-trash-button"
            v-bind:id="selectedNote.noteId"
            v-on:click="handleAddToTrash"
            v-bind:disabled="loading"
          >Add to trash</li>
        </ul>
      </div>
      <div class="modal-bottom">
        <div>
          <button class="cancel-button" v-on:click="closeModal">Cancel</button>
          <button
            v-if="modalInfo.button"
            v-on="{click: modalInfo.button === 'Create Note' ? handleCreateNote : null}"
            v-bind:disabled="loading"
          >{{ modalInfo.button }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase, { usersCollection } from "../utils/firebase";
import uniqid from "uniqid";

export default {
  name: "Modal",
  props: {
    modalType: String
  },
  data() {
    return {
      noteName: "",
      loading: false
    };
  },
  methods: {
    closeModal: function(e) {
      const modalOverlay = document.getElementById("modal-overlay");
      const cancelButton = document.querySelector(".cancel-button");
      if (e.target === modalOverlay || e.target === cancelButton) {
        this.$store.commit("setModalType", null);
      }
    },
    handleCreateNote: function() {
      this.loading = true;
      this.$store.commit("setModalType", null);

      const noteName = this.noteName;
      const userId = this.userId;
      const noteId = uniqid();
      const date = new Date();

      usersCollection
        .doc(userId)
        .collection("notes")
        .doc(noteId)
        .set({
          title: noteName,
          noteId,
          dateCreated: date,
          dateModified: date,
          content: "",
          isTrash: false
        })
        .then(() => {
          this.$store.commit("setSelectedNoteIndex", 0);
        })
        .catch(error => console.error(error));
    },
    handleAddToTrash: async function(e) {
      this.loading = true;

      const userId = this.userId;
      const noteId = e.target.id;

      if (this.isBookmarked) {
        usersCollection.doc(userId).update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove({
            bookmarkId: noteId,
            name: this.selectedNote.title
          })
        });
      }

      await usersCollection
        .doc(userId)
        .collection("notes")
        .doc(noteId)
        .update({ isTrash: true })
        .then(() => this.$store.commit("setModalType", null))
        .catch(error => console.error(error));
    },
    handleRemoveFromTrash: async function(e) {
      const userId = this.userId;
      const noteId = e.target.id;

      usersCollection
        .doc(userId)
        .collection("notes")
        .doc(noteId)
        .update({ isTrash: false })
        .catch(error => console.error(error));
    },
    handleDeleteNote: async function(e) {
      const userId = this.userId;
      const noteId = e.target.id;

      if (confirm("Are you sure you want to delete this note?")) {
        await usersCollection
          .doc(userId)
          .collection("notes")
          .doc(noteId)
          .delete()
          .catch(error => console.error(error));
      }
    }
  },
  computed: {
    modalInfo: function() {
      let modalInfo = {};

      if (this.modalType === "add") {
        modalInfo = {
          heading: "Create New Note",
          button: "Create Note"
        };
      } else if (this.modalType === "trash") {
        modalInfo = {
          heading: "Trash"
        };
      } else if (this.modalType === "more-items") {
        modalInfo = {
          heading: "More"
        };
      }
      return modalInfo;
    },
    notes: function() {
      return this.$store.getters.notes;
    },
    selectedNote: function() {
      return this.$store.getters.selectedNote;
    },
    isBookmarked: function() {
      return this.$store.getters.isBookmarked;
    },
    trash: function() {
      return this.$store.getters.trash;
    },
    userId: function() {
      return this.$store.getters.userId;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  @extend %flex-center-column;
  background-color: #00000025;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
}

.modal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  min-height: 170px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 5px;

  .modal-content {
    width: 100%;

    h2 {
      font-size: 1.4em;
    }
  }

  .more-items-list {
    margin-top: 15px;

    li {
      cursor: pointer;
    }

    li:not(:last-of-type) {
      margin-bottom: 5px;
    }
  }

  input[type="text"] {
    border: 0;
    outline: 0;
    padding: 10px;
    border-radius: 5px;
    display: block;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    font-family: "Merriweather", sans-serif;
    box-shadow: (0 1px 1px rgba(black, 0.1));
    resize: none;
    box-sizing: border-box;
    background-color: #c2c2c257;

    &:focus {
      box-shadow: (0 0px 2px rgba(#a7d3e4, 1));
    }
  }

  .modal-bottom {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;

    button:nth-child(2) {
      margin-left: 20px;
      color: #fff;
      background: linear-gradient(0.31deg, #f89b5e 0.7%, #f7b284 99.3%);
      box-shadow: 0 3px 6px rgba(107, 62, 19, 0.15);

      &:hover {
        background: linear-gradient(0.31deg, #f89b5e 20.7%, #f7b284 99.3%);
      }
    }

    .cancel-button {
      background: linear-gradient(0.31deg, #e2e2e2 0.7%, #ececec 99.3%);
    }

    button {
      padding: 8px 12px;
      border-radius: 4px;
    }
  }

  .add-to-trash-button {
    color: #ffffff;
    background-color: #ff5959;
    display: inline-block;
    padding: 4px 15px;
    border-radius: 4px;
    font-weight: 500;
  }
}

.modal-trash {
  max-width: 550px;
  width: 100%;
  padding-left: 25px;

  .cancel-button  {
    margin-right: 10px;
    background-color: #f89b5e;
  }
}

.trash-list-container {
  ul {
    overflow-y: auto;
    max-height: 400px;
    padding-right: 10px;

    &::-webkit-scrollbar {
      width: 6px;
      background-color: #f5f5f5;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #f89b5e;
      border-radius: 50px;
    }
  }

  li {
    overflow-y: hidden;
    display: flex;
    align-items: flex-start;

    &:not(:last-of-type) {
      margin-bottom: 10px;
    }

    span {
      cursor: pointer;
      font-weight: 500;
      max-width: 200px;

      &:hover {
        color: #f89b5e;
      }
    }

    button {
      border: 1px solid transparent;
    }

    button:first-of-type {
      border: 1px solid #40514e;
      color: #40514e;
      background: #fff;
      padding: 4px 15px;
      border-radius: 4px;
      margin-left: auto;
      margin-right: 10px;
      box-sizing: border-box;

      &:hover {
        color: #ffffff;
        background: #40514e;
      }
    }

    button:last-of-type {
      background-color: #ff5959;
      color: #ffffff;
      padding: 4px 15px;
      border-radius: 4px;

      &:hover {
        background: #ff4b4b;
      }
    }
  }
}
</style>