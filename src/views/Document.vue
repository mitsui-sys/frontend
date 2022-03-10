<template>
  <v-card class="mx-auto">
    <v-container fluid>
      <v-card>
        <v-toolbar outlined :height="bkPoint.btnHeight + 10">
          <v-toolbar-title :class="`text-${bkPoint.model}`">{{
            title
          }}</v-toolbar-title>
          <v-divider
            class="mx-4"
            :class="`text-${bkPoint.model}`"
            vertical
          ></v-divider>
          <v-toolbar-title :class="`text-${bkPoint.model}`">
            件数：{{ contents.length }}
          </v-toolbar-title>
          <v-spacer />
          <v-divider class="mx-4" vertical></v-divider>
          <v-btn
            @click="open(-1)"
            :disabled="!(loginData.level >= 1)"
            :class="`text-${bkPoint.model} mx-2`"
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
            :disabled="!(select.length > 0 && loginData.level >= 1)"
            :class="`text-${bkPoint.model} mx-2`"
            >編集</v-btn
          >
          <v-btn
            @click="open(2)"
            :disabled="!(select.length > 0 && loginData.level >= 1)"
            :class="`text-${bkPoint.model} mx-2`"
            >削除</v-btn
          >
          <v-divider class="mx-4" vertical></v-divider>
          <v-btn
            class="primary"
            @click="download"
            :disabled="!(select.length > 0)"
            :class="`text-${bkPoint.model} mx-2`"
            >ダウンロード</v-btn
          >

          <v-dialog v-model="dialog" max-width="700px" scrorable persistent>
            <CardInput
              :dialogType="selectIndex"
              :content="editItem"
              :loginType="loginData"
              :bkPoint="bkPoint"
              :showClose="true"
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
          :select.sync="select"
          :headers="shownHeaders"
          :items="showContents"
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
      select: [],
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
      editItem: [],
      originItem: [],

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
        // const headers = this.shownHeaders.filter((x) => x.type == "DATE");
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
        let rules = [];
        if (h.type == "number") {
          if (h.min) {
            const rule = (v) => v >= h.min || `値は${h.min}以上にしてください`;
            rules.push(rule);
          }
          if (h.max) {
            const rule = (v) => v <= h.max || `値は${h.max}以下にしてください`;
            rules.push(rule);
          }
        } else if (h.type == "date") {
          // if (h.min) {
          //   const rule = (v) => v >= h.min || `値は${h.min}以上にしてください`;
          //   rules.push(rule);
          // }
          console.log("日付");
        }
        data.push({
          text: h.text,
          text_origin: h.value,
          value: null,
          type: h.type,
          min: h.min,
          max: h.max,
          rules: rules,
        });
      }
      console.log("defalut", data);
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
      const user_replace =
        this.replaceData.rows.filter((x) => x.table == "document") || null;
      console.log("置換設定", user_replace);
      let newReplaceData = [];
      //表示属性の順序を変更する
      const user_replace_new = user_replace.sort((a, b) => {
        if (a.display_number < b.display_number) return -1;
        if (b.display_number < a.display_number) return 1;
        return 0;
      });
      for (let rep of user_replace_new) {
        rep["text"] = rep["replace"];
        rep["value"] = rep["column"];
        rep["type"] = this.setDataType(rep["data_type"]);
        rep["shown"] = rep["display_type"];
        newReplaceData.push(rep);
      }
      console.log("置換設定_新", newReplaceData);
      this.headers = newReplaceData;
      console.log("show", this.shownHeaders);
      console.log("edit", this.editHeaders);
    },
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    close() {
      this.editItem = [];
      this.dialog = false;
      this.$nextTick(() => {
        this.selectIndex = -1;
      });
    },
    open(index) {
      this.selectIndex = index;

      if (this.selectIndex != -1) {
        //閲覧:0
        //更新:1
        //削除:2
        if (this.select.length <= 0) {
          alert("選択されていません");
          return;
        }
        const selected = this.select[0];
        console.log("選択データ", selected);
        this.originItem = Object.assign(selected);
        const headers =
          this.selectIndex == 1 ? this.editHeaders : this.shownHeaders;
        let data = [];
        for (const h of headers) {
          //データを取得
          let text = h.text;
          let text_origin = h.value;
          let type = h.type;
          let value = selected[h.value];
          let min = h.min;
          let max = h.max;
          //ルールの設定
          let rules = [];
          if (type == "number") {
            if (h.min) {
              const rule = (v) =>
                v >= h.min || `値は${h.min}以上にしてください`;
              rules.push(rule);
            }
            if (h.max) {
              const rule = (v) =>
                v <= h.max || `値は${h.max}以下にしてください`;
              rules.push(rule);
            }
          }
          //日付型かつデータが存在すればYYYY-MM-DD形式に変換
          if (value) {
            if (type == "date") {
              value = Moment(value).format("YYYY-MM-DD");
            }
          }

          data.push({
            text: text,
            text_origin: text_origin,
            value: value,
            type: type,
            rules: rules,
            min: min,
            max: max,
          });
        }
        console.log(data);
        this.editItem = Object.assign(data);
      } else {
        let data = [];
        let header = Object.assign(this.editHeaders);
        console.log("初期値", header);
        for (const h of header) {
          let rules = [];
          if (h.type == "number") {
            if (h.min) {
              const rule = (v) =>
                v >= h.min || `値は${h.min}以上にしてください`;
              rules.push(rule);
            }
            if (h.max) {
              const rule = (v) =>
                v <= h.max || `値は${h.max}以下にしてください`;
              rules.push(rule);
            }
          } else if (h.type == "date") {
            // if (h.min) {
            //   const rule = (v) => v >= h.min || `値は${h.min}以上にしてください`;
            //   rules.push(rule);
            // }
          }
          data.push({
            text: h.text,
            text_origin: h.value,
            value: null,
            type: h.type,
            min: h.min,
            max: h.max,
            rules: rules,
          });
        }
        this.editItem = Object.assign(data);
        // this.editItem = Object.assign(this.defaultItem);
      }
      this.dialog = true;
      // this.selectIndex = index;

      // if (this.selectIndex != -1) {
      //   //閲覧:0
      //   //更新:1
      //   //削除:2
      //   if (this.select.length <= 0) {
      //     alert("選択されていません");
      //     return;
      //   }
      //   const selected = this.select[0];
      //   console.log("選択データ", selected);
      //   this.originItem = Object.assign(selected);
      //   const headers =
      //     this.selectIndex == 1 ? this.editHeaders : this.shownHeaders;
      //   let data = [];
      //   for (const header of headers) {
      //     let value = selected[header.value];
      //     //日付型かつデータが存在すればYYYY-MM-DD形式に変換
      //     if (value) {
      //       if (header.type == "date") {
      //         value = Moment(value).format("YYYY-MM-DD");
      //       }
      //     }
      //     data.push({
      //       text: header.text,
      //       text_origin: header.value,
      //       value: value,
      //       type: header.type,
      //       min: header.min,
      //       max: header.max,
      //     });
      //   }
      //   this.editItem = Object.assign(data);
      // } else {
      //   this.editItem = Object.assign(this.defaultItem);
      // }
      // this.dialog = true;
    },
    save(content) {
      const origin = this.originItem;
      const id = origin.id;
      console.log("origin", id);

      if (this.selectIndex == -1) {
        console.log("新規登録");
        //insert
        let data = {};
        // const items = Object.assign(this.editItem);
        for (const item of content) {
          const text = item.text;
          const value = item.value;
          if (value != null && value != "") data[text] = value;
        }
        const content1 = { data: data };
        this.insert(content1);
      } else if (this.selectIndex == 0) {
        console.log("閲覧");
      } else if (this.selectIndex == 1) {
        console.log("更新");
        //update
        let data = {};
        const item1 = content; //Object.assign(this.editItem);
        for (const i in item1) {
          const text = item1[i].text;
          const value = item1[i].value;
          if (value != origin[text]) {
            data[text] = value;
          }
        }
        const content2 = { data: { key: { id: id }, update: data } };
        this.update(content2);
      } else if (this.selectIndex == 2) {
        console.log("削除");
        //delete
        const content3 = { id: id };
        this.delete(content3);
      }
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

      //書き込み番号
      const count = 25;
      const serialNumber = Array.from({ length: count }).map((v, k) => k);
      console.log(serialNumber); //結果：[0,1,2,3,4]
      const serialObj = serialNumber.map((k) => `**value${k}`);
      console.log(serialObj);
      //テーブル情報を読み込む
      let datas = [];

      const content = this.select;
      console.log("書き込みデータ", content[0]);
      console.log(content);
      for (const i in content) {
        console.log(content[i]);
        let data = Object.assign(assigns);
        let index = 0;
        for (const test in content[i]) {
          console.log(test);
          const value = content[i][test] || "";
          const name = `**value${index}`;
          data[name] = value;
          index++;
        }
        //データ番号
        while (index <= count) {
          const name = `**value${index}`;
          data[name] = "";
          index++;
        }
        data["**created"] = new Date();
        console.log(data);
        datas.push(data);
      }
      const filename = "届出・通知書.xlsx";
      const path = "/resources/テンプレート.xlsx";
      //届出・通知書をファイルに出力
      MyXlsx.getTemplateWorkbook(path, datas, filename);
      http.registerLog(
        this.loginData.name,
        "台帳管理",
        "届出・通知書",
        "ダウンロードしました。"
      );
    },
    async getDocumentData() {
      this.select = [];
      const url = `/document`;
      const res = await http.get(url);
      if (res.status == 200) {
        this.contents = res.data.rows;
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
        this.reflesh();
        this.snackbarText = "新規登録 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "届出・通知書",
          "新規登録　成功"
        );
      } else {
        this.snackbarText = "新規登録 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "届出・通知書",
          "新規登録　失敗"
        );
      }
    },
    async update(data) {
      console.log("Update", data);
      const url = `/document`;
      const res = await http.update(url, data);
      if (res.status == 200) {
        this.reflesh();
        this.snackbarText = "更新 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "届出・通知書",
          "更新　成功"
        );
      } else {
        this.snackbarText = "更新 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "届出・通知書",
          "更新　失敗"
        );
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
        this.reflesh();
        this.snackbarText = "削除 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "届出・通知書",
          "削除　成功"
        );
      } else {
        this.snackbarText = "削除 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "届出・通知書",
          "削除　失敗"
        );
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
    // this.getTest();
    this.initilize();
    this.reflesh();
  },
};
</script>
