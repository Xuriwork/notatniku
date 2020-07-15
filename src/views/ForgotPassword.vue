<template>
  <div class="forgot-password-component">
    <div class="form-container">
      <img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
      <h1>Forgot your password?</h1>
      <p>Enter in your email address.</p>
      <form>
        <input
          type="email"
          v-model.trim="email"
          placeholder="Email"
          v-bind:style="{ border: error ? '1px solid #ff5959' : null }"
        />
        <p class="input-field-error" style="marginTop: 5px">{{ error }}</p>
        <span class="forgot-password-span">
          <router-link to="/sign-in">Back to Sign In</router-link>
        </span>
        <button v-on:click.prevent="handleForgotPassword">Send Password Reset Email</button>
      </form>
    </div>
    <div class="background-image-container"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      error: null
    };
  },
  methods: {
    handleForgotPassword: function() {
      if (!this.email) return (this.error = "Enter your email.");
      this.$store
        .dispatch("handleForgotPassword", this.email)
        .catch(error => (this.error = error.message));
    }
  }
};
</script>

