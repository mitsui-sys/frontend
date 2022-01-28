<template>
  <v-text-field
    id="username"
    :value="user"
    label="ユーザー"
    prepend-icon="mdi-account-circle"
    :class="`text-${bkPoint.model}`"
    @input="$emit('update:user', $event)"
  >
  </v-text-field>
</template>
<script>
export default {
  props: {
    user: {
      type: String,
      default: "",
      required: true,
    },
    bkPoint: {},
  },
};
</script>
