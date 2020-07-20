<template>
  <fragment>
    <Loading v-if="loading" />
    <div v-if="!loading" class="home-component">
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
          <Editor v-bind:content_PROP="selectedNote.note.content" v-bind:key="selectedNote.note.noteId" />
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Loading from "../components/Loading";
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import BookmarkIcon from "../components/BookmarkIcon";
import firebase, { usersCollection } from "../utils/firebase";

export default {
  name: "Home",
  components: {
    Loading,
    Sidebar,
    Editor,
    BookmarkIcon
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
    }
  },
  computed: {
    loading: function() {
      return this.$store.getters.loading;
    },
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