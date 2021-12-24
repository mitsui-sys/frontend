<template>
  <v-app>
    <v-card width="400px" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">ログイン</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            prepend-icon="mdi-account-circle"
            label="ユーザ名"
            v-model="name"
          />
          <v-text-field
            v-bind:type="showPassword ? 'text' : 'password'"
            v-bind:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            prepend-icon="mdi-lock"
            label="パスワード"
            v-model="password"
          />
          <v-card-actions>
            <v-btn class="info" @click="submit">ログイン</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card width="800px" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">送信内容</h1>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="msg" />
        <v-card-actions>
          <v-btn class="info" @click="post">送信</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      showPassword: false,
      name: "",
      password: "",
    };
  },
  methods: {
    submit() {
      console.log(this.name, this.password);
    },
    send() {},
    // サーバーから返ってくる値をログに出力したいのでasyncとawaitを行う
    async post() {
      this.axios
        .get("/")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>
