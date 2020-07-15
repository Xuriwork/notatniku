<template>
		<div class='sign-up-component'>
			<div class='form-container'>
				<img src="../assets/icons/notatniku-logo.svg" alt="logo" class="logo" />
				<h1>Welcome!</h1>
				<p>Sign up below.</p>
				<form>
					<input
						type='text'
						v-model='name'
						placeholder='Name'
						v-bind:style="{ border: errors.name ? '1px solid #ff5959' : null }"
					/>
					<p class='input-field-error'>
						{{errors.name && errors.name.message}}
					</p>
					<input
						type='email'
						v-model='email'
						placeholder='Email'
						v-bind:style="{ border: errors.email ? '1px solid #ff5959' : null }"
					/>
					<p class='input-field-error'>
						{{errors.email && errors.email.message}}
					</p>
					<input
						type='password'
						v-model='password'
						placeholder='Password'
            v-bind:style="{ border: errors.password ? '1px solid #ff5959' : null }" />
					<p class='input-field-error'>
						{{errors.password && errors.password.message}}
					</p>
					<input
						type='password'
						v-model='confirmPassword'
						placeholder='Confirm Password'
						v-bind:style="{
							border: errors.confirmPassword ? '1px solid #ff5959' : null,
						}"
					/>
					<p class='input-field-error'>
						{{errors.confirmPassword && errors.confirmPassword.message}}
					</p>
					<button onClick={handleSubmit(handleSignUp)}>Sign Up</button>
				</form>
				<span>
					<router-link to='/sign-in'>Already have an account? Sign In.</router-link>
				</span>
			</div>
			<div class='background-image-container'></div>
		</div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      errors: []
    }
  }
}
</script>