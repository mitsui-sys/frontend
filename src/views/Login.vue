<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" align="center">
        <v-card
          :width="bkPoint.cardWidth"
          :min-width="bkPoint.cardMinWidth"
          :min-height="bkPoint.cardMinHeight"
          justify="center"
        >
          <v-card-title :class="`text-${bkPoint.titleModel}`"
            >{{ title }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="name"
                  prepend-icon="mdi-account-circle"
                  label="ユーザ名"
                  id="username"
                  name="username"
                  :class="`text-${bkPoint.model}`"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
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
              </v-col>
            </v-row>
          </v-card-text>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import Moment from "moment";
export default {
  data: () => ({
    title: "ログイン",
    showPassword: false,
    name: "",
    password: "",
    loading: false,
    snackbar: false,
    snackbarText: "",
  }),
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
        cardHeight: 800,
        cardWidth: 800,
        cardMinHeight: 300,
        cardMinWidth: 400,
        btnWidth: 350,
        btnHeight: 50,
        titleModel: "h3",
        model: "h5",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
          point.cardHeight = 800;
          point.cardWidth = 800;
          point.btnWidth = 350;
          point.btnHeight = 50;
          point.titleModel = "h4";
          point.model = "h6";
          break;
        case "sm":
        case "xs":
          point.cardHeight = 800;
          point.cardWidth = 800;
          // point.cardMinHeight = 400;
          // point.cardMinWidth = 400;
          point.btnWidth = 350;
          point.btnHeight = 50;
          point.titleModel = "h5";
          point.model = "subtitle1";
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
            console.log(this.loginElapsed);
            // const path =
            //   "backuri" in this.$route.query &&
            //   this.$route.query.backuri.match(/^\//)
            //     ? this.$route.query.backuri
            //     : "/";
            // const dataFrom = Moment(data[0].created_day);
            // const today = Moment();
            // const elapsedDate = today.diff(dataFrom, "days");
            // console.log("経過日数", elapsedDate);
            // console.log(
            //   dataFrom.format("YYYY/MM/DD HH:mm:ss dddd"),
            //   today.format("YYYY/MM/DD HH:mm:ss dddd")
            // );

            // if (elapsedDate > 90) alert("パスワードを更新してください");
            // else if (elapsedDate > 80)
            //   alert(`パスワードの更新期限まであと${90 - elapsedDate}日です`);
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
