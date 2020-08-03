<template>
  <nav class="only-mobile mobile-nav">
    <div class="nav-item">
      <img src="../assets/icons/arrow-right-circle.svg" alt />
      <span>Sidebar</span>
    </div>
    <div class="nav-item" v-on:click="handleModal('create-note')">
      <img src="../assets/icons/add-icon.svg" alt />
      <span>Add Note</span>
    </div>
    <div class="nav-item">
      <img src="../assets/icons/settings-icon.svg" alt />
      <span>Settings</span>
    </div>
  </nav>
</template>

<script>
export default {
  name: "MobileNav",
  props: {
    handleModal: Function
  }
};
</script>

<style lang="scss" scoped>
.mobile-nav {
  bottom: 0;
  width: 100%;
  height: 60px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  display: flex;
  overflow-x: auto;
  position: fixed;
  z-index: 2;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  min-width: 50px;
  overflow: hidden;
  white-space: nowrap;
  font-family: sans-serif;
  font-size: 13px;
  color: #444444;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.1s ease-in-out;
  cursor: pointer;

  > span {
    margin-top: 5px;
  }

  &:hover {
    background-color: #eeeeee;
  }
}
</style>