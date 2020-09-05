<template>
  <div
    class="sidepanel-component"
    v-bind:style="sidepanelStylesObject"
    v-bind:data-isOpen="sidepanelOpen"
    v-touch:swipe.left="toggleSidepanel"
  >
    <div
      class="sidepanel-top"
      v-on="{click: !sidepanelOpen ? toggleSidepanel : (sidepanelOpen && toggleDropdown)}"
    >
      <img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
      <div v-show="sidepanelOpen">
        <h3>{{ name }}</h3>
        <span>{{ email }}</span>
      </div>
    </div>
    <div class="user-dropdown" v-show="sidepanelOpen && dropdownOpen">
      <div class="user-info-div">
        <div>{{ name.charAt(0) }}</div>
        <h5>{{ name }}</h5>
      </div>
      <hr />
      <ul>
        <li v-if="deferredPrompt">
          <button v-on:click="handlePromptInstall" class="install-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5c5a56"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-download"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Install Notatniku
          </button>
        </li>
        <li>
          <a
            href="https://dribbble.com/shots/5922909-Notebook-Light-and-Dark-Mode"
            target="_blank"
            rel="noopener noreferrer"
          >
            Credits to Monika
            <span role="img">🧡</span>
          </a>
        </li>
        <li>
          <button v-on:click="handleSignOut">Sign out ({{ email }})</button>
        </li>
      </ul>
    </div>
    <Search v-show="sidepanelOpen" v-bind:handleChangeView="handleChangeView" />
    <fragment v-if="sidepanelOpen">
      <BookmarksList v-bind:bookmarks="bookmarks" v-bind:handleChangeView="handleChangeView" />
      <NotesList
        v-bind:handleChangeView="handleChangeView"
        v-bind:notes="notes"
        v-bind:selectedNoteId="selectedNote.id"
      />
      <div class="add-note-container" v-on:click="handleModal('create-note')">
        <img src="../assets/icons/add-icon.svg" alt="Add icon" />
        <span>Add Note</span>
      </div>
      <div class="trash-item-container" v-on:click="handleModal('trash')">
        <img src="../assets/icons/delete-bin-icon.svg" alt="Trashcan icon" />
        <span>Trash</span>
      </div>
    </fragment>
    <button v-on:click="toggleSidepanel" class="toggle-sidepanel-button">
      <img v-if="sidepanelOpen" src="../assets/icons/arrow-left-circle.svg" alt="Close Sidepanel" />
      <img v-else src="../assets/icons/arrow-right-circle.svg" alt="Open Sidepanel" />
    </button>
  </div>
</template>

<script>
import BookmarksList from "./BookmarksList";
import NotesList from "./NotesList";
import Search from "./Search";

export default {
  name: "sidepanel",
  components: {
    Search,
    BookmarksList,
    NotesList,
  },
  props: {
    notes: Array,
    bookmarks: Array,
    toggleSidepanel: Function,
    sidepanelOpen: Boolean,
    toggleDropdown: Function,
    dropdownOpen: Boolean,
    handleChangeView: Function,
    handleModal: Function,
    selectedNote: Object,
  },
  data() {
    return {
      name: this.$store.getters.user.displayName,
      email: this.$store.getters.user.email,
      deferredPrompt: window.deferredPrompt,
    };
  },
  methods: {
    handleSignOut() {
      this.$store.dispatch("signOut");
    },
    handlePromptInstall: () => window.deferredPrompt.prompt(),
  },
  computed: {
    sidepanelStylesObject() {
      return {
        width: this.sidepanelOpen ? "380px" : "60px",
        minWidth: this.sidepanelOpen ? "280px" : "0",
        padding: this.sidepanelOpen ? "35px 30px" : "35px 0",
        alignItems: this.sidepanelOpen ? "initial" : "center",
        zIndex: this.sidepanelOpen ? "2" : "1",
      };
    },
  },
};
</script>

<style lang="scss">
.sidepanel-component {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fdfbf7;
  color: #5c5a56;
  left: 0;
  height: 100%;
  max-width: 90%;
  overflow-x: hidden;
  box-sizing: border-box;
  transition: 0.5s;

  .user-dropdown {
    position: absolute;
    top: 90px;
    background-color: #ffe8dd;
    border-radius: 5px;
    width: calc(100% - 60px);
    z-index: 2;
    padding: 5px 0;
    animation: show 0.5s;

    @keyframes show {
      from {
        opacity: 0;
        top: 85px;
      }
      to {
        opacity: 1;
        top: 90px;
      }
    }

    .user-info-div {
      display: flex;
      align-items: center;
      padding: 10px;

      h5 {
        font-size: 1em;
        font-weight: 500;
        margin-left: 5px;
      }

      > div {
        width: 25px;
        height: 25px;
        line-height: 25px;
        border-radius: 5px;
        background-color: #f0ad8c;
        text-align: center;
        color: #fff;
      }
    }

    button {
      width: 100%;
      background: transparent;
      text-align: left;
      padding: 10px;

      &:hover {
        background-color: #f7bb9f;
        color: #ffffff;
      }
    }

    hr {
      margin-bottom: 4px;
      border: none;
      border-bottom: 0.5px #a8a39d8c solid;
    }

    ul {
      li {
        font-weight: 500;
        font-size: 0.9em;
        color: #5c5a56;
        overflow: hidden;

        a {
          display: block;
        }
      }

      .install-button {
        display: flex;
        align-items: center;

        svg {
          margin-right: 8px;
          width: 18px;
        }

        &:hover svg {
          stroke: #ffffff;
        }
      }

      a {
        padding: 10px;
        width: 100%;

        span[role="img"] {
          margin-left: 5px;
        }

        &:hover {
          background-color: #f7bb9f;
          color: #ffffff;
        }
      }
    }
  }

  .sidepanel-top {
    display: flex;
    margin-bottom: 40px;
    cursor: pointer;
    padding: 5px 10px;
    margin-top: -5px;
    box-sizing: border-box;
    border-radius: 5px;
    user-select: none;

    &:hover {
      background-color: #fca67c73;
    }

    img {
      width: 40px;
    }

    > div {
      margin-left: 10px;

      font-size: 0.9em;
    }
  }

  .bookmarks-list-container,
  .notes-list-container {
    margin-bottom: 25px;

    ul {
      max-height: 200px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: auto;

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

      li {
        display: flex;
        align-items: center;
        font-weight: 700;
        cursor: pointer;

        img {
          margin-right: 10px;
        }

        &:not(:last-of-type) {
          margin-bottom: 5px;
        }
      }
    }
  }

  h4 {
    color: #d3cfcb;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-size: 0.95em;
  }

  .trash-item-container,
  .add-note-container {
    display: flex;
    align-items: flex-end;
    font-weight: 700;

    span {
      cursor: pointer;
    }

    img {
      margin-right: 10px;
      cursor: pointer;
    }
  }

  .toggle-sidepanel-button {
    margin-top: auto;
    width: 40px;
    height: 40px;
    background: transparent;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    &:focus {
      outline: none;
    }

    img {
      width: 30px;
    }
  }

  .add-note-container {
    margin-bottom: 30px;
    color: #e79166;
  }
}
</style>