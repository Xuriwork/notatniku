<template>
  <div class="sign-in-component">
    <div class="form-container">
      <img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
      <h1>Welcome!</h1>
      <p>Sign in with your credentials below.</p>
      <form>
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          v-bind:style="{border: errors.email ? '1px solid #ff5959' : null}"
        />
        <p class="input-field-error">{{ errors.email && errors.email.message }}</p>
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          v-bind:style="{border: errors.password ? '1px solid #ff5959' : null}"
        />
        <p class="input-field-error">{{ errors.password && errors.password.message }}</p>
        <span class="forgot-password-span">
          <router-link to="/forgot-password">Forgot password?</router-link>
        </span>
        <button onclick="handleSignIn">Sign In</button>
      </form>
      <span>
        <router-link to="/sign-up">Don't have an account? Create one here.</router-link>
      </span>
    </div>
    <div class="background-image-container"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errors: []
    }
  }
}
</script>
