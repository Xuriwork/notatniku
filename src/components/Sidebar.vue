<template>
  <div class="sidebar-component">
    <div class="sidebar-top" v-on:click="toggleDropdown">
      <img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
      <div>
        <h3>{{ name }}</h3>
        <span>{{ email }}</span>
      </div>
    </div>
    <div class="user-dropdown" v-show="dropdownOpen">
      <div class="user-info-div">
        <div>{{ name.charAt(0) }}</div>
        <h5>{{ name }}</h5>
      </div>
      <hr />
      <button>Sign out ({{ email }})</button>
    </div>
    <Search v-bind:handleChangeView="handleChangeView" />
    <BookmarksList v-bind:bookmarks="bookmarks" v-bind:handleChangeView="handleChangeView" />
    <NotesList
      v-bind:handleChangeView="handleChangeView"
      v-bind:notes="notes"
      v-bind:selectedNoteIndex="selectedNote.index"
    />
    <div class="add-note-container" v-on:click="handleModal('add')">
      <img src="../assets/icons/add-icon.svg" alt="Add icon" />
      <span>Add Note</span>
    </div>
    <div class="trash-item-container" v-on:click="handleModal('trash')">
      <img src="../assets/icons/delete-bin-icon.svg" alt="Trashcan icon" />
      <span>Trash</span>
    </div>
  </div>
</template>

<script>
import BookmarksList from "./BookmarksList";
import NotesList from "./NotesList";
import Search from './Search';

export default {
  name: "Sidebar",
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
    selectedNote: Object
  },
  data() {
    return {
      dropdownOpen: false,
      name: this.$store.getters.user.displayName,
      email: this.$store.getters.user.email
    };
  },
  methods: {
    toggleDropdown: function() {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }
};
</script>

<style lang="scss">
.sidebar-component {
  display: flex;
  flex-direction: column;
  background-color: #fdfbf7;
  color: #5c5a56;
  width: 380px;
  height: 100%;
  padding: 35px 30px;
  box-sizing: border-box;

  .user-dropdown {
    position: absolute;
    top: 100px;
    background-color: #fcedcf;
    border-radius: 5px;
    width: 240px;
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
        background-color: #fff6e3;
      }
    }

    hr {
      margin-bottom: 4px;
      border: none;
      border-bottom: 0.5px #dac8a4 solid;
    }
  }

  .sidebar-top {
    display: flex;
    margin-bottom: 40px;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    user-select: none;

    &:hover {
      background-color: #fdbc715e;
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
  .notes-list-container,
  .trash-list-container {
    margin-bottom: 25px;

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