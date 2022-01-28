<template>
  <v-card class="mx-auto">
    <v-container fluid>
      <v-card color="#fff">
        <v-row>
          <v-card-title
            class="d-flex justify-center"
            :class="`text-${bkPoint.titleModel}`"
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
              outlined
              label="選択"
              :class="`text-${bkPoint.model}`"
            ></v-autocomplete>
            <v-btn
              @click="submit"
              class="flex-col mb-9 mr-1"
              :class="`text-${bkPoint.model}`"
              >検索</v-btn
            >
            <v-btn
              @click="addInput"
              class="flex-col mb-9 mr-1"
              :class="`text-${bkPoint.model}`"
              >条件追加</v-btn
            >
            <v-btn
              @click="initialize"
              class="flex-col mb-9 mr-1"
              :class="`text-${bkPoint.model}`"
              >クリア</v-btn
            >
          </div>
          <v-card max-height="200" class="overflow-auto ma-0">
            <div
              v-for="(item, index) in queryCondition"
              :key="index"
              class="flex"
              height="50px"
            >
              <v-subheader
                class="flex-col mt-3"
                :class="`text-${bkPoint.model}`"
                >条件{{ index + 1 }}</v-subheader
              >
              <v-select
                v-model="item.text"
                class="flex-col"
                :items="shownHeaders"
                label="項目"
                :class="`text-${bkPoint.model}`"
              ></v-select>
              <!-- 各入力ボックス -->
              <v-text-field
                v-model="item.value"
                class="flex-col ml-3 mr-3"
                type="text"
                label="条件"
                :class="`text-${bkPoint.model}`"
              />
              <!-- 入力ボックスの削除ボタン -->
              <v-btn
                class="flex-col"
                type="button"
                @click="removeInput(index)"
                :class="`text-${bkPoint.model}`"
              >
                削除
              </v-btn>
            </div>
          </v-card>
        </v-card-text>
      </v-card>
      <v-card>
        <v-toolbar flat outlined>
          <v-toolbar-title :class="`text-${bkPoint.model}`"
            >テーブル表示</v-toolbar-title
          >
          <v-divider class="mx-4" vertical></v-divider>
          <span :class="`text-${bkPoint.model}`">
            件数:{{ tblContents.length }}
          </span>
          <v-spacer />
          <v-btn
            @click="getTemplateWorkbook()"
            :class="`text-${bkPoint.model}`"
          >
            Excel出力
          </v-btn>

          <v-btn
            @click="registerItem()"
            v-if="select.length > 0 && loginData.level >= 1"
            :class="`text-${bkPoint.model}`"
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
            @click="createItem()"
            v-if="loginData.level >= 1"
            :class="`text-${bkPoint.model}`"
          >
            新規登録
          </v-btn>
          <v-btn
            @click="editItem(0)"
            v-if="select.length > 0"
            :class="`text-${bkPoint.model}`"
          >
            閲覧
          </v-btn>
          <v-btn
            @click="editItem(1)"
            v-if="select.length > 0 && loginData.level >= 1"
            :class="`text-${bkPoint.model}`"
          >
            編集
          </v-btn>
          <v-btn
            @click="editItem(2)"
            v-if="select.length > 0 && loginData.level >= 1"
            :class="`text-${bkPoint.model}`"
          >
            削除
          </v-btn>
          <v-divider class="mx-4" vertical></v-divider>
          <v-dialog v-model="dialog" max-width="700px" scrorable>
            <CardInput
              :dialogType="editedIndex"
              :content.sync="editedItem"
              :loginType="loginData.level"
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
            :filepath="filepath"
            :dataType="0"
            :download="true"
            :bkPoint="bkPoint"
            @clickSubmit="filedialog = false"
            @clickCancel="filedialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
import MyXlsx from "@/modules/myXlsx";
import CardInput from "@/components/Card/CardInput";
import CardFile from "@/components/Card/CardFile";
import MyTable from "@/components/DataTable/MyTable";
// import Filtering from "@/components/DataTable/Filtering";
import Moment from "moment";

