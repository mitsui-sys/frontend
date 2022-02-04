<template>
  <v-btn
    class="info"
    @click="confirm"
    id="loginbtn"
    :class="`text-${bkPoint.model}`"
    :width="bkPoint.btnWidth"
    :height="bkPoint.btnHeight"
    >ログイン</v-btn
  >
</template>
<script>
import http from "@/modules/http";
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
    async confirm() {
      const user = this.user;
      const password = this.password;
      const url = `${this.url}/system/user/login?user_name=${user}&password=${password}`;
      const res = await http.get(url);
      if (res.status == 200) {
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
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        console.log(res);
        alert("処理が正しく行えませんでした。時間をおいてやり直してください。");
        // this.snackbarText = "データ取得 失敗";
        // this.snackbar = true;
      }
    },
  },
};
</script>
