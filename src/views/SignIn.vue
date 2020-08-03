<template>
  <div class="sign-in-component">
    <div class="form-container">
      <img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
      <h1>Welcome!</h1>
      <p>Sign in with your credentials below.</p>
      <form>
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model.trim="email"
          placeholder="Email"
          v-bind:style="{border: errors.email ? '1px solid #ff5959' : null}"
        />
        <p class="input-field-error">{{ errors.email }}</p>
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model.trim="password"
          placeholder="Password"
          v-bind:style="{border: errors.password ? '1px solid #ff5959' : null}"
        />
        <p class="input-field-error">{{ errors.password }}</p>
        <span class="forgot-password-span">
          <router-link to="/forgot-password">Forgot password?</router-link>
        </span>
        <button v-on:click.prevent="handleSignIn">Sign In</button>
      </form>
      <span>
        <router-link to="/sign-up">
          Don't have an account?
          <span>Create one here.</span>
        </router-link>
      </span>
    </div>
    <div class="background-image-container"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errors: {
        email: null,
        password: null
      }
    };
  },
  methods: {
    validateForm() {
      const form = this.email && this.password;
      if (form) return true;
      if (!this.email) this.errors.email = "This field is required.";
      if (!this.password) this.errors.password = "This field is required.";
      return false;
    },
    handleSignIn() {
      if (this.validateForm()) {
        this.$store.dispatch("signIn", {
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>