export default {
  name: "Sheet",
  components: { CardInput, MyTable, CardFile },
  data() {
    return {
      itemkey: "gid",
      displayItems: [],
      tblHeaders: [],
      tblContents: [],
      isShown: true,
      snackbar: false,
      snackbarText: "成功",
      snackbarColor: "green",
      timeout: 1000,
      filedialog: false,
      filepath: "",
      isEditing: false,
      editedIndex: -1,
      dateRule: /^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
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
      let url = `${this.url}/columns/${val}`;
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
        minHeight: 200,
        titleModel: "h3",
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
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    url() {
      return this.$store.getters[`backend/url`];
    },
    updateEditedItem() {
      let editedItem = Object.assign(this.editedItem);
      let sendData = {};
      let data = {};
      console.log("edited", editedItem);
      for (let key in editedItem) {
        let text = editedItem[key]["text"];
        let value = editedItem[key]["value"];
        if (text == "id") sendData["id"] = value;
        data[text] = value;
      }

      let select = Object.assign(this.select[0]);
      for (let key in select) {
        if (data[key] == select[key]) {
          delete data[key];
        }
      }
      return data;
    },
    insertEditedItem() {
      let editedItem = Object.assign(this.editedItem);
      let sendData = {};
      let data = {};
      console.log("edited", editedItem);
      for (let key in editedItem) {
        let text = editedItem[key]["text"];
        let value = editedItem[key]["value"];
        if (value != null && value != "") data[text] = value;
      }
      sendData["data"] = [data];
      console.log(sendData);
      return sendData;
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
      this.tblContents = [];
      const url = `${this.url}/display`;
      console.log("get all display", url);
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          console.log("success", res.data);
          const rows = res.data.rows;
          this.display = rows;
          this.displayItems = rows.map((row) => row.name);
          // const json = JSON.parse(rows[0].display);
          // this.headers = json;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatToDateString() {
      // 空文字の場合、変換しない
      if (this.inputDate === "") return;
      // 形式が正しくない場合、変換しない
      if (!this.dateRule.test(this.inputDate)) return;
      const str = String(this.inputDate);
      // 表示用に加工
      this.displayDate = `${str.slice(0, 4)}/${str.slice(4, 6)}/${str.slice(
        6,
        8
      )}`;
      // DB保存用に加工
      this.outputDate = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(
        6,
        8
      )}`;
      this.isEdit = false;
    },
    clickRow() {
      console.log(this.select);
    },
    createItem() {
      this.isEditing = true;
      this.editedIndex = -1;
      this.editedItem = Object.assign(this.defaultItem);
      this.dialog = true;
    },
    registerItem() {
      // let url = `${this.url}/db/${this.selectedName}`;
      const url = `${this.url}/system/search/register`;
      const layer = this.selectedName;
      const select = this.select;
      if (select == "") {
        alert("テーブル名が選択されていません");
        return;
      }
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let rows = [];
      for (const i in select) {
        const num = select[i]["番号"];
        // rows.push({ user_name: this.loginData.name, layer: layer, id: num });
        rows.push(`${layer}:${num}`);
      }
      const row = rows.join("&");
      const cond = { data: { user_name: this.loginData.name, search: row } };
      console.log(url, cond, option);
      this.axios
        .post(url, cond, option)
        .then((response) => {
          console.log(response);
          this.snackbarText = "地図システム検索データ登録 成功";
          this.snackbar = true;
        })
        .catch((error) => {
          this.snackbarText = "地図システム検索データ登録 失敗";
          this.snackbar = true;
          console.log(error);
        });
    },
    editItem(id = 0) {
      this.editedIndex = id;
      this.isEditing = id == 1;
      let select = this.select;
      if (select.length <= 0) {
        return;
      }

      const selected1 = Object.assign(select[0]);

      this.editedNumber = selected1["番号"];
      const data = Object.assign(this.defaultItem);
      let newData = [];
      for (let key in selected1) {
        for (let i in data) {
          let check = data[i]["text"];
          if (key == check) {
            newData.push({ text: key, value: selected1[key] });
          }
        }
      }
      this.editedItem = Object.assign(newData);
      this.dialog = true;
    },
    close() {
      this.isEditing = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save(params) {
      const index = this.editedIndex;
      if (index == 0) {
        console.log("pdfを開く");
        const filepaths = params.filter((x) => x.text == "ファイルパス");
        const filepath = filepaths[0].value || "付属図書";
        this.filepath = filepath;

        console.log("ファイルパス", this.filepath, params);
        this.filedialog = true;
        // let filepath = "resources/test.pdf";
        // window.open(filepath);
      } else {
        if (index == 1) {
          this.updateRows();
        } else if (index == 2) {
          this.deleteRows();
        } else if (index == -1) {
          this.insertRows();
        }
      }
      this.close();
    },
    validate() {
      this.$refs.form.validate();
    },
    addInput() {
      this.queryCondition.push({ text: "", rule: "", value: "" }); // 配列に１つ空データを追加する
    },
    // ボタンをクリックしたときのイベント ③
    removeInput(index) {
      this.queryCondition.splice(index, 1); // 👈 該当するデータを削除
    },
    registerLog(action, content) {
      let url = `${this.url}/system/log/register`;
      let now = Moment().format("YYYY/MM/DD HH:mm:ss dddd");
      let cond = {
        data: {
          user_name: this.loginData.name,
          document: this.kind,
          rireki: action,
          rireki_content: content,
          created: now,
        },
      };
      console.log(cond);
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("操作履歴", url, cond, option);
      this.axios
        .post(url, cond, option)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeName() {
      const name = this.selectedName;
      const display = this.display.filter((x) => x.name == name)[0].display;
      const json = JSON.parse(display);
      this.tblHeaders = json;
      this.content = [];
    },
    submit() {
      const name = this.selectedName;
      if (name === undefined || name == null || name == "") {
        console.log("台帳名が選択されていません");
        return;
      }
      //項目を入力したか確認      this.$store.dispatch(`table/updateTableName`, this.selectedName);
      const display = this.display.filter((x) => x.name == name)[0].display;
      const json = JSON.parse(display);
      this.tblHeaders = json;
      // this.shownHeaders = this.display.filter(x=>x.name==this.selectedName)
      let conds = this.queryCondition;
      let contents = [];
      for (let key in conds) {
        let text = conds[key].text;
        let value = conds[key].value;
        contents.push(text + "=" + value);
      }
      let content = contents.join("&");

      let url = `${this.url}/db/${name}?${content}`;
      let body = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.axios
        .get(url, body, option)
        .then((res) => {
          const data = res.data;
          const rows = data.rows;
          this.tblContents = rows.length > 0 ? rows : [];
          // const columns = data.columns;

          // conklst columnNames = columns.map((x) => x.columnName);
          // let headers = [];
          // for (const i in columnNames) {
          //   const name = columnNames[i];
          //   headers.push({ text: name, value: name, shown: true });
          // }
        })
        .catch((error) => {
          console.log(error);
        });
      this.registerLog("表示", `${this.selectedName}?${content}`);
    },
    insertRows() {
      let url = `${this.url}/db/${this.selectedName}`;
      let cond = this.insertEditedItem;
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(url, cond, option);
      this.axios
        .post(url, cond, option)
        .then((response) => {
          console.log(response);
          this.submit();
          this.snackbarText = "新規登録 成功";
          this.snackbar = true;
        })
        .catch((error) => {
          this.snackbarText = "新規登録 失敗";
          this.snackbar = true;
          console.log(error);
        });
      this.registerLog("追加", `${this.selectedName}?${this.insertEditedItem}`);
    },
    updateRows() {
      let url = `${this.url}/db/${this.selectedName}`;
      let cond = {
        data: {
          key: "番号",
          id: this.editedNumber,
          update: this.updateEditedItem,
        },
      };
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.info("update", url, cond, option);
      this.axios
        .put(url, cond, option)
        .then((response) => {
          console.log(response);
          this.submit();
          this.snackbarText = "更新 成功";
          this.snackbar = true;
        })
        .catch((error) => {
          this.snackbarText = "更新 失敗";
          this.snackbar = true;
          console.log(error);
        });
      this.registerLog("更新", `${this.selectedName}?${this.updateEditedItem}`);
    },
    deleteRows() {
      let url = `${this.url}/db/${this.selectedName}`;
      let cond = { data: { deleteKey: "番号", selectedItem: this.select } };
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(url, cond, option);
      this.axios
        .delete(url, cond, option)
        .then((response) => {
          console.log(response);
          this.submit();
          this.snackbarText = "削除 成功";
          this.snackbar = true;
        })
        .catch((error) => {
          this.snackbarText = "削除 失敗";
          this.snackbar = true;
          console.log(error);
        });
      this.registerLog("削除", `${this.selectedName}?${cond}`);
    },
    getTemplateWorkbook() {
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

      //テーブル情報を読み込む
      let datas = [];
      const content = this.select;
      for (let i in content) {
        let data = Object.assign(assigns);
        const rowC = content[i];
        data["__date__"] = Moment();
        data["__name__"] = "播磨　太郎";
        data["__address__"] = "加古郡播磨町";
        data["__iseki_name__"] = rowC["遺跡の名称"];
        data["__place__"] = rowC["所在地"];
        data["__site_main__"] = rowC["種別"];
        data["__option__"] = rowC["備考"];
        datas.push(data);
      }
      MyXlsx.getTemplateWorkbook(datas);
    },
  },
  async mounted() {
    this.initialize();

    this.$nextTick(() => {
      //this.getResizableTable();
    });
  },
};
</script>
