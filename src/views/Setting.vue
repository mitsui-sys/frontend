<template>
  <v-card>
    <v-tabs color="deep-purple accent-4" left>
      <v-tab>表示設定</v-tab>
      <v-tab>ユーザー設定</v-tab>
      <v-tab>ログ設定</v-tab>
      <v-tab-item>
        <Setting1 :bkPoint="bkPoint" />
      </v-tab-item>
      <v-tab-item>
        <Setting2 :bkPoint="bkPoint" />
      </v-tab-item>
      <v-tab-item>
        <Setting3 :bkPoint="bkPoint" />
      </v-tab-item>
    </v-tabs>
    <!----------------
    <v-btn @click="dialog = true">プレビュー表示</v-btn>
    <v-dialog v-model="dialog" max-width="700px">
      <PDF :path="filepath" />
    </v-dialog>
    -->
  </v-card>
</template>

<script>
import Setting1 from "@/components/TabItem/Setting1";
import Setting2 from "@/components/TabItem/Setting2";
import Setting3 from "@/components/TabItem/Setting3";
// import PDF from "@/components/PDF/PDF";
export default {
  name: "Setting",
  components: { Setting1, Setting2, Setting3 },
  data() {
    return {
      dialog: false,
      filepath: "resources/台帳システム進捗_第5回.pdf",
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    tableNameList() {
      return this.$store.getters[`table/tableNameList`];
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
};
</script>
