<template>
  <v-container>
    <v-form>
      <v-card>
        <!-- タイトル -->
        <v-card-title class="headline" :class="`text-${bkPoint.titleModel}`"
          >ログイン</v-card-title
        >
        <!-- 入力欄 -->
        <v-card-text>
          <UserField :user.sync="user" :bkPoint="bkPoint" />
          <PasswordField :password.sync="password" :bkPoint="bkPoint" />
        </v-card-text>

        <!-- アクションボタン -->
        <v-card-actions>
          <LoginButton :user="user" :password="password" :bkPoint="bkPoint" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import UserField from "@/components/TextField/UserField";
import PasswordField from "@/components/TextField/PasswordField";
import LoginButton from "@/components/Button/LoginButton";
export default {
  props: ["bkPoint"],
  data() {
    return {
      user: "",
      password: "",
    };
  },
  components: { UserField, PasswordField, LoginButton },
  methods: {
    submit() {
      console.log(this.email + "," + this.password);
    },
  },
};
</script>
