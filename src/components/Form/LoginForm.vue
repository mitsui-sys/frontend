<template>
  <v-container fill-height>
    <v-form>
      <v-card width="400px">
        <!-- タイトル -->
        <v-card-title class="headline">ログイン</v-card-title>

        <!-- 入力欄 -->
        <v-card-text>
          <UserField :user.sync="user" />
          <PasswordField :password.sync="password" />
        </v-card-text>

        <!-- アクションボタン -->
        <v-card-actions>
          <v-btn @click="submit">ログイン</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import UserField from "@/components/TextField/UserField.vue";
import PasswordField from "@/components/TextField/PasswordField.vue";
export default {
  data() {
    return {
      user: "",
      password: "",
    };
  },
  components: { UserField, PasswordField },
  methods: {
    submit() {
      console.log(this.email + "," + this.password);
    },
  },
};
</script>
