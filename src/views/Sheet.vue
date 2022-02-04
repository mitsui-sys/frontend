<template>
  <v-card class="mx-auto">
    <v-container fluid>
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
              outlined
              label="選択"
              :class="`text-${bkPoint.model}`"
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
              ></v-select>
              <!-- 各入力ボックス -->
              <v-text-field
                v-model="item.value"
                class="flex-col ml-3 mr-3"
                type="text"
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
      <v-card>
        <v-toolbar outlined :height="bkPoint.btnHeight + 10">
          <v-toolbar-title :class="`text-${bkPoint.model}`"
            >テーブル表示</v-toolbar-title
          >
          <v-divider class="mx-4" vertical></v-divider>
          <v-toolbar-title :class="`text-${bkPoint.model}`">
            件数:{{ tblContents.length }}
          </v-toolbar-title>
          <v-spacer />
          <!--
          <v-btn
            @click="getTemplateWorkbook()"
            :class="`text-${bkPoint.model}`"
          >
            Excel出力
          </v-btn>
          -->

          <v-btn
            @click="registerSearch()"
            v-if="select.length > 0 && loginData.level >= 1"
            :class="`text-${bkPoint.model}`"
            :height="bkPoint.btnHeight"
          >
            地図連携
          </v-btn>
          <!--
          <v-btn
            @click="registerItem()"
            v-if="select.length > 0 && loginData.level >= 1"
          >
            ジオメトリ削除
          </v-btn>
          -->
          <v-divider class="mx-4" vertical></v-divider>
          <v-btn
            @click="open(-1)"
            :class="`text-${bkPoint.model} mx-2`"
            :height="bkPoint.btnHeight"
          >
            新規登録
          </v-btn>
          <v-btn
            @click="open(0)"
            v-if="select.length > 0"
            :disabled="!select.length > 0"
            :class="`text-${bkPoint.model} mx-2`"
            :height="bkPoint.btnHeight"
          >
            閲覧
          </v-btn>
          <v-btn
            @click="open(1)"
            v-if="select.length > 0 && loginData.level >= 1"
            :disabled="!select.length > 0"
            :class="`text-${bkPoint.model} mx-2`"
            :height="bkPoint.btnHeight"
          >
            編集
          </v-btn>
          <v-btn
            @click="open(2)"
            v-if="select.length > 0 && loginData.level >= 1"
            :disabled="!select.length > 0"
            :class="`text-${bkPoint.model} mx-2`"
            :height="bkPoint.btnHeight"
          >
            削除
          </v-btn>
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
          :items="tblContents"
          :itemkey="itemkey"
          :bkPoint="bkPoint"
          @childChange="applyChanges"
        />
        <v-dialog v-model="filedialog" max-width="700px" scrorable>
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
    </v-container>
  </v-card>
</template>

<script>
import http from "@/modules/http";
import CardInput from "@/components/Card/CardInput";
import CardFile from "@/components/Card/CardFile";
import MyTable from "@/components/DataTable/MyTable";
// import Filtering from "@/components/DataTable/Filtering";

