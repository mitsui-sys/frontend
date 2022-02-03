<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" align="center">
        <v-card :width="bkPoint.cardWidth" justify="center">
          <v-card-title
            :class="`text-${bkPoint.titleModel} justify-center cyan`"
            outlind
          >
            {{ title }}
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col v-for="(item, index) in items" :key="index" cols="12">
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      title: "ホーム画面",
      label: { link: "利用規約", text: "に同意して利用する" },
      items: [
        { text: "遺跡台帳管理", link: "/sheet", color: "gray" },

        {
          text: "埋蔵文化財発掘届出・通知書管理",
          link: "/document",
          color: "gray",
        },
        // { text: "操作方法", link: "/manual" },
        // { text: "照会・回答調査台帳", link: "/sheet", color: "gray" },
        // { text: "発掘調査台帳", link: "/sheet", color: "gray" },
        // { text: "指定文化財台帳", link: "/sheet", color: "gray" },
        // { text: "ファイル登録", link: "/fileregister", color: "gray" },
        // { text: "台帳管理", link: "/sheet"},
        // { text: "帳票出力", link: "/chohyo"},
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
        cardHeight: 500,
        cardWidth: 800,
        btnWidth: 500,
        btnHeight: 70,
        titleModel: "h3",
        model: "h5",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
          point.cardHeight = 500;
          point.cardWidth = 800;
          point.btnWidth = 500;
          point.btnHeight = 70;
          point.titleModel = "h3";
          point.model = "h5";
          break;
        case "sm":
        case "xs":
          point.cardHeight = 400;
          point.cardWidth = 400;
          point.btnWidth = 300;
          point.btnHeight = 70;
          point.titleModel = "h3";
          point.model = "h5";
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
