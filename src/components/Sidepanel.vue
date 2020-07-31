<template>
  <div
    class="sidepanel-component"
    v-bind:style="{
      width: sidepanelOpen ? '380px' : '60px', 
      padding: sidepanelOpen ? '35px 30px' : '35px 0',
      alignItems: sidepanelOpen ? 'initial' : 'center',
      zIndex: sidepanelOpen ? '2' : '1',
    }"
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
    <fragment>
      <div class="user-dropdown" v-show="sidepanelOpen && dropdownOpen">
        <div class="user-info-div">
          <div>{{ name.charAt(0) }}</div>
          <h5>{{ name }}</h5>
        </div>
        <hr />
        <ul>
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
            <button>Sign out ({{ email }})</button>
          </li>
        </ul>
      </div>
    </fragment>
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
    handleChangeView: Function,
    handleModal: Function,
    selectedNote: Object,
  },
  data() {
    return {
      dropdownOpen: false,
      sidepanelOpen: false,
      name: this.$store.getters.user.displayName,
      email: this.$store.getters.user.email,
    };
  },
  methods: {
    toggleDropdown: function () {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleSidepanel: function () {
      this.sidepanelOpen = !this.sidepanelOpen;
    },
  },
};
</script>

<style lang="scss">
.sidepanel-component {
  display: flex;
  flex-direction: column;
  background-color: #fdfbf7;
  color: #5c5a56;
  left: 0;
  height: 100%;
  max-width: 90%;
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
        top: 100px;
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

  ul {
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

  .bookmarks-list-container,
  .notes-list-container {
    margin-bottom: 25px;

    ul {
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 200px;
      padding-right: 2px;

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
      cursor: pointer;
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

  .accordion {
    user-select: none;

    .accordion-item {
      margin-bottom: 10px;
    }
  }

  .title {
    background-color: #e7a478;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    padding: 10px;
    border-radius: 4px;
    transition: all 0.2s ease-in;
    font-size: 0.8em;
    z-index: 2;
    cursor: pointer;

    span {
      display: flex;
      align-items: center;

      img {
        width: 16px;
        margin-right: 8px;
      }
    }
  }

  .title:not(.disabled):hover {
    background-color: #fcb280;
  }

  .title:active {
    background-color: #e7a478;
  }

  .title.disabled {
    background-color: #cea68d;
  }

  .content {
    min-height: 30px;
    border-radius: 4px;
    text-align: center;
    position: relative;
    margin-top: -45px;
    text-align: left;
    transition: all 200ms cubic-bezier(0.6, -0.28, 0.735, 0.045);
  }

  .content-open {
    margin-top: 0px;
    background-color: rgba(0, 0, 0, 0.1);
    transition: all 350ms cubic-bezier(0.08, 1.09, 0.32, 1.275);
  }

  .content-text {
    padding: 10px;
    visibility: hidden;
    opacity: 0;
    overflow: auto;
    transition: all 0.2s ease-in;
  }

  .content-text-open {
    visibility: visible;
    opacity: 1;
    transition: all 0.8s ease-in;
  }

  .angle-down {
    fill: rgba(255, 255, 255, 0.5);
    transition: all 0.6s cubic-bezier(0.08, 1.09, 0.32, 1.275);
  }

  .rotate-180 {
    fill: rgba(255, 255, 255, 1);
  }

  .arrow-wrapper {
    transition: all 0.6s cubic-bezier(0.08, 1.09, 0.32, 1.275);
    img {
      position: absolute;
      width: 12px;
      right: 10px;
      bottom: 12px;
    }
  }
}
</style>