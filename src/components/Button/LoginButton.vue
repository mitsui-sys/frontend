<template>
  <v-btn
    class="info"
    @click="confirm"
    id="loginbtn"
    :class="`text-${bkPoint.model}`"
    >ログイン</v-btn
  >
</template>
<script>
export default {
  props: {
    user: {
      type: String,
      default: "",
      required: true,
    },
    password: {
      type: String,
      default: "",
      required: true,
    },
    bkPoint: {
      default: "",
    },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    loginElapsed() {
      return this.$store.getters[`auth/elapsed`];
    },
  },
  methods: {
    confirm() {
      const user = this.user;
      const password = this.password;
      const url = `${this.url}/system/user/login?user_name=${user}&password=${password}`;
      let body = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(url);
      this.axios
        .get(url, body, option)
        .then((res) => {
          console.log(res);
          const rows = res.data.rows;
          if (rows.length > 0) {
            console.log("ログイン情報は存在します");
            // ログイン情報を store に保存

            this.$store.dispatch("auth/create", rows);
            console.log(this.loginElapsed);
            this.$router.push("/");
          } else {
            alert("ユーザまたはパスワードが間違っています");
          }
        })
        .catch((error) => {
          console.log(error);
          alert(
            "処理が正しく行えませんでした。時間をおいてやり直してください。"
          );
        });
    },
  },
};
</script>
