<template>
  <div class="home-component">
    <Sidepanel
      v-bind:notes="notes"
      v-bind:bookmarks="bookmarks"
      v-bind:selectedNote="selectedNote"
      v-bind:handleChangeView="handleChangeView"
      v-bind:handleModal="handleModal"
      v-bind:toggleSidepanel="toggleSidepanel"
      v-bind:sidepanelOpen="sidepanelOpen"
      v-bind:toggleDropdown="toggleDropdown"
      v-bind:dropdownOpen="dropdownOpen"
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
          v-bind:handleUpdateNote="handleUpdateNote"
        />
      </div>
    </div>
    <button class="floating-action-button" v-on:click="toggleSidepanel">
      <img src="../assets/icons/notatniku-logo.svg" alt />
    </button>
  </div>
</template>

<script>
import Sidepanel from "../components/Sidepanel";
import Editor from "../components/Editor";
import BookmarkIcon from "../components/BookmarkIcon";
import firebase, { usersCollection } from "../utils/firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default {
  name: "Home",
  components: {
    Sidepanel,
    Editor,
    BookmarkIcon,
  },
  data() {
    return {
      state: null,
      sessionSavedAt: null,
      noteData: {},
      error: null,
      sidepanelOpen: false,
      dropdownOpen: false,
    };
  },
  methods: {
    toggleSidepanel() {
      this.sidepanelOpen = !this.sidepanelOpen;
      if (this.dropdownOpen) this.dropdownOpen = false;
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    handleModal(type) {
      this.$store.commit("setModalType", type);
    },
    handleChangeView(e) {
      this.state = null;
      const id = e.target.id;
      const index = this.notes.findIndex((note) => note.id === id);
      if (this.sidepanelOpen) this.sidepanelOpen = false;
      return this.$store.commit("setSelectedNoteIndex", index);
    },
    handleBookmark(note, isBookmarked) {
      if (isBookmarked) {
        return usersCollection.doc(this.userId).update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove(note.id),
        });
      }
      usersCollection.doc(this.userId).update({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(note.id),
      });
    },
    updateNoteTitle(e) {
      this.noteData.title = e.target.innerText;
    },
    updateNoteContent(e) {
      this.noteData.content = e;
    },
    setStateToSaved() {
      this.state = "saved";
      this.sessionSavedAt = dayjs().format("HH:mm:ss");
    },
    async handleUpdateNote() {
      this.state = "loading";

      if (this.noteData.title) {
        const sanitizedTitle = this.$sanitize(this.noteData.title.trim());
        this.noteData.title = sanitizedTitle;
        if (this.noteData.title.trim() === "") this.noteData.title = "Untitled";
      }

      try {
        await usersCollection
          .doc(this.userId)
          .collection("notes")
          .doc(this.selectedNote.id)
          .update(this.noteData)
          .then(() => this.setStateToSaved());
      } catch (error) {
        this.state = "error";
        this.error = error;
      }
    },
  },
  computed: {
    userId() {
      return this.$store.getters.userId;
    },
    notes() {
      return this.$store.getters.notes;
    },
    selectedNote() {
      return this.$store.getters.selectedNote;
    },
    bookmarks() {
      return this.notes
        .filter((note) => this.$store.getters.bookmarks.includes(note.id))
        .map((bookmark) => {
          return { id: bookmark.id, name: bookmark.title };
        });
    },
    isBookmarked() {
      const bookmarks = this.$store.getters.bookmarks;
      const arrayOfBookmarkIds = bookmarks.map((bookmark) => bookmark);
      return arrayOfBookmarkIds.includes(this.selectedNote.id);
    },
    computedNoteData() {
      return {
        content: this.selectedNote.content,
        title: this.selectedNote.title,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.home-component {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;

  .no-notes-screen {
    @extend %flex-center-column;
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

.home-view-container {
  padding: 40px;
  width: 100%;
}

.floating-action-button {
  display: none;
}

@media (max-width: 600px) {
  .home-view-container {
    padding: 40px 15px;
  }

  .sidepanel-component {
    position: absolute;
    transform: translateX(-100%);
  }

  .sidepanel-component[data-isOpen=true] {
    transform: translateX(0%);
  }

  .floating-action-button {
    display: block;
    z-index: 10;
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: transparent;

    img {
      width: 50px;
    }
  }
}
</style>