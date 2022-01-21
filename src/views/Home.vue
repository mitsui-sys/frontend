<template>
  <v-card class="mx-auto" :min-height="bkPoint.minHeight">
    <v-container fluid fill-height>
      <v-row class="blue lighten-4">
        <v-col cols="12" align="center">
          <v-text :class="`text-${bkPoint.titleModel}`">
            {{ title }}
          </v-text>
          <!--
          <v-text :class="`text-${bkPoint.titleModel}`">
            {{ bkPoint.name }}
          </v-text>
          -->
          <v-divider></v-divider>
          <v-container>
            <v-row v-for="(item, index) in items" :key="index">
              <v-col>
                <v-btn
                  :color="item.color"
                  @click="setKind(item)"
                  :width="bkPoint.btnWidth"
                  :height="bkPoint.btnHeight"
                  :class="`text-${bkPoint.model}`"
                  >{{ item.text }}</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      title: "ホーム画面",
      label: { link: "利用規約", text: "に同意して利用する" },
      items: [
        { text: "台帳システム", link: "/sheet", color: "gray" },
        // { text: "照会・回答調査台帳", link: "/sheet", color: "gray" },
        // { text: "発掘調査台帳", link: "/sheet", color: "gray" },
        // { text: "指定文化財台帳", link: "/sheet", color: "gray" },
        {
          text: "埋蔵文化財発掘届出・通知書",
          link: "/document",
          color: "gray",
        },
        // { text: "ファイル登録", link: "/fileregister", color: "gray" },

        // { text: "台帳管理", link: "/sheet"},
        // { text: "帳票出力", link: "/chohyo"},
        { text: "操作方法", link: "/manual" },
        // { text: "問い合わせ", link: "/help" },
      ],
    };
  },
  computed: {
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        minHeight: 200,
        titleModel: "",
        model: "h6",
        btnWidth: 350,
        btnHeight: 50,
      };
      switch (bkPt.name) {
        case "xl":
          point.minHeight = 200;
          point.titleModel = "h2";
          point.model = "h3";
          point.btnWidth = 700;
          point.btnHeight = 150;
          break;
        case "lg":
          point.minHeight = 200;
          point.titleModel = "h4";
          point.model = "h5";
          point.btnWidth = 500;
          point.btnHeight = 100;
          break;
        case "md":
          point.minHeight = 200;
          point.titleModel = "h6";
          point.model = "subtitle-1";
          point.btnWidth = 325;
          point.btnHeight = 50;
          break;
        case "sm":
          point.minHeight = 200;
          point.titleModel = "subtitle-2";
          point.model = "body-1";
          point.btnWidth = 275;
          point.btnHeight = 40;
          break;
        case "xs":
          point.minHeight = 200;
          point.titleModel = "body-2";
          point.model = "button";
          point.btnWidth = 250;
          point.btnHeight = 30;
          break;
        default:
          break;
      }
      return point;
    },
  },
  methods: {
    setKind(item) {
      this.$store.dispatch(`config/updateKind`, item.text);
      this.$router.push(item.link);
    },
  },
  mounted() {},
};
</script>
