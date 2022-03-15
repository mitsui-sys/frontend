<template>
  <div>
    <v-btn
      color="purple darken-3"
      fab
      small
      @click="changeDisplayType"
      v-if="this.user.level > 0 && showChange"
    >
      <v-icon v-if="isEditing"> mdi-close </v-icon>
      <v-icon v-else> mdi-pencil </v-icon>
    </v-btn>
    <CardInput
      :dialogType="selectIndex"
      :content="editItem"
      :loginType="user.level"
      :bkPoint="bkPoint"
      @clickSubmit="save"
      @clickCancel="windowClose"
    />
    <v-dialog v-model="filedialog" max-width="700px" scrorable persistent>
      <CardFile
        :filepath.sync="filepath"
        :dataType="0"
        :download="true"
        :bkPoint="bkPoint"
        :visible="filedialog"
        :showClose="false"
        @clickSubmit="filedialog = false"
        @clickCancel="filedialog = false"
      />
    </v-dialog>
    <v-snackbar v-model="snackbar" :top="true" :timeout="timeout">
      <span :class="`text-${bkPoint.model}`">{{ snackbarText }}</span>
      <v-btn color="pink" text @click="snackbar = false">閉じる</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Moment from "moment";
import http from "@/modules/http";
import CardInput from "@/components/Card/CardInput";
import CardFile from "@/components/Card/CardFile";
export default {
  name: "detailPage",
  components: { CardInput, CardFile },
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
      showChange: false,
      isEditing: false,
      title: "台帳システム",
      text: "テキストは改行ありだとcssだけで対処しきれないのでtrancate関数を作って対応する",
      detailData: { columns: [], rows: [] },
      items: {},
      windowSize: {
        x: 0,
        y: 0,
      },
      selectIndex: 0,
      snackbar: false,
      snackbarText: "成功",
      snackbarColor: "green",
      timeout: 1000,
      selectedName: "",
      headers: [],
      contents: [],
      editItem: [],
      filedialog: false,
      filepath: "",
      detailTest: [
        { text: "kankoengeeener1", value: "value1" },
        { text: "kanko2", value: "value2" },
        { text: "kanko3", value: "value3" },
      ],
      user: [],
    };
  },
  computed: {
    shownHeaders() {
      return this.headers.filter((h) => h.shown > 0);
    },
    editHeaders() {
      return this.headers.filter((h) => h.shown > 1);
    },
    showContents() {
      let data = this.contents;
      for (const i in data) {
        let row = data[i];
        const headers = this.shownHeaders.filter((x) => x.data_type == "日付");
        for (const h of headers) {
          // const text = h.text;
          const text = h.value;
          const value = row[text];
          //空でなければ
          if (value) {
            row[text] = Moment(value).format("YYYY/MM/DD");
          }
        }
      }
      return data;
    },
    defaultItem() {
      let data = [];
      let header = Object.assign(this.editHeaders);
      console.log("初期値", header);
      for (const h of header) {
        const type = this.setDataType(h.type);
        data.push({ text: h.text, value: null, type: type });
      }
      return data;
    },
    replaceData() {
      return this.$store.getters[`table/replace`];
    },
    displayData() {
      return this.$store.getters[`table/display`];
    },
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
        cardWidth: 800,
        cardHeight: 500,
        btnWidth: 275,
        btnHeight: 40,
        titleModel: "h3",
        model: "h4",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
        case "sm":
        case "xs":
          point.cardWidth = 800;
          point.cardHeight = 500;
          point.btnWidth = 275;
          point.btnHeight = 40;
          point.titleModel = "subtitle-2";
          point.model = "body-1";
          break;

        default:
          break;
      }
      return point;
    },
    detail_user() {
      return this.$store.getters[`table/detail_user`];
    },
    detail_search() {
      return this.$store.getters[`table/detail_search`];
    },
  },
  watch: {
    // slider(v) {
    //   document.querySelector("body").style.fontSize = `${v}px`;
    // },
  },
  methods: {
    changeDisplayType() {
      this.isEditing = !this.isEditing;
      this.selectIndex = this.isEditing ? 0 : 1;
      this.setDisplayData(this.selectIndex, this.originItem);
    },
    setDataType(typeName) {
      return typeName == "整数" || typeName == "小数"
        ? "number"
        : typeName == "文字列"
        ? "text"
        : typeName == "日付"
        ? "date"
        : "text";
    },
    initilize() {
      //表示設定を読み込む
      const user_replace =
        this.replaceData.rows.filter((x) => x.table == this.selectedName) || [];
      //表示属性の順序を変更する
      const user_replace_new = user_replace.sort((a, b) => {
        if (a.display_number < b.display_number) return -1;
        if (b.display_number < a.display_number) return 1;
        return 0;
      });
      //表示属性情報の追加
      let newReplaceData = [];
      for (let rep of user_replace_new) {
        rep["text"] = rep["replace"];
        rep["value"] = rep["column"];
        rep["type"] = this.setDataType(rep["data_type"]);
        rep["shown"] = rep["display_type"];
        newReplaceData.push(rep);
      }
      this.headers = newReplaceData;
    },
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
    async getUserData(user) {
      try {
        const url = `/system/user?user_name=${user}`;
        // const res = await http.get_test(url);
        const res = await http.get(url);
        if (res.status == 200) {
          //成功時
          // console.log("user", res.data);
          const rows = res.data.rows;
          if (rows.length > 0) {
            this.user = rows.shift();
            if (this.user.level > 0) this.selectIndex = 1;
            else this.selectIndex = 0;
            console.log("user", this.user);
          }
        } else {
          // alert("台帳名 失敗");
          // this.snackbarText = "台帳名 失敗";
          // this.snackbar = true;
        }
      } catch (error) {
        console.log("error.name=" + error.name);
        console.log("error.toString()=" + error.toString());
        console.log("Error.prototype.toString()=" + Error.prototype.toString());
        if ("isAxiosError" in error) {
          console.log(`Request URI: ${error.request.path}`);
          console.log(`${error.response.status} ${error.response.statusText}`);
        }
      }
    },
    setDisplayData(index, item) {
      const selected = Object.assign(item);
      const headers = index == 1 ? this.editHeaders : this.shownHeaders;
      let data = [];
      for (const header of headers) {
        let value = selected[header.value];
        //日付型かつデータが存在すればYYYY-MM-DD形式に変換
        if (value) {
          if (header.type == "date") {
            value = Moment(value).format("YYYY-MM-DD");
          }
        }
        data.push({
          text: header.text,
          text_origin: header.value,
          value: value,
          type: header.type,
        });
      }
      console.log("表示データ", data);
      this.editItem = Object.assign(data);
    },
    async getLayerData(layer, content) {
      try {
        this.selectedName = layer;
        const url = `/detail/${layer}?${content}`;
        // const res = await http.get_test(url);
        console.log("url", url);
        const res = await http.get(url);
        if (res.status == 200) {
          //成功時
          const rows = res.data.rows;
          console.log("取得データ", rows);
          if (rows.length <= 0) {
            alert("選択されていません");
            return;
          }
          const selected = rows[0];
          console.log("選択データ", selected);
          this.originItem = Object.assign(selected);
          this.setDisplayData(this.selectIndex, this.originItem);
        } else {
          // alert("台帳名 失敗");
          // this.snackbarText = "台帳名 失敗";
          // this.snackbar = true;
        }
      } catch (error) {
        console.log("error.name=" + error.name);
        console.log("error.toString()=" + error.toString());
        console.log("Error.prototype.toString()=" + Error.prototype.toString());
        if ("isAxiosError" in error) {
          console.log(`Request URI: ${error.request.path}`);
          console.log(`${error.response.status} ${error.response.statusText}`);
        }
      }
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
      const index = this.selectIndex;
      console.log("index", index);
      if (index == 0) {
        const key = "uri";
        console.log("key", key in origin);
        if (key in origin) {
          this.filepath = Object.assign(origin[key]);
          this.filedialog = true;
        } else {
          console.log("ファイルパスが存在しません");
        }
      } else if (index == 1) {
        //update
        let data = {};
        const item1 = Object.assign(content);
        let dataSize = 0;
        for (const i in item1) {
          const text = item1[i].text;
          const value = item1[i].value;
          console.log(text, value);
          if (value != origin[text]) {
            data[text] = value;
            dataSize++;
          }
        }
        const content2 = { data: { key: { gid: id }, update: data } };
        if (dataSize <= 0) {
          alert("更新する値が存在しません");
        } else {
          this.update(content2);
        }
      } else if (index == 2) {
        //delete
        const content3 = { gid: id };
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
        this.snackbarText = "新規登録 成功";
        this.snackbar = true;
        http.registerLog(
          this.user.name,
          "詳細情報",
          this.selectedName,
          "新規登録　成功"
        );
      } else {
        this.snackbarText = "新規登録 失敗";
        this.snackbar = true;
        http.registerLog(
          this.user.name,
          "詳細情報",
          this.selectedName,
          "新規登録　失敗"
        );
      }
    },
    async update(data) {
      const table = this.selectedName;
      const url = `/db/${table}`;
      const res = await http.update(url, data);
      if (res.status == 200) {
        this.snackbarText = "更新 成功";
        this.snackbar = true;
        http.registerLog(
          this.user.name,
          "詳細情報",
          this.selectedName,
          "更新　成功"
        );
      } else {
        this.snackbarText = "更新 失敗";
        this.snackbar = true;
        http.registerLog(
          this.user.name,
          "詳細情報",
          this.selectedName,
          "更新　失敗"
        );
      }
    },
    async delete() {
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
        this.snackbarText = "削除 成功";
        this.snackbar = true;
        http.registerLog(
          this.user.name,
          "詳細情報",
          this.selectedName,
          "削除　成功"
        );
      } else {
        this.snackbarText = "削除 失敗";
        this.snackbar = true;
        http.registerLog(
          this.user.name,
          "詳細情報",
          this.selectedName,
          "削除　失敗"
        );
      }
    },
  },
  mounted() {
    //クエリパラメータがあれば
    let query = this.$route.query;
    console.log(query);
    console.log(this.detail_user);
    console.log(this.detail_search);
    this.getUserData(this.detail_user);
    let search = Object.assign(this.detail_search);
    const layer = Object.assign(search.layer);
    this.selectedName = layer;
    delete search["layer"];
    let contents = [];
    for (const key in search) {
      contents.push(`${key}=${search[key]}`);
    }
    const content = contents.join("&");
    this.initilize();
    this.$nextTick(() => {
      this.getLayerData(layer, content);
    });
  },
};
</script>
