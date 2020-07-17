<template>
  <div class="home-component">
    <Sidebar
      v-bind:notes="notes"
      v-bind:bookmarks="bookmarks"
      v-bind:selectedNote="selectedNote"
      v-bind:selectedNoteIndex="selectedNoteIndex"
      v-bind:handleViewChange="handleViewChange"
    />
    <div class="no-notes-screen" v-if="notes.length === 0">You have 0 notes</div>
    <div class="home-view-container" v-else>
      <header>
        <div>
          <span v-on:click="handleBookmark(selectedNote.note, isBookmarked)">
            <BookmarkIcon v-bind:isBookmarked="isBookmarked" />
          </span>
          <h3>{{ title }}</h3>
        </div>
        <img
          src="../assets/icons/more-icon.svg"
          alt
          class="more-items-button"
          v-on:click="handleModal('more-items')"
        />
      </header>
      <span v-if="sessionSaved.saved">Saved: {{ dayjs(sessionSaved.timestamp).fromNow() }}</span>
      <div class="content-container">
        <CKEditor
          v-bind:editor="BalloonEditor"
          v-bind:config="editorConfiguration"
          v-bind:data="content"
          v-bind:onchange="handleEditorChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar";
import firebase, { usersCollection } from "../utils/firebase";

export default {
  name: "Home",
  components: {
    Sidebar
  },
  data() {
    return {
      notes: [],
      bookmarks: [],
      selectedNoteIndex: 0
    };
  },
  methods: {
    handleViewChange: function(e) {
      const noteId = e.target.id;
      const index = this.notes.findIndex(note => note.noteId === noteId);
      console.log(index);
      //return this.selectedNote = this.notes[index];
    },
    handleBookmark: (note, isBookmarked) => {
      const { noteId: bookmarkId, name } = note;
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
    }
  },
  computed: {
    userId: function() {
      return this.$store.getters.userId
    },
    selectedNote: function() {
      return {
        note: this.notes.length === 0 ? [] : this.notes[0],
        index: 0
      };
    },
    bookmarksName: function() {
      return this.bookmarks.map(bookmark => bookmark.name);
    },
    isBookmarked: function() {
      return this.bookmarksName.includes(this.selectedNote.note.title);
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

    button {
      background-color: #f89b5e;
      color: #fff;
      padding: 5px 25px;
      border-radius: 5px;
      margin-top: 10px;
    }
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
  }

  .content-container {
    .title-input {
      line-height: 50px;
      font-size: 2em;
      font-weight: 700;
      max-width: 100%;
      width: 100%;
      white-space: pre-wrap;
      word-break: break-word;
      caret-color: #5c5a56;
      padding: 3px 2px;
      min-height: 1em;
      color: rgba(255, 255, 255, 0.9);
      -webkit-text-fill-color: #5c5a56;
      cursor: text;
      box-sizing: border-box;
      -webkit-user-modify: read-write;
      overflow-wrap: break-word;
      -webkit-line-break: after-white-space;
      line-break: after-white-space;
      pointer-events: auto;
    }
  }

  .ce-block__content {
    background-color: #bac965 !important;

    .ce-paragraph cdx-block {
      background-color: #e654e6 !important;
    }
  }
}
</style>