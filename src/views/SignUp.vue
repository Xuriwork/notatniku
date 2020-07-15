<template>
  <div class="sign-up-component">
    <div class="form-container">
      <img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
      <h1>Welcome!</h1>
      <p>Sign up below.</p>
      <form>
        <input
          type="text"
          v-model.trim="name"
          placeholder="Name"
          v-bind:style="{ border: errors.name ? '1px solid #ff5959' : null }"
        />
        <p class="input-field-error">{{ errors.name }}</p>
        <input
          type="email"
          v-model.trim="email"
          placeholder="Email"
          v-bind:style="{ border: errors.email ? '1px solid #ff5959' : null }"
        />
        <p class="input-field-error">{{ errors.email }}</p>
        <input
          type="password"
          v-model.trim="password"
          placeholder="Password"
          v-bind:style="{ border: errors.password ? '1px solid #ff5959' : null }"
        />
        <p class="input-field-error">{{ errors.password }}</p>
        <input
          type="password"
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
      errors: []
    };
  },
  methods: {
    handleSignUp: function() {
      this.$store.dispatch("signUp", {
        email: this.email,
        password: this.password,
        name: this.name
      });
    }
  }
};
</script>