export default {
  name: "Sheet",
  components: { CardInput, MyTable, CardFile },
  data() {
    return {
      itemkey: "gid",
      displayItems: [],
      tblHeaders: [],
      tblContents: [],
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
      selectedName: "",
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
      // defaultItem: [],
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    search(val) {
      // すでに読み込み済みの場合は、何もしない
      // if (this.items.length > 0) return;
      // 読み込み中の場合も、何もしない
      if (this.isLoading) return;

      this.isLoading = true;
      if (val == null) return;
      let url = `/columns/${val}`;
      let cond = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      console.log(url, cond, option);
      this.axios
        .get(url, cond, option)
        .then((res) => {
          console.log("columns", res.data);
          let columns = res.data.columns;
          this.columns = columns;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
    shownHeaders() {
      return this.tblHeaders.filter((h) => h.shown);
    },
    defaultItem() {
      let data = [];
      let header = Object.assign(this.shownHeaders);
      for (let key in header) {
        data.push({ text: header[key].text, value: "" });
      }
      return data;
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
    initialize() {
      this.selectedName = "";
      this.queryCondition = [];
      this.tblHeaders = [];
      this.tblContents = [];
      this.select = [];
      const url = `${this.url}/display`;
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          const rows = res.data.rows;
          this.display = rows;
          this.displayItems = rows.map((row) => row.name);
          console.log(rows);
          // const json = JSON.parse(rows[0].display);
          // this.headers = json;
        })
        .catch((err) => {
          console.log(err);
        });
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
        if (this.select.length <= 0) {
          alert("選択されていません");
          return;
        }
        const item = Object.assign(this.select[0]);
        console.log(item);
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
    addInput() {
      this.queryCondition.push({ text: "", rule: "", value: "" }); // 配列に１つ空データを追加する
    },
    // ボタンをクリックしたときのイベント ③
    removeInput(index) {
      this.queryCondition.splice(index, 1); // 👈 該当するデータを削除
    },
    changeName() {
      const name = this.selectedName;
      const display = this.display.filter((x) => x.name == name)[0].display;
      const json = JSON.parse(display);
      this.tblHeaders = json;
      this.content = [];
    },
    async registerSearch() {
      if (this.select.length <= 0) {
        alert("選択されていません");
        return;
      }
      const name = this.loginData.name;
      const table = this.selectedName;
      const item = Object.assign(this.select[0]);
      const num = item["番号"] || "?";
      const search = `${table}:${num}`;
      const content = {
        data: { key: { user_name: name }, update: { search: search } },
      };
      console.log(content);
      const json = JSON.stringify(content);
      const url = `/system/user`;
      const res = await http.update(url, content);
      if (res.status == 200) {
        this.getDaicho();
        http.registerLog(
          this.url,
          this.loginData.name,
          "台帳管理",
          "地図連携登録",
          json
        );
        this.snackbarText = "地図連携登録 成功";
        this.snackbar = true;
      } else {
        http.registerLog(
          this.url,
          this.loginData.name,
          "台帳管理",
          "地図連携登録:失敗",
          json
        );
        this.snackbarText = "地図連携登録 失敗";
        this.snackbar = true;
      }
    },
    getCond() {
      const conds = this.queryCondition;
      let contents = [];
      for (const i in conds) {
        let text = conds[i].text;
        let value = conds[i].value;
        contents.push(text + "=" + value);
      }
      return contents.join("&");
    },
    async getDaicho() {
      const name = this.selectedName;
      if (name === undefined || name == null || name == "") {
        console.log("台帳名が選択されていません");
        return;
      }
      //項目を入力したか確認
      const display = this.display.filter((x) => x.name == name)[0].display;
      const json = JSON.parse(display);
      this.tblHeaders = json;

      const cond = this.getCond();
      let url = `/db/${name}?${cond}`;
      const res = await http.get(url);
      if (res.status == 200) {
        const data = res.data;
        const rows = data.rows;
        this.tblContents = rows.length > 0 ? rows : [];
        // this.setDocuments(res);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
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
        http.registerLog(
          this.url,
          this.loginData.name,
          "台帳管理",
          "新規登録",
          data
        );
        this.snackbarText = "新規登録 成功";
        this.snackbar = true;
      } else {
        this.snackbarText = "新規登録 失敗";
        this.snackbar = true;
      }
    },
    async update(data) {
      const table = this.selectedName;
      const url = `/db/${table}`;
      const res = await http.update(url, data);
      if (res.status == 200) {
        this.getDaicho();
        http.registerLog(
          this.url,
          this.loginData.name,
          "台帳管理",
          "更新",
          data
        );
        this.snackbarText = "更新 成功";
        this.snackbar = true;
      } else {
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
        this.getDaicho();
        http.registerLog(
          this.url,
          this.loginData.name,
          "台帳管理",
          "削除",
          data
        );
        this.snackbarText = "削除 成功";
        this.snackbar = true;
      } else {
        this.snackbarText = "削除 失敗";
        this.snackbar = true;
      }
    },
  },
  async mounted() {
    await this.initialize();

    this.$nextTick(() => {
      //this.getResizableTable();
    });
  },
};
</script>
