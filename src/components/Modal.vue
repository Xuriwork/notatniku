<template>
  <div v-on:click="closeModal" class="modal-overlay" id="modal-overlay">
    <div class="modal">
      <div class="modal-content" v-bind:class="'modal-content-' + modalType">
        <h2>{{ modalInfo.heading }}</h2>
        <form v-if="modalType === 'add'">
          <input type="text" v-model="noteName" placeholder="Note name" />
        </form>
        <ul v-if="modalType === 'trash'" class="trash-list" style="marginTop: 10px">
          <li>Your trash is empty</li>
        </ul>
        <ul v-if="modalType === 'more-items'" class="more-items-list">
          <li>Rename</li>
          <li style="color: '#ff5959'; fontWeight: 600">Delete Note</li>
          <li>Save as a PDF</li>
        </ul>
      </div>
      <div class="modal-bottom">
        <div>
          <button class="cancel-button" v-on:click="closeModal">Cancel</button>
          <button
            v-if="modalInfo.button"
            v-on="{click: modalInfo.button === 'Create Note' ? handleCreateNote : null}"
          >{{ modalInfo.button }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usersCollection } from "../utils/firebase";
import slugify from "slugify";
import uniqid from "uniqid";

export default {
  name: "Modal",
  props: {
    modalType: String
  },
  data() {
    return {
      noteName: ""
    };
  },
  methods: {
    closeModal: function(e) {
      const modalOverlay = document.getElementById("modal-overlay");
      const cancelButton = document.querySelector(".cancel-button");
      if (e.target === modalOverlay || e.target === cancelButton) {
        this.$store.commit("setModalType", null);
      }
    },
    handleCreateNote: function() {
      const noteName = this.noteName;
      const userId = this.$store.getters.userId;
      const slugifiedNoteName = slugify(noteName, { lower: true });
      const dateCreated = new Date();
      const noteId = `${slugifiedNoteName}-${uniqid()}`;

      usersCollection
        .doc(userId)
        .collection("notes")
        .doc(noteId)
        .set({
          title: noteName,
          noteId,
          dateCreated,
          content: ""
        })
        .then(() => this.$store.commit("setModalType", null))
        .catch(error => console.error(error));
    }
  },
  computed: {
    modalInfo: function() {
      let modalInfo = {};

      if (this.modalType === "add") {
        modalInfo = {
          heading: "Create New Note",
          button: "Create Note"
        };
      } else if (this.modalType === "trash") {
        modalInfo = {
          heading: "Trash"
        };
      } else if (this.modalType === "more-items") {
        modalInfo = {
          heading: "More"
        };
      }
      return modalInfo;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  @extend %flex-center-column;
  background-color: #00000025;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
}

.modal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  min-height: 170px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 5px;

  .modal-content {
    width: 100%;

    h2 {
      font-size: 1.4em;
    }
  }

  .more-items-list {
    margin-top: 15px;

    li {
      cursor: pointer;
    }

    li:not(:last-of-type) {
      margin-bottom: 6px;
    }
  }

  input[type="text"] {
    border: 0;
    outline: 0;
    padding: 10px;
    border-radius: 5px;
    display: block;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    font-family: "Merriweather", sans-serif;
    box-shadow: (0 1px 1px rgba(black, 0.1));
    resize: none;
    box-sizing: border-box;
    background-color: #c2c2c257;

    &:focus {
      box-shadow: (0 0px 2px rgba(#a7d3e4, 1));
    }
  }

  .modal-bottom {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;

    button:nth-child(2) {
      margin-left: 20px;
      color: #fff;
      background: linear-gradient(0.31deg, #f89b5e 0.7%, #f7b284 99.3%);
      box-shadow: 0 3px 6px rgba(107, 62, 19, 0.15);

      &:hover {
        background: linear-gradient(0.31deg, #f89b5e 20.7%, #f7b284 99.3%);
      }
    }

    .cancel-button {
      background: linear-gradient(0.31deg, #e2e2e2 0.7%, #ececec 99.3%);
    }

    button {
      padding: 8px 12px;
      border-radius: 4px;
    }
  }
}

.modal-more-items {
  width: 350px;
  padding: 30px 40px;
}
</style>