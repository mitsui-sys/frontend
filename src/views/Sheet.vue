<template>
  <div>
    <v-card color="#fff">
      <v-row>
        <v-card-title
          class="d-flex justify-center"
          :class="`text-${bkPoint.model}`"
          >検索条件</v-card-title
        >
      </v-row>
      <v-card-text class="d-flex justify-center flex-column search">
        <div class="flex">
          <v-subheader class="flex-col" :class="`text-${bkPoint.model}`"
            >台帳名</v-subheader
          >
          <v-autocomplete
            v-model="selectedName"
            class="flex-col mr-3"
            :items="displayItems"
            :search-input.sync="search"
            :height="bkPoint.btnHeight"
            :class="`text-${bkPoint.model}`"
            outlined
            label="選択"
            :value="initValue"
            @change="changeName"
          ></v-autocomplete>
          <v-btn
            @click="getDaicho"
            class="flex-col mb-11 mr-1"
            :height="bkPoint.btnHeight"
            :class="`text-${bkPoint.model}`"
            >検索</v-btn
          >
          <v-btn
            @click="addInput"
            class="flex-col mb-11 mr-1"
            :height="bkPoint.btnHeight"
            :class="`text-${bkPoint.model}`"
            >条件追加</v-btn
          >
          <v-btn
            @click="initialize"
            class="flex-col mb-11 mr-1"
            :height="bkPoint.btnHeight"
            :class="`text-${bkPoint.model}`"
            >クリア</v-btn
          >
        </div>
        <v-card max-height="200" class="overflow-auto ma-0">
          <div
            v-for="(item, index) in queryCondition"
            :key="index"
            class="flex"
            :height="bkPoint.btnHeight"
          >
            <v-subheader
              class="flex-col mt-3"
              :class="`text-${bkPoint.model}`"
              :height="bkPoint.btnHeight"
              >条件{{ index + 1 }}</v-subheader
            >
            <v-select
              v-model="item.text"
              class="flex-col"
              :items="shownHeaders"
              label="項目"
              :class="`text-${bkPoint.model}`"
              :height="bkPoint.btnHeight"
              @change="changeQueryCond(item.text, index)"
            >
            </v-select>
            <!-- 各入力ボックス -->
            <v-text-field
              v-model="item.value"
              class="flex-col ml-3 mr-3"
              :type="`${item.type}`"
              label="条件"
              :class="`text-${bkPoint.model}`"
              :height="bkPoint.btnHeight"
            />
            <!-- 入力ボックスの削除ボタン -->
            <v-btn
              class="flex-col"
              type="button"
              @click="removeInput(index)"
              :class="`text-${bkPoint.model}`"
              :height="bkPoint.btnHeight"
            >
              削除
            </v-btn>
          </div>
        </v-card>
      </v-card-text>
    </v-card>
    <v-card class="ma-3">
      <v-toolbar outlined :height="bkPoint.btnHeight + 10">
        <v-toolbar-title :class="`text-${bkPoint.model}`"
          >テーブル表示</v-toolbar-title
        >
        <v-divider class="mx-4" vertical></v-divider>
        <v-toolbar-title :class="`text-${bkPoint.model}`">
          件数:{{ contents.length }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          @click="registerSearch()"
          v-if="select.length > 0"
          :class="`text-${bkPoint.model}`"
          :height="bkPoint.btnHeight"
        >
          地図連携
        </v-btn>
        <v-divider class="mx-4" vertical></v-divider>
        <v-btn
          @click="open(-1)"
          :disabled="!(selectedName != '' && loginData.level >= 1)"
          :class="`text-${bkPoint.model} mx-2`"
          :height="bkPoint.btnHeight"
        >
          新規登録
        </v-btn>
        <v-btn
          @click="open(0)"
          :disabled="!(select.length > 0)"
          :class="`text-${bkPoint.model} mx-2`"
          :height="bkPoint.btnHeight"
        >
          閲覧
        </v-btn>
        <v-btn
          @click="open(1)"
          :disabled="!(select.length > 0 && loginData.level >= 1)"
          :class="`text-${bkPoint.model} mx-2`"
          :height="bkPoint.btnHeight"
        >
          編集
        </v-btn>
        <v-btn
          @click="open(2)"
          :disabled="!(select.length > 0 && loginData.level >= 1)"
          :class="`text-${bkPoint.model} mx-2`"
          :height="bkPoint.btnHeight"
        >
          削除
        </v-btn>
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
        :headers="shownHeaders"
        :items="showContents"
        :itemkey="itemkey"
        :bkPoint="bkPoint"
        :sortByItem="sortByItem"
        :sortByDesc="sortByDesc"
        @childChange="applyChanges"
      />
      <v-dialog v-model="filedialog" max-width="700px" scrorable persistent>
        <CardFile
          :filepath.sync="filepath"
          :dataType="0"
          :download="true"
          :bkPoint="bkPoint"
          :visible="filedialog"
          @clickSubmit="filedialog = false"
          @clickCancel="filedialog = false"
        />
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import http from "@/modules/http";
import CardInput from "@/components/Card/CardInput";
import CardFile from "@/components/Card/CardFile";
import MyTable from "@/components/DataTable/MyTable";
import Moment from "moment";
// import Filtering from "@/components/DataTable/Filtering";

export default {
  name: "Sheet",
  components: { CardInput, MyTable, CardFile },
  data() {
    return {
      initFirst: false, //初回設定フラグ
      itemkey: "gid",
      displayItems: [],
      headers: [],
      contents: [],
      snackbar: false,
      snackbarText: "成功",
      snackbarColor: "green",
      timeout: 1000,
      filedialog: false,
      filepath: "",
      isEditing: false,
      editedIndex: -1,
      editedItem: {},
      fileDialog: false,
      fileDialogPath: "",
      dialog: false,
      selectedName: "指定文化財",
      select: [],
      selectedId: -1,
      valid: false,
      singleSelect: true,
      success: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      search: "",
      pagination: {},
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      showSelected: true,
      queryCondition: [],
      display: [],
      editItem: [],
      originItem: [],
      selectIndex: "",
      initValue: "初期値",
      sortByItem: ["年度", "番号"],
      sortByDesc: [false, false],
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    selectedName() {
      this.content = [];
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
        // const type = this.setDataType(h.type);
        data.push({
          text: h.text,
          value: null,
          type: h.type,
          text_origin: h.value,
        });
      }
      return data;
    },
    replaceData() {
      return this.$store.getters[`table/replace`];
    },
    displayData() {
      return this.$store.getters[`table/display`];
    },
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        cardWidth: 800,
        cardHeight: 200,
        btnWidth: 500,
        btnHeight: 70,
        titleModel: "h3",
        model: "h4",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
          point.cardWidth = 800;
          point.cardHeight = 500;
          point.btnWidth = 500;
          point.btnHeight = 70;
          point.titleModel = "h3";
          point.model = "h5";
          break;
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
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    kind() {
      return this.$store.getters[`config/kind`];
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
    changeName() {
      console.log("台帳名の変更");
      const name = this.selectedName;
      //属性表示情報の取得
      const data = this.display.filter((x) => x.name == name).shift() || null;
      if (data != null) {
        //ソート情報の初期化
        console.log(data);
        // const display = JSON.parse(data.display);
        // this.tblHeaders = display;
        const sort_default = JSON.parse(data.sort_default);
        this.sortByItem = sort_default.map((x) => x.column) || [];
        this.sortByDesc = sort_default.map((x) => x.desc) || [];
        console.log(this.sortByItem, this.sortByDesc);
        console.log("sort", sort_default);
      }

      let user_replace =
        this.replaceData.rows.filter((x) => x.table == this.selectedName) ||
        null;

      let newReplaceData = [];
      //表示属性の順序を変更する
      const user_replace_new = user_replace.sort((a, b) => {
        if (a.display_number < b.display_number) return -1;
        if (b.display_number < a.display_number) return 1;
        return 0;
      });
      // for (let data of user_replace_new) {
      //   console.log(data.display_number);
      // }
      // console.log("置換ソート", user_replace_new);
      for (let rep of user_replace_new) {
        rep["text"] = rep["replace"];
        rep["value"] = rep["column"];
        rep["type"] = this.setDataType(rep["data_type"]);
        rep["shown"] = rep["display_type"];
        newReplaceData.push(rep);
      }

      this.headers = newReplaceData;
      // console.log("置換設定", user_replace);
      // console.log("置換設定_新", newReplaceData);
      // console.log("show", this.shownHeaders);
      // console.log("edit", this.editHeaders);

      this.contents = [];
      this.queryCondition = [];
    },
    changeQueryCond(value, index) {
      // console.log(value);
      // console.log(
      //   this.shownHeaders.filter((x) => x.text == value).shift().type
      // );
      const type =
        this.shownHeaders.filter((x) => x.text == value).shift().type || "text";
      let cond = this.queryCondition;
      cond[index]["type"] = type;
    },
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    onSubmit(path) {
      console.log("onSubmit", path);
      this.dialog = false;
    },
    onCancel() {
      this.dialog = false;
    },
    async getDefault() {
      const url = `/display`;
      const res = await http.get(url);
      if (res.status == 200) {
        //台帳グループのみ抽出
        const rows = res.data.rows.filter((x) => x.type == 1);
        //表示設定を取得
        this.display = rows;
        const sorted = rows.sort((a, b) => (a.sortNo > b.sortNo ? 1 : -1));
        const items = sorted.map((x) => x.name);
        this.displayItems = items;
        if (!this.initFirst) {
          this.initFirst = true;
          //初期値に項目の最初の値を
          console.log(this.displayItems);
          this.selectedName = this.displayItems[0];
          this.changeName();
        }
      } else {
        this.snackbarText = "台帳名 失敗";
        this.snackbar = true;
      }
    },
    clear() {},
    async initialize() {
      this.selectedName = "";
      this.queryCondition = [];
      this.headers = [];
      this.contents = [];
      this.select = [];
      this.getDefault();
    },
    clickRow() {
      console.log("選択行", this.select);
    },
    close() {
      this.isEditing = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
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
          console.log(data);
        }
        this.editItem = Object.assign(data);
      } else {
        this.editItem = Object.assign(this.defaultItem);
      }
      this.dialog = true;
    },
    save() {
      const origin = this.originItem;
      const id = origin.gid;
      console.log("origin", id);

      const index = this.selectIndex;
      if (index == -1) {
        //insert
        let data = {};
        const item = Object.assign(this.editItem);
        for (const i in item) {
          const text = item[i].text;
          const value = item[i].value;
          if (value != null && value != "") data[text] = value;
        }
        const content1 = { data: data };
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
        //update
        let data = {};
        const item1 = Object.assign(this.editItem);
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
        if (dataSize <= 0) {
          console.log("更新する値が存在しません");
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
    addInput() {
      this.queryCondition.push({ text: "", rule: "", value: "", type: "" }); // 配列に１つ空データを追加する
    },
    // ボタンをクリックしたときのイベント ③
    removeInput(index) {
      this.queryCondition.splice(index, 1); // 👈 該当するデータを削除
    },

    async registerSearch() {
      if (this.select.length <= 0) {
        alert("選択されていません");
        return;
      }
      const name = this.loginData.name;
      const tableName = this.selectedName;

      const kc_key = this.display.filter((x) => x.name == tableName)[0][
        "kc_key"
      ];
      const item = Object.assign(this.select[0]);
      const num = item[kc_key] || "?";
      console.log(item);
      if (num == "?") {
        alert("連携キーが見つかりません");
        return;
      }
      const search = `${tableName}:${num}`;
      const content = {
        data: { key: { user_name: name }, update: { search: search } },
      };
      console.log(content);
      const url = `/system/user`;
      const res = await http.update(url, content);
      if (res.status == 200) {
        this.getDaicho();
        this.snackbarText = "地図連携登録 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          this.selectedName,
          "地図連携登録　成功"
        );
      } else {
        this.snackbarText = "地図連携登録 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          this.selectedName,
          "地図連携登録　失敗"
        );
      }
    },
    getCond() {
      const conds = this.queryCondition;
      let contents = [];
      for (const c of conds) {
        const text = c.text;
        const value = c.value;
        const type = c.type;
        contents.push(text + "=" + value + ":" + type);
      }
      return contents.join("&");
    },
    async getDaicho() {
      const name = this.selectedName;
      if (name === undefined || name == null || name == "") {
        console.log("台帳名が選択されていません");
        return;
      }

      const cond = this.getCond();
      let url = `/db/${name}?${cond}`;
      const res = await http.get(url);
      // const res = await http.get_test(url);
      if (res.status == 200) {
        const data = res.data;
        const rows = data.rows;
        this.contents = rows || [];
        // console.log("台帳", rows);
      } else {
        this.snackbarText = "データ取得 失敗";
        this.snackbar = true;
      }
    },
    async insert(data) {
      const table = this.selectedName;
      const url = `/db/${table}`;
      const res = await http.create(url, data);
      if (res.status == 200) {
        this.getDaicho();
        this.snackbarText = "新規登録 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          this.selectedName,
          "新規登録　成功"
        );
      } else {
        this.snackbarText = "新規登録 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
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
        this.getDaicho();
        this.snackbarText = "更新 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          this.selectedName,
          "更新　成功"
        );
      } else {
        this.snackbarText = "更新 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
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
        this.getDaicho();
        this.snackbarText = "削除 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          this.selectedName,
          "削除　成功"
        );
      } else {
        this.snackbarText = "削除 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          this.selectedName,
          "削除　失敗"
        );
      }
    },
  },
  created() {
    // this.getReplace();
    this.initialize();
  },
  mounted() {},
};
</script>
