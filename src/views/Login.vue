<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" align="center">
        <LoginForm :bkPoint="bkPoint" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import Moment from "moment";
import LoginForm from "@/components/Form/LoginForm";
export default {
  components: { LoginForm },
  data: () => ({
    title: "ログイン",
    showPassword: false,
    name: "",
    password: "",
    snackbar: false,
    snackbarText: "",
  }),
  computed: {
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        cardHeight: 600,
        cardWidth: 600,
        textWidth: 300,
        textHeight: 80,
        btnWidth: 350,
        btnHeight: 50,
        titleModel: "h2",
        model: "h4",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
          point.cardHeight = 600;
          point.cardWidth = 600;
          point.textWidth = 300;
          point.textHeight = 80;
          point.btnWidth = 200;
          point.btnHeight = 50;
          point.titleModel = "h2";
          point.model = "h4";
          break;
        case "sm":
        case "xs":
          point.cardHeight = 600;
          point.cardWidth = 600;
          point.textWidth = 300;
          point.textHeight = 80;
          point.btnWidth = 200;
          point.btnHeight = 50;
          point.titleModel = "h3";
          point.model = "h5";
          break;
        default:
          break;
      }
      return point;
    },
  },
};
</script>
