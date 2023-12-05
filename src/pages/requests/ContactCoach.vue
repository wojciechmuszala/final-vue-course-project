<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{ invalid: !email.isValid }">
      <label for="email">Your E-Mail</label>
      <input
        id="email"
        type="email"
        v-model.trim="email.val"
        @blur="clearValidity('email')" />
      <p v-if="!email.isValid">Please check your e-mail.</p>
    </div>
    <div class="form-control" :class="{ invalid: !message.isValid }">
      <label for="message">Message</label>
      <textarea
        id="message"
        rows="5"
        v-model.trim="message.val"
        @blur="clearValidity('message')"></textarea>
      <p v-if="!message.isValid">Message can't be empty.</p>
    </div>
    <div class="actions">
      <button>Send Message</button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: {
        val: "",
        isValid: true,
      },
      message: {
        val: "",
        isValid: true,
      },
      formIsValid: true,
    };
  },
  methods: {
    clearValidity(input) {
      this[input].isValid = true;
    },
    validateForm() {
      this.formIsValid = true;

      if (this.email.val === "" || !this.email.val.includes("@")) {
        this.email.isValid = false;
        this.formIsValid = false;
      }
      if (this.message.val === "") {
        this.message.isValid = false;
        this.formIsValid = false;
      }
    },
    submitForm() {
      this.validateForm();

      if (!this.formIsValid) {
        return;
      }

      const newRequest = {
        coachId: this.$route.params.id,
        userEmail: this.email.val,
        message: this.message.val,
      };

      this.$store.dispatch("requests/contactCoach", newRequest);
      this.$router.replace("/coaches");
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.error {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}

.invalid label,
.invalid h3 {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>
