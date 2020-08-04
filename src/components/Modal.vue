<template>
  <div v-on:click="closeModal" class="modal-overlay" id="modal-overlay">
    <div class="modal" v-bind:class="'modal-' + modalType">
      <div class="modal-content" v-bind:class="'modal-content-' + modalType">
        <h2>{{ modalInfo.heading }}</h2>
        <form v-if="modalType === 'create-note'">
          <input type="text" v-model="noteName" placeholder="Note name" />
        </form>
        <div v-if="modalType === 'trash'" class="trash-list-container" style="marginTop: 10px">
          <span v-if="!trash.length">Your trash is empty</span>
          <ul v-else>
            <li v-for="note in trash" v-bind:key="note.id">
              <span>{{ note.title }}</span>
              <button v-bind:id="note.id" v-on:click="handleRemoveFromTrash">Remove</button>
              <button v-bind:id="note.id" v-on:click="handleDeleteNote">Delete</button>
            </li>
          </ul>
        </div>
        <ul v-if="modalType === 'more-items'" class="more-items-list">
          <li v-on:click="handleExportToPDF">📄 Export to PDF</li>
          <li v-on:click="changeModalToUploadImage" v-bind:disabled="loading">📷 Convert image to text</li>
          <li
            class="add-to-trash"
            v-bind:id="selectedNote.id"
            v-on:click="handleAddToTrash"
            v-bind:disabled="loading"
          >🗑️ Add to trash</li>
        </ul>
        <div v-if="modalType === 'uploadImage'">
          <form>
            <button v-on:click.prevent="handleChooseFile" class="choose-file-button">Choose file</button>
            <span class="image-name" v-if="image">{{ image.name }}</span>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              v-on:change="handleOnFileChanged"
              style="display: none"
            />
          </form>
          <div class="progress-bar-container">
            <span class="bar">
              <span ref="progressRef" class="progress"></span>
            </span>
          </div>
          <span
            v-if="extractedText"
            v-on:click="changeModalToViewExtractedText"
            class="extracted-text-ready-span"
          >Click to view text</span>
        </div>
        <div
          v-if="modalType === 'viewExtractedText'"
          v-on:click="handleCopyToClipboard"
        >{{ extractedText }}</div>
      </div>
      <div class="modal-bottom">
        <div>
          <button class="cancel-button" v-on:click="closeModal">Cancel</button>
          <button
            v-if="modalInfo.buttonText"
            v-on="{click: modalInfo.buttonAction}"
            v-bind:disabled="loading"
            class="action-button"
          >{{ modalInfo.buttonText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase, { db, usersCollection } from "../utils/firebase";
import uniqid from "uniqid";
import axios from "axios";
import { Notyf } from "notyf";
import jsPDF from 'jspdf';

const notyf = new Notyf({
  duration: 9000,
  position: {
    x: "right",
    y: "top",
  },
});

const doc = new jsPDF();

export default {
  name: "Modal",
  props: {
    modalType: String,
  },
  data() {
    return {
      noteName: "",
      image: null,
      error: null,
      loading: false,
      extractedText: null,
    };
  },
  methods: {
    closeModal(e) {
      const modalOverlay = document.getElementById("modal-overlay");
      const cancelButton = document.querySelector(".cancel-button");
      if (e.target === modalOverlay || e.target === cancelButton) {
        this.$store.commit("setModalType", null);
      }
    },
    handleCreateNote() {
      this.loading = true;

      const noteName = this.noteName;
      const userId = this.userId;
      const id = uniqid();
      const date = new Date();

      usersCollection
        .doc(userId)
        .collection("notes")
        .doc(id)
        .set({
          title: noteName,
          id,
          dateCreated: date,
          dateModified: date,
          content: "",
          isTrash: false,
        })
        .then(() => {
          this.$store.commit("setSelectedNoteIndex", 0);
          this.$store.commit("setModalType", null);
        })
        .catch((error) => console.error(error));
    },
    handleAddToTrash: async function (e) {
      this.loading = true;

      const userId = this.userId;
      const id = e.target.id;
      const batch = db.batch();
      const userRef = usersCollection.doc(userId);
      const noteRef = usersCollection.doc(userId).collection("notes").doc(id);

      if (this.isBookmarked) {
        await batch.update(userRef, {
          bookmarks: firebase.firestore.FieldValue.arrayRemove(id),
        });
      }

      batch.update(noteRef, { isTrash: true });

      batch
        .commit()
        .then(() => this.$store.commit("setModalType", null))
        .catch((error) => console.error(error));
    },
    handleRemoveFromTrash: async function (e) {
      const userId = this.userId;
      const id = e.target.id;

      usersCollection
        .doc(userId)
        .collection("notes")
        .doc(id)
        .update({ isTrash: false })
        .catch((error) => console.error(error));
    },
    handleDeleteNote: async function (e) {
      const userId = this.userId;
      const id = e.target.id;

      if (confirm("Are you sure you want to delete this note?")) {
        await usersCollection
          .doc(userId)
          .collection("notes")
          .doc(id)
          .delete()
          .catch((error) => console.error(error));
      }
    },
    handleExportToPDF() {
      doc.fromHTML(this.selectedNote.content, 35, 35);
      doc.save(this.selectedNote.title);
    },
    changeModalToUploadImage() {
      this.$store.commit("setModalType", "uploadImage");
    },
    changeModalToViewExtractedText() {
      this.$store.commit("setModalType", "viewExtractedText");
    },
    handleChooseFile() {
      this.$refs.fileInput.click();
    },
    handleOnFileChanged(e) {
      this.image = e.target.files[0];
    },
    handleUploadImage: async function () {
      const image = this.image;

      if (!image) return;

      this.loading = true;
      const token = await this.$store.getters.idToken;
      const userId = this.userId;
      const headers = { Authorization: `Bearer ${token}` };

      const storageRef = firebase.app().storage("gs://notatniku_ocr").ref();
      const uploadTask = storageRef.child(`${userId}/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + "%";
          this.$refs.progressRef.style.width = progress;
        },
        (error) => console.error(error),
        () => {
          const filePath = uploadTask.metadata_.fullPath;

          axios
            .post("/convert-image-to-text", { filePath }, { headers })
            .then((res) => {
              this.extractedText = res.data.text;
              this.loading = false;
              this.image = null;
            })
            .catch((error) => (this.error = error));
        }
      );
    },
    handleCopyToClipboard: async function () {
      const text = this.extractedText;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          notyf.success({ message: "Copied to clipboard" });
        })
        .catch((error) => console.error(error));
    },
  },
  computed: {
    modalInfo() {
      let modalInfo = {};

      if (this.modalType === "create-note") {
        modalInfo = {
          heading: "Create New Note",
          buttonText: "Create Note",
          buttonAction: this.handleCreateNote,
        };
      } else if (this.modalType === "trash") {
        modalInfo = {
          heading: "Trash",
        };
      } else if (this.modalType === "more-items") {
        modalInfo = {
          heading: "More",
        };
      } else if (this.modalType === "uploadImage") {
        modalInfo = {
          heading: "Upload an image",
          buttonText: "Upload",
          buttonAction: this.handleUploadImage,
        };
      } else if (this.modalType === "viewExtractedText") {
        modalInfo = {
          heading: "Extracted text",
          buttonText: "Copy text",
          buttonAction: this.handleCopyToClipboard,
        };
      }
      return modalInfo;
    },
    notes() {
      return this.$store.getters.notes;
    },
    selectedNote() {
      return this.$store.getters.selectedNote;
    },
    isBookmarked() {
      return this.$store.getters.isBookmarked;
    },
    trash() {
      return this.$store.getters.trash;
    },
    userId() {
      return this.$store.getters.userId;
    },
  },
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
  z-index: 4;
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
      margin-bottom: 12px;
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

    button {
      padding: 8px 12px;
      border-radius: 4px;
    }

    .action-button {
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
  }
}

.modal-trash {
  max-width: 550px;
  width: 100%;
  padding-left: 25px;

  .cancel-button {
    margin-right: 10px;
    background-color: #f89b5e;
  }
}

.modal-viewExtractedText {
  max-width: 550px;
  width: 100%;
}

.modal-content-uploadImage > div {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.modal-content-viewExtractedText > div {
  background-color: #e7e7e7;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  line-height: 1.8;
  max-height: 600px;
  overflow-y: auto;
}

.add-to-trash {
  color: #ff5959;
  border-radius: 4px;
  font-weight: 600;
}

.choose-file-button {
  padding: 10px 20px;
  margin-right: 10px;
  background: linear-gradient(0.31deg, #40514e 0.7%, #52615e 99.3%);
  color: #ffffff;
  box-shadow: 0 3px 6px rgba(107, 62, 19, 0.15);
  border-radius: 4px;
}

.image-name {
  color: #40514e;
}

.progress-bar-container {
  border-radius: 60px;
  overflow: hidden;
  width: 100%;
  margin: 10px 0;

  span {
    display: block;
  }
}

.bar {
  background: rgba(0, 0, 0, 0.075);
  height: 5px;
}

.progress {
  background: #83e85a;
  color: #fff;
  height: 100%;
  width: 0%;
  transition: width 2s ease-in-out;
}

.extracted-text-ready-span {
  color: #53bda9;
  text-decoration: underline;
  text-underline-position: under;
  cursor: pointer;
}

.trash-list-container {
  ul {
    overflow-y: auto;
    max-height: 400px;
    padding-right: 10px;

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
    overflow-y: hidden;
    display: flex;
    align-items: flex-start;

    &:not(:last-of-type) {
      margin-bottom: 10px;
    }

    span {
      cursor: pointer;
      font-weight: 500;
      max-width: 200px;

      &:hover {
        color: #f89b5e;
      }
    }

    button {
      border: 1px solid transparent;
    }

    button:first-of-type {
      border: 1px solid #40514e;
      color: #40514e;
      background: #fff;
      padding: 4px 15px;
      border-radius: 4px;
      margin-left: auto;
      margin-right: 10px;
      box-sizing: border-box;

      &:hover {
        color: #ffffff;
        background: #40514e;
      }
    }

    button:last-of-type {
      background-color: #ff5959;
      color: #ffffff;
      padding: 4px 15px;
      border-radius: 4px;

      &:hover {
        background: #ff4b4b;
      }
    }
  }
}
</style>