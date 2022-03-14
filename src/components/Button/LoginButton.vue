<template>
  <v-btn class="info displaybutton" @click="confirm" id="loginbtn" block
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
      internal_user: "",
      internal_password: "",
    };
  },
  watch: {
    user(val) {
      this.internal_user = val;
    },
    password(val) {
      this.internal_password = val;
    },
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    loginElapsed() {
      return this.$store.getters[`auth/elapsed`];
    },
  },
  methods: {
    async confirm() {
      const url = `/system/user/login?user_name=${this.internal_user}&password=${this.internal_password}`;
      // const res = await http.get_test(url);
      const res = await http.get(url);
      if (res.status == 200) {
        const rows = res.data.rows;
        if (rows.length > 0) {
          console.log("ログイン情報は存在します");
          // ログイン情報を store に保存
          http.registerLog(this.internal_user, "台帳管理", "ログイン", "成功");
          this.$store.dispatch("auth/create", rows);
          console.log(this.loginElapsed);
          this.$router.push("/");
        } else {
          alert("ユーザまたはパスワードが間違っています");
          http.registerLog(this.internal_user, "台帳管理", "ログイン", "失敗");
        }
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        console.log(res);
        alert("処理が正しく行えませんでした。時間をおいてやり直してください。");
        http.registerLog(this.internal_user, "台帳管理", "ログイン", "失敗");
        // this.snackbarText = "データ取得 失敗";
        // this.snackbar = true;
      }
    },
  },
  mounted() {
    console.log(this.$route);
    console.log("ログイン処理");
    const query = this.$route.query || [];
    console.log("query", query);
    if (query.user && query.password) {
      console.log(query);
      this.internal_user = query.user;
      this.internal_password = query.password;
    }
    //ユーザ名とパスワードが空でなければログイン処理
    if (this.internal_user && this.internal_password) {
      this.confirm();
    }
  },
};
</script>
