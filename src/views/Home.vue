<template>
  <div class="home-component">
    <Sidebar
      v-bind:notes="notes"
      v-bind:bookmarks="bookmarks"
      v-bind:selectedNote="selectedNote"
      v-bind:handleChangeView="handleChangeView"
      v-bind:handleModal="handleModal"
    />
    <div class="no-notes-screen" v-if="!notes.length">You have 0 notes</div>
    <div class="home-view-container" v-else>
      <header>
        <div>
          <span v-on:click="handleBookmark(selectedNote, isBookmarked)">
            <BookmarkIcon v-bind:isBookmarked="isBookmarked" />
          </span>
          <div
            contenteditable
            v-on:input="updateNoteTitle"
            placeholder="Untitled"
          >{{ computedNoteData.title }}</div>
        </div>
        <img
          src="../assets/icons/more-icon.svg"
          alt
          class="more-items-button"
          v-on:click="handleModal('more-items')"
        />
      </header>
      <div class="data-state-container">
        <button v-on:click="handleUpdateNote" class="save-button">Save</button>
        <span v-if="state === 'saved' && sessionSavedAt" class="saved-state">
          <img src="../assets/icons/cloud-icon.svg" alt="cloud icon" />
          Saved at {{ sessionSavedAt }}
        </span>
        <span
          v-else-if="state === 'error'"
          style="color: #ff5959; font-weight: 600"
        >Failed to save data. {{ error }}</span>
        <span v-else-if="state === 'loading'" class="loading-state">
          <div class="loading-div"></div>Loading...
        </span>
      </div>
      <div class="editor-container">
        <Editor
          v-bind:initialContent="computedNoteData.content"
          v-bind:key="selectedNote.id"
          v-bind:updateNoteContent="updateNoteContent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import BookmarkIcon from "../components/BookmarkIcon";
import firebase, { usersCollection } from "../utils/firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default {
  name: "Home",
  components: {
    Sidebar,
    Editor,
    BookmarkIcon
  },
  data() {
    return {
      state: null,
      sessionSavedAt: null,
      noteData: {},
      error: null
    };
  },
  methods: {
    handleModal: function(type) {
      this.$store.commit("setModalType", type);
    },
    handleChangeView: function(e) {
      this.state = null;
      const id = e.target.id;
      const index = this.notes.findIndex(note => note.id === id);
      return this.$store.commit("setSelectedNoteIndex", index);
    },
    handleBookmark: function(note, isBookmarked) {
      const { id: id, title: name } = note;
      if (isBookmarked) {
        return usersCollection.doc(this.userId).update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove({
            id,
            name
          })
        });
      }
      usersCollection.doc(this.userId).update({
        bookmarks: firebase.firestore.FieldValue.arrayUnion({
          id,
          name
        })
      });
    },
    updateNoteTitle: function(e) {
      this.noteData.title = e.target.innerText;
    },
    updateNoteContent(e) {
      this.noteData.content = e;
    },
    setStateToSaved() {
      this.state = "saved";
      this.sessionSavedAt = dayjs().format("HH:mm:ss");
    },
    handleUpdateNote() {
      this.state = "loading";
      const { selectedNote, noteData, userId } = this;
      const { id } = selectedNote;

      if (this.noteData.title) {
        const sanitizedTitle = this.$sanitize(this.noteData.title);
        this.noteData.title = sanitizedTitle;
        if (this.noteData.title.trim() === "") this.noteData.title = "Untitled";
      }

      usersCollection
        .doc(userId)
        .collection("notes")
        .doc(id)
        .update(noteData)
        .then(() => this.setStateToSaved())
        .catch(error => console.error(error));
    }
  },
  computed: {
    userId: function() {
      return this.$store.getters.userId;
    },
    notes: function() {
      return this.$store.getters.notes;
    },
    selectedNote: function() {
      return this.$store.getters.selectedNote;
    },
    bookmarks: function() {
      return this.$store.getters.bookmarks;
    },
    isBookmarked: function() {
      return this.$store.getters.isBookmarked;
    },
    computedNoteData: function() {
      return {
        content: this.selectedNote.content,
        title: this.selectedNote.title
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.home-component {
  height: 100%;
  display: flex;

  .no-notes-screen {
    @extend %flex-center-column;
    width: 100%;
  }

  .home-view-container {
    padding: 40px;
    box-sizing: border-box;
    width: 100%;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 25px;
    border-bottom: 1px solid #c8c5c1;
    color: #b3b1ad;
    margin-bottom: 15px;

    > div {
      display: flex;
      align-items: center;

      svg {
        margin-right: 10px;
      }
    }

    img,
    svg {
      cursor: pointer;
    }

    h3 {
      color: #b3b1ad;
      font-weight: 400;
    }

    [contenteditable] {
      -webkit-tap-highlight-color: transparent;

      &:focus {
        outline: 0;
      }
    }

    [contenteditable]:empty:before {
      content: attr(placeholder);
      display: block;
      -webkit-text-fill-color: #e7d6b3 !important;
    }
  }

  .data-state-container {
    margin-top: 10px;
    display: flex;

    button {
      margin-right: 10px;
    }

    .saved-state {
      color: #23d18c;
      font-weight: 500;
      display: flex;
      align-items: center;

      img {
        width: 24px;
        margin-right: 5px;
      }
    }

    .loading-state {
      display: flex;
      align-items: center;

      .loading-div {
        margin-right: 12px;
        position: relative;
        width: 1.4em;
        height: 1.4em;
        border: 3px solid #e79166;
        overflow: hidden;
        animation: spin 2.5s ease infinite;
        box-sizing: border-box;
        border-radius: 5px;
      }

      .loading-div::before {
        content: "";
        position: absolute;
        top: -3px;
        left: -3px;
        width: 1.4em;
        height: 1.4em;
        background-color: rgba(243, 180, 98, 0.65);
        transform-origin: center bottom;
        transform: scaleY(1);
        animation: fill 3s linear infinite;
      }

      @keyframes spin {
        50%,
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes fill {
        25%,
        50% {
          transform: scaleY(0);
        }
        100% {
          transform: scaleY(1);
        }
      }
    }
  }

  .save-button {
    background-color: #f3a57e;
    color: #ffffff;
    padding: 5px 30px;
    border-radius: 5px;
  }

  .editor-container {
    margin-top: 15px;
  }
}
</style>