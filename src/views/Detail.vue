<template>
  <v-card class="mx-auto">
    <!--
    <v-subheader :class="`text-${bkPoint.model}`">Window Size</v-subheader>
    {{ windowSize }}
  -->
    <CardInput
      :dialogType="dialogType"
      :content.sync="items"
      :loginType="loginData.level"
      :bkPoint="bkPoint"
      @clickSubmit="save"
      @clickCancel="windowClose"
    />
  </v-card>
</template>

<script>
import CardInput from "@/components/Card/CardInput";
export default {
  name: "detailPage",
  components: { CardInput },
  filter: {
    /**
     * 文字を切り捨てる [色んな所で使うので共通化するといいよ！]
     * @param {String} text
     * @param {Number} length
     * @param {String} clamp
     */
    truncate(text, length, clamp) {
      text = text || "";
      clamp = clamp || "...";
      length = length || 30;

      if (text.length <= length) return text;
      return text.substring(0, length) + clamp;
    },
  },
  data() {
    return {
      title: "台帳システム",
      text: "テキストは改行ありだとcssだけで対処しきれないのでtrancate関数を作って対応する",
      detailData: { columns: [], rows: [] },
      items: {},
      windowSize: {
        x: 0,
        y: 0,
      },
      dialogType: 0,
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    url() {
      return this.$store.getters[`backend/url`];
    },
    style() {
      return "height: " + this.windowSize.y * 0.8 + "px;";
    },
    fontstyle() {
      return "font-size: " + this.slider + "px;";
    },
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        cardHeight: 800,
        cardWidth: 600,
        btnWidth: 500,
        btnHeight: 70,
        titleModel: "h3",
        model: "h5",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
          point.cardHeight = 800;
          point.cardWidth = 600;
          point.btnWidth = 500;
          point.btnHeight = 70;
          point.titleModel = "h4";
          point.model = "h5";
          break;
        case "sm":
        case "xs":
          point.cardHeight = 800;
          point.cardWidth = 600;
          point.btnWidth = 500;
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
  watch: {
    // slider(v) {
    //   document.querySelector("body").style.fontSize = `${v}px`;
    // },
  },
  methods: {
    windowClose() {
      window.open("about:blank", "_self");
      window.close();
      //   window.open("about:blank", "_self").close();
      //   window.open("", "_self").close();
      //   window.close();
      // `window.closed`を参照することでページが閉じられているかを確認できます。
      if (!window.closed) {
        alert("閉じるのに失敗しました");
      }
    },
    windowPrint() {
      window.print();
    },
    windowSubWindow() {
      const subWinObj1 = window.open(
        this.$route.path,
        "詳細画面",
        "top=0,left=0,height=400,width=520,resizable=yes, scrollbars=yes"
      );
      window.focus(); // 自画面からフォーカスを取得
      subWinObj1.focus(); // サブウインドウにフォーカスを設定する
    },
    // サブウインドウを印刷する
    cman_winSubPrint1() {
      let subWinObj1; //サブウインドウオブジェクト
      if (!subWinObj1 || subWinObj1.closed) {
        alert("サブウインドウが見つかりません");
      } else {
        subWinObj1.print();
        subWinObj1.focus(); // サブウインドウにフォーカスを設定する
      }
    },
    getUserData(user) {
      const url = `${this.url}/system/user`;
      const body = {};
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.loading = true;
      this.axios
        .get(url, body, option)
        .then((res) => {
          console.log("user", res.data);
          const rows = res.data.rows;
          for (const i in rows) {
            if (user == rows[i]["user_name"]) {
              const level = rows[i]["level"];
              if (level >= 1) this.dialogType = 1;
              break;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getLayerData(layer, content) {
      const url = `${this.url}/db/${layer}?${content}`;
      const body = {};
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.loading = true;
      console.log(url);
      this.axios
        .get(url, body, option)
        .then((res) => {
          const data = res.data.rows;
          console.log(data);
          if (data.length > 0) {
            let data0 = data[0];
            let tmp = [];
            for (let key in data0) {
              if (!["gid", "geometry"].includes(key)) {
                let row = { text: key, value: data0[key] };
                tmp.push(row);
              }
            }
            this.items = tmp;
            console.log(tmp);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
      const name = this.$vuetify.breakpoint.name;
      console.log(name);
      console.log(this.model);
      this.iconSize = window.innerHeight * 0.1;
    },
    updateRows() {},
    deleteRows() {},
  },
  mounted() {
    this.onResize();
    //クエリパラメータがあれば
    let query = this.$route.query;

    if (Object.keys(query).length > 0) {
      console.log("query", query);
      //パラメータにlayerが存在するか
      if ("layer" in query) {
        const layer = query.layer?.slice();
        const user = query.user?.slice();
        delete query["layer"];
        delete query["user"];
        let contents = [];
        for (const key in query) {
          contents.push(`${key}=${query[key]}`);
        }
        const content = contents.join("&");
        this.getLayerData(layer, content);
        console.log("ユーザ確認", user);
        this.getUserData(user);
      }
    }
  },
};
</script>

<style></style>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  color: blue;
  p {
    font-weight: bold;
  }
}
</style>
