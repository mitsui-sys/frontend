<template>
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
          @keydown.enter.exact="confirm"
        />
        <v-text-field
          v-bind:type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          @keydown.enter.exact="confirm"
          prepend-icon="mdi-lock"
          v-bind:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="パスワード"
          v-model="password"
        />
        <v-card-actions>
          <v-btn class="info" @click="confirm">ログイン</v-btn>
        </v-card-actions>
        <p class="text-center">
          新規登録は
          <router-link to="/signup">こちら</router-link>
        </p>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    showPassword: false,
    name: "",
    password: "",
    loading: false,
  }),
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
  },
  methods: {
    initialize() {},
    confirm() {
      const name = this.name;
      const password = this.password;
      const url = `http://harima-isk:50001/system/user/login?username=${name}&password=${password}`;
      let body = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.loading = true;
      this.axios
        .get(url, body, option)
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            console.log("ログイン情報は存在します");
            // ログイン情報を store に保存
            this.$store.dispatch("auth/create", res.data);
            const path =
              "backuri" in this.$route.query &&
              this.$route.query.backuri.match(/^\//)
                ? this.$route.query.backuri
                : "/";
            this.$router.push(path);
          } else {
            alert("ユーザまたはパスワードが間違っています");
          }
        })
        .catch((error) => {
          console.log(error);
          alert(
            "処理が正しく行えませんでした。時間をおいてやり直してください。"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    },
    submit() {
      console.log();
      const url = "http://harima-isk:50001/system/user";
      let body = {
        data: { login_name: this.name, password: this.password },
      };
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.axios
        .get(url, body, option)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    mounted() {
      if (this.loginData.token) this.$router.push("/");
    },
  },
};
</script>
