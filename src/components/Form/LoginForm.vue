<template>
  <v-container>
    <v-card class="pb-5" :width="bkPoint.cardWidth" color="blue-grey lighten-4">
      <v-toolbar
        class="headline"
        :class="`text-${bkPoint.model} my-5`"
        color="blue-grey lighten-5"
        flat
        >次の項目を使用してログイン</v-toolbar
      >
      <v-card-text color="red">
        <v-form>
          <v-card :width="bkPoint.cardWidth">
            <!-- タイトル -->
            <v-card-title class="headline" :class="`text-${bkPoint.model} my-5`"
              >ログイン</v-card-title
            >
            <!-- 入力欄 -->
            <v-card-text>
              <UserField :user.sync="user" :bkPoint="bkPoint" />
              <PasswordField :password.sync="password" :bkPoint="bkPoint" />
            </v-card-text>

            <!-- アクションボタン -->
            <v-card-actions class="my-5">
              <LoginButton
                :user="user"
                :password="password"
                :bkPoint="bkPoint"
              />
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
