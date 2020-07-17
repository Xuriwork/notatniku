<template>
  <fragment>
    <Modal v-if="modalType" v-bind:modalType="modalType" />
    <router-view/>
  </fragment>
</template>

<script>
import Modal from './components/Modal';

export default {
  components: {
    Modal
  },
  computed: {
    modalType: function() {
      return this.$store.state.modalType;
    }
  }
}
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
  font-family: Quicksand;
}

* {
	margin: 0;
  padding: 0;
  list-style: none;
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

button,
input {
	border: none;
}

button {
	cursor: pointer;
}

h1,
h2,
h3,
h4,
p,
a {
	color: #5c5a56;
}

a {
  text-decoration: none;
}

.sign-in-component, .sign-up-component, .forgot-password-component {
  display: flex;
  background-color: #ece3db;
  height: 100%;

  .logo {
    width: 70px;
  }

  .form-container {
    @extend %flex-center-column;

    form ~ span {
      margin-top: 10px;
    }

    h1 {
      margin-top: 25px;
    }

    a span {
      color: #be9477;
      font-weight: 600;
    }

    .input-field-error {
      width: 100%;
      color: #ff5959;
    }
  }

  > div {
    flex: 1;
  }

  .background-image-container {
    background-image: url("./assets/images/black-butterfly-preaching-on-peach-flower-1895024.jpg");
    background-position: center;
    background-size: cover;
  }

  form {
    @extend %flex-center-column;
    width: 100%;
    max-width: 500px;
    padding: 0 10px;
    box-sizing: border-box;

    .forgot-password-span {
      text-align: right;
      width: 100%;
      margin-top: 5px;
    }

    button {
      width: 100%;
      background-color: #e7a478;
      color: #fff;
      padding: 12px 20px;
      border-radius: 5px;
      margin-top: 20px;

      &:hover {
        background-color: #e09563;
      }
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      border: 0;
      outline: 0;
      padding: 1em;
      border-radius: 8px;
      display: block;
      width: 100%;
      margin-top: 1em;
      font-family: "Merriweather", sans-serif;
      box-shadow: (0 1px 1px rgba(black, 0.1));
      resize: none;
      box-sizing: border-box;

      &:focus {
        box-shadow: (0 0px 2px rgba(#a7d3e4, 1));
      }
    }
  }
}

@media (max-width: 1100px) {
	.background-image-container {
		display: none;
	}
}

</style>
