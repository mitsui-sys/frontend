<template>
  <v-text-field
    id="password"
    :value="password"
    label="パスワード"
    prepend-icon="mdi-lock"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    :type="show ? 'text' : 'password'"
    hint="8文字以上で入力してください"
    @click:append="show = !show"
    @input="$emit('update:password', $event)"
    :rules="[
      required,
      limit_length,
      has_number,
      has_alphabet_small,
      has_alphabet_big,
      has_not_alphabet,
    ]"
    autocomplete="on"
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
    bkPoint: {},
  },
  data() {
    return {
      show: false,
      required: (value) => !!value || "必ず入力してください", // 入力必須の制約
      limit_length: (value) =>
        value.length >= 8 || "8文字以上で入力してください", // 文字数の制約
      has_number: (v) => /\d/.test(v) || "数字が含まれていません", // 数字があるか
      has_alphabet_small: (value) =>
        /[a-z]/.test(value) || "小文字のアルファベットが含まれていません", // 小文字のアルファベットがあるか
      has_alphabet_big: (v) =>
        /[A-Z]/.test(v) || "大文字のアルファベットが含まれていません", // 大文字のアルファベットがあるか
      has_not_alphabet: (v) =>
        /[^a-zA-Z0-9]/.test(v) ||
        "数字・アルファベット以外の文字が含まれていません", // 数字・アルファベット以外の文字
    };
  },
};
</script>
