<template>
  <v-card width="400px" class="mx-auto mt-5">
    <v-card-title>
      <h1 class="display-1">ログイン</h1>
    </v-card-title>
    <v-card-text>
      <v-text-field
        prepend-icon="mdi-account-circle"
        label="ユーザ名"
        v-model="name"
      />
      <v-text-field
        v-bind:type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
        prepend-icon="mdi-lock"
        v-bind:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        label="パスワード"
        v-model="password"
      />
      <v-card-actions>
        <v-btn class="info" @click="confirm">ログイン</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
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
    user() {
      let user =
        this.$route.params.user != undefined
          ? this.$route.params.user
          : "名無し";
      return user;
    },
    passwd() {
      let password =
        this.$route.params.password != undefined
          ? this.$route.params.password
          : "名無し";
      return password;
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
    mounted() {
      console.log("sample");
      //クエリパラメータがあれば
      const query = this.$route.query;
      if (Object.keys(query).length > 0) {
        console.log("query", query);
      }
    },
  },
};
</script>
