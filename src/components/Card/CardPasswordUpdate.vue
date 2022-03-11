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
          :rules="[required]"
          label="新しいパスワード"
          :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showNew ? 'text' : 'password'"
          @click:append="showNew = !showNew"
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
        <v-btn class="mr-4" @click="cancel" :class="`text-${bkPoint.model}`"
          >キャンセル</v-btn
        >
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import http from "@/modules/http";
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
    },
  },
  methods: {
    //親コンポーネントへ送信
    async submit() {
      if (this.$refs.form.validate()) {
        const data = {
          data: {
            user: this.username,
            password: this.password_old,
            new_password: this.password_new,
          },
        };
        console.log(data);
        // this.$emit("clickSubmit", this.password_new);
        const res = await http.update("/system/user/check", data);
        if (res.status == 200) {
          console.log("更新しました");
        } else {
          console.log(res.data);
        }
      } else {
        alert("もう1度確認してください");
      }
    },
    clear() {
      this.password_new = "";
    },
    cancel() {
      this.$emit("clickCancel");
    },
  },
};
</script>
