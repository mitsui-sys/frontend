<template>
  <v-text-field
    id="username"
    :value="userdate"
    label="日付"
    prepend-icon="mdi-account-circle"
    @input="$emit('update:user', $event)"
    @blur="formatToDateString"
    maxlength="8"
    type="date"
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
