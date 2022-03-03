<template>
  <v-text-field
    id="username"
    :value="user"
    label="ユーザー"
    prepend-icon="mdi-account-circle"
    :class="`text-${bkPoint.model}`"
    @input="$emit('update:user', $event)"
    :rules="[required]"
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
  data() {
    return {
      required: (value) => !!value || "必ず入力してください", // 入力必須の制約
      limit_length: (value) =>
        value.length <= 10 || "10文字以内で入力してください", // 文字数の制約
    };
  },
};
</script>
