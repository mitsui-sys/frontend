<template>
  <v-container>
    <v-card class="pb-5" width="400" color="blue-grey lighten-4">
      <v-toolbar class="headline my-5" color="blue-grey lighten-5" flat
        >次の項目を使用してログイン</v-toolbar
      >
      <v-card-text color="red">
        <v-form>
          <v-card>
            <!-- タイトル -->
            <v-card-title class="headline my-5">ログイン</v-card-title>
            <!-- 入力欄 -->
            <v-card-text>
              <UserField :user.sync="user" />
              <PasswordField :password.sync="password" />
            </v-card-text>

            <!-- アクションボタン -->
            <v-card-actions>
              <LoginButton
                :user="user"
                :password="password"
                :bkPoint="bkPoint"
              />
              <PasswordUpdateButton :bkPoint="bkPoint" v-if="true" />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import UserField from "@/components/TextField/UserField";
import PasswordField from "@/components/TextField/PasswordField";
import LoginButton from "@/components/Button/LoginButton";
import PasswordUpdateButton from "@/components/Button/PasswordUpdateButton";
export default {
  props: ["bkPoint"],
  data() {
    return {
      user: "",
      password: "",
    };
  },
  components: { UserField, PasswordField, LoginButton, PasswordUpdateButton },
};
</script>
