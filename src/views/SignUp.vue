<template>
  <div class="sign-up-component">
    <div class="form-container">
      <img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
      <h1>Welcome!</h1>
      <p>Sign up below.</p>
      <form>
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          v-model.trim="name"
          placeholder="Name"
          v-bind:style="{ border: errors.name ? '1px solid #ff5959' : null }"
        />
        <p class="input-field-error">{{ errors.name }}</p>
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model.trim="email"
          placeholder="Email"
          v-bind:style="{ border: errors.email ? '1px solid #ff5959' : null }"
        />
        <p class="input-field-error">{{ errors.email }}</p>
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model.trim="password"
          placeholder="Password"
          v-bind:style="{ border: errors.password ? '1px solid #ff5959' : null }"
        />
        <p class="input-field-error">{{ errors.password }}</p>
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model.trim="confirmPassword"
          placeholder="Confirm Password"
          v-bind:style="{
							border: errors.confirmPassword ? '1px solid #ff5959' : null,
						}"
        />
        <p class="input-field-error">{{ errors.confirmPassword }}</p>
        <button v-on:click.prevent="handleSignUp">Sign Up</button>
      </form>
      <span>
        <router-link to="/sign-in">
          Already have an account?
          <span>Sign In.</span>
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
      confirmPassword: "",
      name: "",
      errors: {
        emailError: null,
        password: null,
        confirmPassword: null,
        name: null
      }
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      const form = this.email && this.password && this.confirmPassword && this.name;
      if (form) return true;

      if (!this.email) this.errors.email = "This field is required.";
      if (!this.password) this.errors.password = "This field is required.";
      if (!this.confirmPassword) this.errors.confirmPassword = "This field is required.";
      if (!this.name) this.errors.name = "This field is required.";

      if (this.email && !this.validateEmail(this.email)) this.errors.email = "This email address is not valid";

      return false;
    },
    handleSignUp() {
      if (this.validateForm()) {
        this.$store.dispatch("signUp", {
          email: this.email,
          password: this.password,
          name: this.name
        });
      }
    },
    validateEmail(email) {
      const regEx = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
      return regEx.test(email);
    }
  }
};
</script>