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
    <v-snackbar v-model="snackbar" :top="true" :timeout="timeout">
      <span :class="`text-${bkPoint.model}`">{{ snackbarText }}</span>
      <v-btn color="pink" text @click="snackbar = false">閉じる</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import http from "@/modules/http";
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
      snackbar: false,
      snackbarText: "成功",
      snackbarColor: "green",
      timeout: 1000,
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
        titleModel: "h2",
        model: "h4",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
          point.cardHeight = 800;
          point.cardWidth = 600;
          point.btnWidth = 500;
          point.btnHeight = 70;
          point.titleModel = "h2";
          point.model = "h4";
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
    save(content) {
      console.log(content);

      const origin = this.originItem;
      const id = origin.gid;
      console.log("origin", id);

      //insert
      let data = {};
      const item = Object.assign(this.editItem);
      for (const i in item) {
        const text = item[i].text;
        const value = item[i].value;
        if (value != null && value != "") data[text] = value;
      }
      const content1 = { data: data };

      //update
      data = {};
      const item1 = Object.assign(content);
      let dataSize = 0;
      for (const i in item1) {
        const text = item1[i].text;
        const value = item1[i].value;
        if (value != origin[text]) {
          data[text] = value;
          dataSize++;
        }
      }
      const content2 = { data: { key: { gid: id }, update: data } };

      //delete
      const content3 = { gid: id };

      const index = this.selectIndex;
      if (index == -1) {
        this.insert(content1);
      } else if (index == 0) {
        const key = "uri";
        if (key in origin) {
          this.filepath = Object.assign(origin[key]);
          this.filedialog = true;
        } else {
          console.log("ファイルパスが存在しません");
        }
      } else if (index == 1) {
        if (dataSize <= 0) {
          console.log("更新する値が存在しません");
        } else {
          this.update(content2);
        }
      } else if (index == 2) {
        this.delete(content3);
      } else {
        this.close();
      }
      this.dialog = false;
    },
    async insert(data) {
      const table = this.selectedName;
      const url = `/db/${table}`;
      const res = await http.create(url, data);
      if (res.status == 200) {
        http.registerLog(
          this.url,
          this.loginData.name,
          "詳細情報",
          "新規登録",
          data
        );
        this.snackbarText = "新規登録 成功";
        this.snackbar = true;
      } else {
        http.registerLog(
          this.url,
          this.loginData.name,
          "詳細情報",
          "新規登録:失敗",
          data
        );
        this.snackbarText = "新規登録 失敗";
        this.snackbar = true;
      }
    },
    async update(data) {
      const table = this.selectedName;
      const url = `/db/${table}`;
      const res = await http.update(url, data);
      if (res.status == 200) {
        http.registerLog(
          this.url,
          this.loginData.name,
          "詳細情報",
          "更新",
          data
        );
        this.snackbarText = "更新 成功";
        this.snackbar = true;
      } else {
        http.registerLog(
          this.url,
          this.loginData.name,
          "詳細情報",
          "更新:失敗",
          data
        );
        this.snackbarText = "更新 失敗";
        this.snackbar = true;
      }
    },
    async delete(data) {
      const select = this.select;
      if (select.length <= 0) {
        console.error("選択されていません");
        return;
      }
      const table = this.selectedName;
      const mainkey = "gid";
      const id = select[0][mainkey];
      let url = `/db/${table}?${mainkey}=${id}`;
      const res = await http.remove(url);
      if (res.status == 200) {
        http.registerLog(
          this.url,
          this.loginData.name,
          "詳細情報",
          "削除",
          data
        );
        this.snackbarText = "削除 成功";
        this.snackbar = true;
      } else {
        http.registerLog(
          this.url,
          this.loginData.name,
          "詳細情報",
          "削除:失敗",
          data
        );
        this.snackbarText = "削除 失敗";
        this.snackbar = true;
      }
    },
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
