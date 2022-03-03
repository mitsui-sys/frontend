<template>
  <v-card>
    <v-card-title :class="`text-${bkPoint.model}`">パスワード更新</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="username" label="ユーザー名" :rules="[required]">
        </v-text-field>
        <v-text-field
          v-model="password_old"
          label="現在のパスワード"
          :rules="[required]"
          :append-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showOld ? 'text' : 'password'"
          @click:append="showOld = !showOld"
        >
        </v-text-field>
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
          :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showNew ? 'text' : 'password'"
          @click:append="showNew = !showNew"
          required
        ></v-text-field>

        <v-text-field
          v-model="password_same"
          label="パスワード再入力"
          :rules="[required, same_data]"
          :append-icon="showSame ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showSame ? 'text' : 'password'"
          @click:append="showSame = !showSame"
          required
        ></v-text-field>

        <v-btn
          color="success"
          class="mr-4"
          @click="submit"
          :class="`text-${bkPoint.model}`"
        >
          更新
        </v-btn>
        <!--
        <v-btn color="error" class="mr-4" @click="clear">クリア</v-btn>
        -->
        <v-btn class="mr-4" @click="cancel" :class="`text-${bkPoint.model}`"
          >キャンセル</v-btn
        >
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
      username: "",
      showOld: false,
      showNew: false,
      showSame: false,
      valid: true,
      password_old: "",
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
  watch: {
    dialog() {
      //表示状態の切り替えで初期化
      this.username = "";
      this.password_old = "";
      this.password_new = "";
      this.password_same = "";
    },
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
      this.password_new = "";
      this.password_same = "";
    },
    cancel() {
      this.$emit("clickCancel");
    },
  },
};
</script>
