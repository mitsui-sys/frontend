<template>
  <v-card width="400px" class="mx-auto mt-5">
    <v-card-title>
      <h1 class="display-1">新規登録</h1>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          prepend-icon="mdi-account-circle"
          label="ユーザ名"
          v-model="regData.username"
        />
        <v-text-field
          prepend-icon="mdi-account-multiple"
          label="グループ名"
          v-model="regData.groupname"
        />

        <v-text-field
          prepend-icon="mdi-lock"
          label="パスワード"
          v-model="regData.password"
        />
        <v-card-actions>
          <v-btn class="info" @click="confirm">新規登録</v-btn>
        </v-card-actions>
        <p class="text-center">
          ログインは
          <router-link to="/login">こちら</router-link>
        </p>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SignUp",
  data: () => ({
    showPassword: false,
    name: "",
    password: "",
    loading: false,
    regData: { username: "", password: "", groupname: "" },
  }),
  methods: {
    //現在時刻取得（yyyymmddhhmmss）
    getCurrentTime() {
      //先頭ゼロ付加
      function padZero(num) {
        return (num < 10 ? "0" : "") + num;
      }
      var now = new Date();
      var res =
        now.getFullYear() +
        "/" +
        padZero(now.getMonth() + 1) +
        "/" +
        padZero(now.getDate());
      // padZero(now.getHours()) +
      // padZero(now.getMinutes()) +
      // padZero(now.getSeconds());
      return res;
    },
    confirm() {
      // let url = `${this.backend_url}/db/${this.selectedName}`;
      const url = "http://harima-isk:50001/system/user/register";
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let rows = {
        user_name: this.regData.username,
        password: this.regData.password,
        group_name: this.regData.groupname,
        level: 0,
        created_day: this.getCurrentTime(),
      };
      const cond = { data: rows };
      console.log(url, cond, option);
      this.axios
        .post(url, cond, option)
        .then((res) => {
          if (res.status)
            alert(`ユーザー名:${this.regData.username}を登録しました`);
          console.log(res);
        })
        .catch((error) => {
          alert("ユーザーを登録できませんでした");
          console.log(error);
        });

      // alert("登録されたアドレスにメールを送信しました！確認してください");
      //this.axios.post(url,data,option).then((res)=>{console.log(res)}).catch((error)=> console.log(error))
      //this.$router.push("/login");
    },
    mounted() {},
  },
};
</script>
