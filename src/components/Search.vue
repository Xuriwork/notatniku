<template>
  <div class="search-component">
    <div class="search-input-container">
      <img src="../assets/icons/search.svg" alt="Search icon" />
      <input type="text" v-model="searchText" placeholder="Search" />
    </div>
    <div v-if="searchText" class="search-results-container">
      <span v-if="!queryResults.length">No results</span>
      <ul>
        <li
          v-for="result of queryResults"
          v-bind:key="result.id"
          v-bind:id="result.id"
          v-on:click="handleSelectResult"
        >{{ result.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import fz from "fuzzaldrin-plus";

export default {
  props: {
    handleChangeView: Function
  },
  data() {
    return {
      searchText: ""
    };
  },
  methods: {
    handleSelectResult: function(e) {
      this.handleChangeView(e);
      this.searchText = '';
    }
  },
  computed: {
    options() {
      return this.$store.getters.notes;
    },
    queryResults() {
      if (!this.searchText) return this.options;

      const preparedQuery = fz.prepareQuery(this.searchText);
      const scores = {};

      return this.options
        .map(option => {
          const scorableFields = [option.title].map(toScore =>
            fz.score(toScore, this.searchText, { preparedQuery })
          );

          scores[option.id] = Math.max(...scorableFields);

          return option;
        })
        .filter(option => scores[option.id] > 1)
        .sort((a, b) => scores[b.id] - scores[a.id]);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-component {
  position: relative;
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

.search-results-container {
  position: absolute;
  top: 40px;
  width: 100%;
  background-color: #ffffff;
  padding: 10px 20px;
  box-sizing: border-box;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.03);

  ul {
    overflow-y: auto;
    max-height: 400px;

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

  li:hover {
    color: #f89b5e;
  }
}
</style>