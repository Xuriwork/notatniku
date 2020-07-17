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
          <h3>{{ selectedNote.note.title }}</h3>
        </div>
        <img
          src="../assets/icons/more-icon.svg"
          alt
          class="more-items-button"
          v-on:click="handleModal('more-items')"
        />
      </header>
      <span v-if="sessionSaved.saved">Saved: {{ sessionSaved }}</span>
      <div class="editor-container">
        <Editor />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import BookmarkIcon from "../components/BookmarkIcon";
import firebase, { usersCollection } from "../utils/firebase";

export default {
  name: "Home",
  components: {
    Sidebar,
    Editor,
    BookmarkIcon
  },
  data() {
    return {
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
    handleBookmark: function(note, isBookmarked) {
      const { noteId: bookmarkId, title: name } = note;
      console.log(bookmarkId, name)
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
      return this.$store.getters.userId;
    },
    notes: function() {
      return this.$store.state.notes;
    },
    bookmarks: function() {
      return this.$store.getters.bookmarks;
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
    },
    sessionSaved: function() {
      return { saved: false };
      //return dayjs(this.sessionSaved.timestamp).fromNow();
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

  .editor-container {
    margin-top: 15px;
  }
}
</style>