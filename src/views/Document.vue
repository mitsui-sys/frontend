<template>
  <v-card class="mx-auto">
    <v-container fluid>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-divider
            class="mx-4"
            :class="`text-${bkPoint.model}`"
            vertical
          ></v-divider>
          <v-toolbar-title> 件数：{{ contents.length }} </v-toolbar-title>
          <v-spacer />
          <v-divider class="mx-4" vertical></v-divider>
          <v-btn @click="open(-1)" :class="`text-${bkPoint.model} mx-2`"
            >新規登録</v-btn
          >
          <v-btn
            @click="open(0)"
            :disabled="!select.length > 0"
            :class="`text-${bkPoint.model} mx-2`"
            >閲覧</v-btn
          >

          <v-btn
            @click="open(1)"
            :disabled="!select.length > 0"
            :class="`text-${bkPoint.model} mx-2`"
            >編集</v-btn
          >
          <v-btn
            @click="open(2)"
            :disabled="!select.length > 0"
            :class="`text-${bkPoint.model} mx-2`"
            >削除</v-btn
          >
          <v-divider class="mx-4" vertical></v-divider>
          <v-btn
            class="primary"
            @click="download"
            :disabled="!select.length > 0"
            :class="`text-${bkPoint.model} mx-2`"
            >ダウンロード</v-btn
          >

          <v-dialog v-model="dialog" max-width="700px" scrorable>
            <CardInput
              :dialogType="selectIndex"
              :content="editItem"
              :loginType="loginData"
              :bkPoint="bkPoint"
              @clickSubmit="save"
              @clickCancel="close"
            />
          </v-dialog>
          <v-snackbar v-model="snackbar" :top="true" :timeout="timeout">
            <span :class="`text-${bkPoint.model}`">{{ snackbarText }}</span>
            <v-btn color="pink" text @click="snackbar = false">閉じる</v-btn>
          </v-snackbar>
        </v-toolbar>
        <MyTable
          :headers="shownHeaders"
          :items="contents"
          :itemkey="table.itemkey"
          :bkPoint="bkPoint"
          @childChange="applyChanges"
        />
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
import CardInput from "@/components/Card/CardInput";
import MyTable from "@/components/DataTable/MyTable";
import MyXlsx from "@/modules/myXlsx";
import http from "@/modules/http";
import Moment from "moment";

