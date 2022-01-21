<template>
  <v-main>
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="mx-auto">
            <v-toolbar :class="`text-${bkPoint.titleModel}`"
              >ログイン
            </v-toolbar>
            <v-card-text>
              <v-text-field
                v-model="name"
                prepend-icon="mdi-account-circle"
                label="ユーザ名"
                id="username"
                name="username"
                :class="`text-${bkPoint.model}`"
              />
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                label="パスワード"
                :class="`text-${bkPoint.model}`"
                id="password"
                name="password"
                hint="最小8文字"
                counter
              />
              <v-card-actions>
                <v-btn
                  class="info"
                  @click="confirm"
                  id="loginbtn"
                  name="loginbtn"
                  :class="`text-${bkPoint.model}`"
                  >ログイン</v-btn
                >
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Moment from "moment";
export default {
  data: () => ({
    showPassword: false,
    name: "",
    password: "",
    loading: false,
  }),
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
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
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        minHeight: 300,
        titleModel: "",
        model: "h6",
        btnWidth: 350,
        btnHeight: 50,
      };
      switch (bkPt.name) {
        case "xl":
          point.minWidth = 900;
          point.minHeight = 450;
          point.titleModel = "h3";
          point.model = "h5";
          break;
        case "lg":
          point.minWidth = 600;
          point.minHeight = 600;
          point.titleModel = "h4";
          point.model = "h5";
          break;
        case "md":
          point.minWidth = 600;
          point.minHeight = 600;
          point.titleModel = "h6";
          point.model = "subtitle-1";
          break;
        case "sm":
          point.minWidth = 600;
          point.minHeight = 600;
          point.titleModel = "subtitle-2";
          point.model = "body-1";
          break;
        case "xs":
          point.minWidth = 600;
          point.minHeight = 600;
          point.titleModel = "body-2";
          point.model = "button";
          break;
        default:
          break;
      }
      return point;
    },
  },
  methods: {
    initialize() {},
    confirm() {
      const name = this.name;
      const password = this.password;
      const url = `${this.url}/system/user/login?username=${name}&password=${password}`;
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
            const data = res.data;
            this.$store.dispatch("auth/create", data);
            // const path =
            //   "backuri" in this.$route.query &&
            //   this.$route.query.backuri.match(/^\//)
            //     ? this.$route.query.backuri
            //     : "/";
            const dataFrom = Moment(data[0].created_day);
            const today = Moment();
            const elapsedDate = today.diff(dataFrom, "days");
            console.log("経過日数", elapsedDate);
            console.log(
              dataFrom.format("YYYY/MM/DD HH:mm:ss dddd"),
              today.format("YYYY/MM/DD HH:mm:ss dddd")
            );

            if (elapsedDate > 90) alert("パスワードを更新してください");
            else if (elapsedDate > 80)
              alert(`パスワードの更新期限まであと${90 - elapsedDate}日です`);
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
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
