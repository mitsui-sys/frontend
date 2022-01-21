<template>
  <v-text-field
    :value="password"
    label="パスワード"
    prepend-icon="mdi-lock"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    :type="show ? 'text' : 'password'"
    hint="最小8文字"
    counter
    @click:append="show = !show"
    @input="$emit('update:password', $event)"
  >
  </v-text-field>
</template>
<script>
export default {
  props: {
    password: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>
