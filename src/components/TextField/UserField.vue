<template>
  <v-text-field
    :value="user"
    label="ユーザー"
    prepend-icon="mdi-mail"
    @input="$emit('update:user', $event)"
  >
  </v-text-field>
</template>
<script>
export default {
  props: {
    email: {
      type: String,
      default: "",
      required: true,
    },
  },
};
</script>
