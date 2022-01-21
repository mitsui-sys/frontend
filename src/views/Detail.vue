<template>
  <v-card class="mx-auto">
    <v-container fluid>
      <v-card>
        <v-card-title>
          <v-row align="center">
            <v-col cols="12" :class="`text-${bkPoint.titleModel}`"
              >{{ title }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><a @click="windowClose" :class="`text-${bkPoint.model}`"
                >詳細画面を閉じる</a
              ></v-col
            >
          </v-row>
          <v-row>
            <v-col>
              <v-slider
                v-model="slider"
                :class="`text-${bkPoint.model}`"
                :max="max"
                :min="min"
                hide-details
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="slider"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>
          <v-row v-resize="onResize" align="center">
            <v-subheader :class="`text-${bkPoint.model}`"
              >Window Size</v-subheader
            >
            {{ windowSize }}
          </v-row>

          <!--
      <v-btn v-if="level >= 1" @click="isEditing = !isEditing">
        <v-icon v-if="isEditing"> mdi-close </v-icon>
        <v-icon v-else> mdi-pencil </v-icon>
        {{ "編集" }}</v-btn
      >
      <v-btn v-if="level >= 1" @click="deleteRows">
        <v-icon> mdi-delete </v-icon>
        {{ "削除" }}</v-btn
      >
      -->
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-container style="max-height: 600px" class="overflow-y">
            <v-row
              v-for="(item, index) in items"
              :key="index"
              no-gutters
              class="pa-0 ma-0"
            >
              <v-col cols="4">
                <v-subheader :class="`text-${bkPoint.model}`">{{
                  item.text
                }}</v-subheader>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="item.value"
                  placeholder="値を入力"
                  outlined
                  hide-details
                  :disabled="!isEditing"
                  :class="`text-${bkPoint.model} ma-2`"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="level >= 1">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="blue darken-1"
            text
            :disabled="!isEditing"
            @click="updateRows"
            :class="`text-${bkPoint.model}`"
          >
            更新
          </v-btn>
          <v-btn
            outlined
            color="blue darken-1"
            text
            :class="`text-${bkPoint.model}`"
          >
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "detailPage",
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
      url: "http://harima-isk:50001",
      detailData: { columns: [], rows: [] },
      items: {},
      user: null,
      loading: false,
      level: -1,
      hasSaved: false,
      isEditing: null,
      window: this.$root,
      dialog: false,
      location: "no",
      windowSize: {
        x: 0,
        y: 0,
      },
      min: 0,
      max: 80,
      slider: 24,
      iconSize: 0,
      menus: [
        { title: "home", icon: "mdi-home" },
        { title: "currency", icon: "mdi-currency-cny" },
        { title: "gift", icon: "mdi-gift" },
        { title: "kaji", icon: "mdi-washing-machine" },
      ],
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    imageHeight() {
      // 画面サイズに合わせた高さを返却します。
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "220px";
        case "sm":
          return "400px";
        case "md":
          return "500px";
        case "lg":
          return "600px";
        case "xl":
          return "800px";
        default:
          return "600px";
      }
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
        minHeight: 200,
        titleModel: "",
        model: "h6",
        btnWidth: 350,
        btnHeight: 50,
      };
      switch (bkPt.name) {
        case "xl":
          point.minHeight = 200;
          point.titleModel = "h3";
          point.model = "h5";
          point.btnWidth = 600;
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
          this.detailData.columns = res.data.columns;
          this.detailData.rows = res.data.rows;
          const rows = res.data.rows;
          for (const i in rows) {
            if (user == rows[i]["user_name"]) {
              this.user = rows[i]["user_name"];
              this.level = rows[i]["level"];
              if (this.level >= 1) this.isEditing = true;
              break;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getLayerData(layer, content) {
      const url = `http://harima-isk:50001/db/${layer}?${content}`;
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
    console.log(this.imageHeight);
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