export default {
  name: "document",
  components: { CardInput, MyTable },
  data() {
    return {
      title: "埋蔵文化財発掘届出・通知書",
      message: "お探しのページが見つかりませんでした。",
      mouse: {
        x: 0,
        y: 0,
      },
      headers: [],
      contents: [],
      itemkey: "書類番号",
      table: {
        header: this.shownHeaders,
        items: this.contents,
        itemkey: "id",
      },
      selectIndex: -1,
      select: [],
      editItem: [],
      originItem: [],
      defaultItem: [],
      dialog: false,
      snackbar: false,
      snackbarText: "",
      timeout: 1000,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
    shownHeaders() {
      return this.headers.filter((x) => x.shown);
    },
    loginData() {
      return this.$store.getters[`auth/login`];
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
          point.titleModel = "h3";
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
  methods: {
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.selectIndex = -1;
        this.editItem = Object.assign({}, this.defaultItem);
        this.reflesh();
      });
    },
    open(index) {
      this.selectIndex = index;

      if (this.selectIndex != -1) {
        if (this.select.length <= 0) {
          alert("選択されていません");
          return;
        }
        const item = Object.assign(this.select[0]);
        this.originItem = Object.assign(item);
        const edit = Object.assign(this.defaultItem);
        let data = [];
        for (const i in edit) {
          const text = edit[i].text;
          data.push({ text: text, value: item[text] });
        }
        this.editItem = Object.assign(data);
      } else {
        this.editItem = Object.assign(this.defaultItem);
      }
      this.dialog = true;
    },
    save() {
      const origin = this.originItem;
      const id = origin.id;
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
      const item1 = Object.assign(this.editItem);
      for (const i in item1) {
        const text = item1[i].text;
        const value = item1[i].value;
        if (value != origin[text]) {
          data[text] = value;
        }
      }
      const content2 = { data: { key: { id: id }, update: data } };

      //delete
      const content3 = { id: id };

      if (this.selectIndex == -1) this.insert(content1);
      if (this.selectIndex == 1) this.update(content2);
      if (this.selectIndex == 2) this.delete(content3);
      this.close();
    },
    download() {
      if (this.select.length <= 0) {
        alert("選択されていません");
        return;
      }
      const assigns = {
        __date__: "令和4年1月14日",
        __name__: "播磨太郎", // エクセル内の__name__という文字列を置換
        __address__: "加古郡播磨町東本荘1丁目5番30番",
        __doc_number__: 5,
        __doc_date__: "令和  年  月  日",
        __city_date__: "令和  年  月  日",
        __place__: "加古郡播磨町大中1丁目1番2号",
        __area__: "約500㎡",
        __owner_name__: "播磨太郎",
        __owner_address__: "加古郡播磨町東本荘1丁目5番30番",
        __iseki_type__: "大中遺跡",
        __iseki_name__: "大中遺跡",
        __iseki_current__: "大中遺跡",
        __iseki_era__: "大中遺跡",
        __site_main__: "大中遺跡",
        __site_content__: "木造2階建個人住宅",
        __site_name__: "播磨太郎",
        __site_address__: "加古郡播磨町東本荘1丁目5番30番",
        __construction_name__: "未定",
        __construction_address__: "",
        __start__: "令和4年7月1日（予定）",
        __end__: "令和4年12月末",
        __option__: "",
        __guidance__: "",
      };

      const count = 24;
      const serialNumber = Array.from({ length: count }).map((v, k) => k);
      console.log(serialNumber); //結果：[0,1,2,3,4]
      // const serialObj = serialNumber.map((k) => ({
      //   id: `item-${k}`,
      // }));
      const serialObj = serialNumber.map((k) => `**value${k}`);
      console.log(serialObj);
      //テーブル情報を読み込む
      let datas = [];

      const content = this.select;
      console.log("書き込みデータ", content[0]);
      console.log(content);
      for (const i in content) {
        console.log(content[i]);
        const data = Object.assign(assigns);
        data["**value1"] = Moment().format("YYYY/MM/DD");
        data["**value2"] = Moment().format("YYYY/MM/DD");
        data["**value3"] = Moment().format("YYYY/MM/DD");
        datas.push(data);
      }
      const filename = "届出・通知書.xlsx";
      const path = "/resources/テンプレート.xlsx";
      MyXlsx.getTemplateWorkbook(path, datas, filename);
    },
    setDocuments(res) {
      let columns = Object.assign(res.data.columns);
      let defaultItem = [];
      for (const i in columns) {
        const name = columns[i].columnName;
        columns[i]["text"] = name;
        columns[i]["value"] = name;
        columns[i]["shown"] = name != "id";
        if (name != "id") {
          let content = {};
          content["text"] = name;
          content["value"] = "";
          defaultItem.push(content);
        }
      }
      const check = (colName, colType) => {
        let isCheck;
        for (const i in columns) {
          const name = columns[i].columnName;
          if (colName == name) {
            const type = columns[i].type;
            isCheck = colType == type;
            break;
          }
        }
        return isCheck;
      };
      let rows = Object.assign(res.data.rows);
      for (const i in rows) {
        let row = rows[i];
        for (const key in row) {
          if (check(key, "DATE")) {
            const value = row[key];
            if (value != undefined)
              row[key] = Moment(value).format("YYYY/MM/DD");
          }
        }
      }

      this.headers = columns;
      this.contents = rows;
      this.defaultItem = Object.assign(defaultItem);
      this.editItem = Object.assign(defaultItem);
    },
    async getDocumentData() {
      const url = `/document`;
      const res = await http.get(url);
      if (res.status == 200) {
        this.setDocuments(res);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        this.snackbarText = "データ取得 失敗";
        this.snackbar = true;
      }
    },
    async insert(data) {
      const url = `/document`;
      const res = await http.create(url, data);
      if (res.status == 200) {
        http.registerLog(
          this.url,
          this.loginData.name,
          "届出管理",
          "新規登録",
          data
        );
        this.snackbarText = "新規登録 成功";
        this.snackbar = true;
      } else {
        http.registerLog(
          this.url,
          this.loginData.name,
          "届出管理",
          "新規登録：失敗",
          data
        );
        this.snackbarText = "新規登録 失敗";
        this.snackbar = true;
      }
    },
    async update(data) {
      const url = `/document`;
      const res = await http.update(url, data);
      if (res.status == 200) {
        http.registerLog(
          this.url,
          this.loginData.name,
          "届出管理",
          "更新",
          data
        );
        this.snackbarText = "更新 成功";
        this.snackbar = true;
      } else {
        http.registerLog(
          this.url,
          this.loginData.name,
          "届出管理",
          "更新：失敗",
          data
        );
        this.snackbarText = "更新 失敗";
        this.snackbar = true;
      }
      this.getDocumentData();
    },
    async delete(data) {
      console.log(data);
      const key = Object.keys(data)[0];
      const value = data[key];
      const url = `/document?${key}=${value}`;
      const res = await http.remove(url);
      if (res.status == 200) {
        http.registerLog(
          this.url,
          this.loginData.name,
          "届出管理",
          "削除",
          data
        );
        this.snackbarText = "削除 成功";
        this.snackbar = true;
      } else {
        http.registerLog(
          this.url,
          this.loginData.name,
          "届出管理",
          "削除：失敗",
          data
        );
        this.snackbarText = "削除 失敗";
        this.snackbar = true;
      }
      this.getDocumentData();
    },
    reflesh() {
      this.getDocumentData();
    },
    async getTest() {
      let url = `/test/mst_004_web_input_type`;
      let res = await http.get(url);
      if (res.status == 200) {
        console.log(res.data);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        this.snackbarText = "データ取得 失敗";
        this.snackbar = true;
      }
      url = `/test/mst_005_ruins_type`;
      res = await http.get(url);
      if (res.status == 200) {
        console.log(res.data);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        this.snackbarText = "データ取得 失敗";
        this.snackbar = true;
      }
      url = `/test/mst_006_ruins_current`;
      res = await http.get(url);
      if (res.status == 200) {
        console.log(res.data);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        this.snackbarText = "データ取得 失敗";
        this.snackbar = true;
      }
      url = `/test/mst_007_ruins_era`;
      res = await http.get(url);
      if (res.status == 200) {
        console.log(res.data);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        this.snackbarText = "データ取得 失敗";
        this.snackbar = true;
      }
      url = `/test/mst_008_construction_purpose`;
      res = await http.get(url);
      if (res.status == 200) {
        console.log(res.data);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        this.snackbarText = "データ取得 失敗";
        this.snackbar = true;
      }
      url = `/test/mst_009_guidance`;
      res = await http.get(url);
      if (res.status == 200) {
        console.log(res.data);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        this.snackbarText = "データ取得 失敗";
        this.snackbar = true;
      }
    },
  },
  mounted() {
    this.getTest();
    this.reflesh();
  },
};
</script>
