<template>
  <fragment>
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
            <span v-on:click="handleBookmark(selectedNote.note, isBookmarked)">
              <BookmarkIcon v-bind:isBookmarked="isBookmarked" />
            </span>
            <div contenteditable v-on:input="updateNoteTitle">{{ computedNoteData.title }}</div>
          </div>
          <img
            src="../assets/icons/more-icon.svg"
            alt
            class="more-items-button"
            v-on:click="handleModal('more-items')"
          />
        </header>
        <div class="data-state-container">
          <span v-if="state === 'synced' && sessionSavedAt" class="synced-state">
            <img src="../assets/icons/cloud-icon.svg" alt="cloud icon" />
            Synced at {{ sessionSavedAt }}
          </span>
          <span v-else-if="state === 'modified'">Data changed, and will sync</span>
          <span v-else-if="state === 'revoked'">Data revoked to original data</span>
          <span
            v-else-if="state === 'error'"
            style="color: #ff5959; font-weight: 600"
          >Failed to save data. {{ errorMessage }}</span>
          <span v-else-if="state === 'loading'" class="loading-state">
            <div class="loading-div"></div>Loading...
          </span>
        </div>
        <div class="editor-container">
          <Editor
            v-bind:initialContent="computedNoteData.content"
            v-bind:key="selectedNote.note.noteId"
            v-bind:updateNoteContent="updateNoteContent"
          />
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import BookmarkIcon from "../components/BookmarkIcon";
import firebase, { usersCollection } from "../utils/firebase";
import debounce from "debounce";
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
      state: "loading",
      sessionSavedAt: null,
      firebaseData: null,
      noteData: {},
      error: ""
    };
  },
  created: async function() {
    if (this.selectedNote.note.noteId) {
      const noteRef = usersCollection
        .doc(this.userId)
        .collection("notes")
        .doc(this.selectedNote.note.noteId);

      let data = (await noteRef.get()).data();

      if (!data) {
        data = { content: "", title: "" };
        noteRef.update(data);
      }

      this.noteData = data;
      this.state = "synced";
      const date = new Date();
      this.sessionSavedAt = dayjs(date).format("HH:mm:ss");
    }
  },
  firestore() {
    if (this.selectedNote.note.noteId) {
      return {
        firebaseData: usersCollection
          .doc(this.userId)
          .collection("notes")
          .doc(this.selectedNote.note.noteId)
      };
    }
  },
  methods: {
    handleModal: function(type) {
      this.$store.commit("setModalType", type);
    },
    handleChangeView: function(e) {
      const noteId = e.target.id;
      const index = this.notes.findIndex(note => note.noteId === noteId);
      const selectedNote = { note: this.notes[index], index };
      return this.$store.commit("setSelectedNote", selectedNote);
    },
    handleBookmark: function(note, isBookmarked) {
      const { noteId: bookmarkId, title: name } = note;
      if (isBookmarked) {
        return usersCollection.doc(this.userId).update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove({
            bookmarkId,
            name
          })
        });
      }
      usersCollection.doc(this.userId).update({
        bookmarks: firebase.firestore.FieldValue.arrayUnion({
          bookmarkId,
          name
        })
      });
    },
    async updateFirebase() {
      try {
        await usersCollection
          .doc(this.userId)
          .collection("notes")
          .doc(this.selectedNote.note.noteId)
          .update(this.noteData);

        this.state = "synced";
        const date = new Date();
        this.sessionSavedAt = dayjs(date).format("HH:mm:ss");
      } catch (error) {
        console.log(error);
        this.error = JSON.stringify(error);
        this.state = "error";
      }
    },
    updateNoteTitle: function(e) {
      this.noteData.title = e.target.innerText;
      this.state = "modified";
      this.debouncedUpdate();
    },
    updateNoteContent(e) {
      this.noteData.content = e;
      this.state = "modified";
      this.debouncedUpdate();
    },
    debouncedUpdate: debounce(function() {
      this.updateFirebase();
    }, 1500)
  },
  computed: {
    userId: function() {
      return this.$store.getters.userId;
    },
    notes: function() {
      return this.$store.getters.notes;
    },
    bookmarks: function() {
      return this.$store.getters.bookmarks;
    },
    selectedNote: function() {
      return this.$store.getters.selectedNote;
    },
    isBookmarked: function() {
      const bookmarksName = this.bookmarks.map(bookmark => bookmark.bookmarkId);
      return bookmarksName.includes(this.selectedNote.note.noteId);
    },
    computedNoteData: {
      get: function() {
        return {
          content: this.selectedNote.note.content,
          title: this.selectedNote.note.title
        };
      },
      set: function(data) {
        return (this.noteData = data);
      }
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

    .synced-state {
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
        animation: spin 3s ease infinite;
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

  .editor-container {
    margin-top: 15px;
  }
}
</style>