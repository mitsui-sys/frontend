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
};
</script>
