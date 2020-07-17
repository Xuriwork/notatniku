<template>
  <div class="sidebar-component">
    <div class="sidebar-top">
      <img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
      <div>
        <h3>{{ name }}</h3>
        <span>{{ email }}</span>
      </div>
    </div>
    <div class="search-input-container">
      <img src="../assets/icons/search.svg" alt="Search icon" />
      <input type="text" v-model="searchInput" placeholder="Search" />
    </div>
    <BookmarksList v-bind:bookmarks="bookmarks" v-bind:handleViewChange="handleViewChange" />
    <NotesList
      v-bind:handleViewChange="handleViewChange"
      v-bind:notes="notes"
      v-bind:selectedNoteIndex="selectedNoteIndex"
    />
    <div class="trash-item-container" v-on:click="handleModal('trash')">
      <img src="../assets/icons/delete-bin-icon.svg" alt="Trashcan icon" />
      <span>Trash</span>
    </div>
    <div class="add-note-container" v-on:click="handleModal('add')">
      <img src="../assets/icons/add-icon.svg" alt="Add icon" />
      <span>Add Note</span>
    </div>
  </div>
</template>

<script>
import BookmarksList from "../components/BookmarksList";
import NotesList from "../components/NotesList";

export default {
  name: "Sidebar",
  components: {
    BookmarksList,
    NotesList
  },
  props: {
    notes: Array,
    bookmarks: Array,
    selectedNoteIndex: Number,
    handleViewChange: Function
  },
  data() {
    return {
      searchInput: "",
      name: "",
      email: ""
    };
  },
  methods: {
    handleModal: function(type) {
      this.$store.commit('setModalType', type);
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

  .sidebar-top {
    display: flex;
    margin-bottom: 40px;

    img {
      width: 40px;
    }

    > div {
      margin-left: 10px;

      font-size: 0.9em;
    }
  }

  .search-input-container {
    display: flex;
    position: relative;
    margin-bottom: 25px;

    img {
      width: 15px;
      position: absolute;
      left: 4px;
      top: 4px;
    }

    input {
      border-bottom: 1px solid #c8c5c1;
      width: 100%;
      padding: 5px 10px;
      text-indent: 20px;
      background-color: transparent;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #c8c5c1;
      }
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

  .trash-item-container {
    margin-bottom: 30px;
  }

  .add-note-container {
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