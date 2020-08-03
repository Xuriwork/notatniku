<template>
  <div class="forgot-password-component">
    <div class="success-container" v-if="success">
      <div class="success-div">
        <img src="../assets/icons/checkbox-circle-fill.svg" alt="Checkbox" />
        <p>An email has been sent to {{ email }} with further instructions.</p>
      </div>
      <router-link to="/sign-in">Click here to return to Sign In</router-link>
    </div>
    <div class="form-container" v-if="!success">
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
      error: null,
      success: false
    };
  },
  methods: {
    handleForgotPassword() {
      if (!this.email) return (this.error = "Enter your email.");
      this.$store
        .dispatch("handleForgotPassword", this.email)
        .then(() => this.success = true)
        .catch(error => (this.error = error.message));
    }
  }
};
</script>

<style lang="scss" scoped>

.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  margin: auto;

  a {
    margin-top: 20px;
  }
}

.success-div {
  @extend %flex-center-row;
  background-color: #a3f5c5;
  min-height: 120px;
  padding: 15px 20px;
  box-sizing: border-box;

  img {
    width: 40px;
    margin-right: 10px;
  }

  p {
    font-size: 1.2em;
  }
}
</style>

