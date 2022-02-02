<template>
  <v-card>
    <v-card-title>パスワード更新</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="password_new"
          :rules="[
            required,
            limit_length,
            has_number,
            has_alphabet_small,
            has_alphabet_big,
            has_not_alphabet,
          ]"
          label="新しいパスワード"
          required
        ></v-text-field>

        <v-text-field
          v-model="password_same"
          label="パスワード再入力"
          :rules="[required, same_data]"
          required
        ></v-text-field>

        <v-btn color="success" class="mr-4" @click="submit"> 更新 </v-btn>
        <v-btn color="error" class="mr-4" @click="clear">クリア</v-btn>
        <v-btn class="mr-4" @click="cancel">キャンセル</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DialogCard",
  props: ["dialogType", "content", "loginType", "dialog", "bkPoint"],
  data() {
    return {
      valid: true,
      password_new: "",
      password_same: "",
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
      same_data: (v) => v === this.password_new || "同じ文字列ではありません",
    };
  },
  computed: {},
  methods: {
    //親コンポーネントへ送信
    submit() {
      if (this.$refs.form.validate()) {
        console.log(this.password_new);
        this.$emit("clickSubmit", this.password_new);
      } else {
        alert("もう1度確認してください");
      }
    },
    clear() {
      this.$refs.form.resetValidation();
    },
    cancel() {
      this.$emit("clickCancel");
    },
  },
};
</script>
